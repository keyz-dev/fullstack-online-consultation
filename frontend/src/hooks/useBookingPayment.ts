import { useCallback, useEffect } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointmentPaymentTracker } from "./useAppointmentPaymentTracker";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { appointmentsAPI } from "@/api/appointments";
import { DocumentFile } from "@/components/ui";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { extractErrorMessage } from "@/utils/extractError";

export const useBookingPayment = () => {
  const { state, dispatch } = useBooking();
  const { user } = useAuth();
  const { trackPayment, stopTrackingPayment, getPaymentStatus } =
    useAppointmentPaymentTracker();
  const { addNotification } = useNotificationContext();
  const router = useRouter();

  const createAppointmentAndInitiatePayment = useCallback(
    async (phoneNumber: string) => {
      if (!user || !state.doctorId || !state.timeSlotId) {
        toast.error("Missing required information");
        return;
      }

      // Validate phone number
      if (!phoneNumber || phoneNumber.trim() === "") {
        toast.error("Phone number is required");
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_PAYMENT_STATUS", payload: "processing" });
      dispatch({
        type: "SET_PAYMENT_MESSAGE",
        payload: "Creating appointment...",
      });

      try {
        // Create appointment
        const appointmentData = {
          doctorId: state.doctorId?.toString(),
          timeSlotId: state.timeSlotId?.toString(),
          consultationType: state.consultationType || "online",
          notes: state.notes,
          symptomIds: state.symptomIds,
          documents:
            state.medicalDocuments
              ?.map((doc: DocumentFile) => doc.file)
              .filter((file): file is File => file !== undefined) || [],
          documentNames:
            state.medicalDocuments
              ?.map((doc: DocumentFile) => doc.documentName || doc.name)
              .filter((name): name is string => name !== undefined) || [],
        };
        console.log("Appointment data:", appointmentData);

        const appointmentResponse = await appointmentsAPI.createAppointment(
          appointmentData
        );
        const newAppointmentId = appointmentResponse.data.appointment.id;

        dispatch({ type: "SET_APPOINTMENT_ID", payload: newAppointmentId });
        dispatch({
          type: "SET_PAYMENT_MESSAGE",
          payload: "Initiating payment...",
        });

        // Initiate payment
        const paymentData = {
          appointmentId: newAppointmentId.toString(),
          phoneNumber: phoneNumber,
        };

        const paymentResponse = await appointmentsAPI.initiatePayment(
          paymentData
        );

        if (paymentResponse.success) {
          dispatch({
            type: "SET_PAYMENT_REFERENCE",
            payload: paymentResponse.paymentReference,
          });
          dispatch({
            type: "SET_PAYMENT_MESSAGE",
            payload:
              "Payment initiated. Please check your phone for payment request.",
          });

          // Start tracking payment
          trackPayment(
            paymentResponse.paymentReference,
            newAppointmentId.toString()
          );

          toast.success(
            "Payment request sent to your phone. Please complete the payment."
          );
        } else {
          throw new Error(
            paymentResponse.message || "Failed to initiate payment"
          );
        }
      } catch (error: unknown) {
        console.error("Error creating appointment:", error);
        const errorMessage = extractErrorMessage(error as any);

        dispatch({ type: "SET_PAYMENT_STATUS", payload: "failed" });
        dispatch({ type: "SET_PAYMENT_MESSAGE", payload: errorMessage });
        dispatch({ type: "SET_ERROR", payload: errorMessage });

        toast.error(errorMessage);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [user, state, dispatch, trackPayment]
  );

  const handlePaymentSuccess = useCallback(() => {
    dispatch({ type: "SET_PAYMENT_STATUS", payload: "success" });
    dispatch({
      type: "SET_PAYMENT_MESSAGE",
      payload: "Payment successful! Your appointment has been confirmed.",
    });

    // Mark step as completed
    dispatch({
      type: "SET_STEP_COMPLETED",
      payload: { stepIndex: 5, completed: true },
    });

    // Stop tracking payment
    if (state.paymentReference) {
      stopTrackingPayment(state.paymentReference);
    }

    // Create success notification
    if (user) {
      addNotification({
        id: Date.now(), // Temporary ID for frontend
        title: "Payment Successful",
        message: `Your payment of FCFA ${
          state.timeSlot?.consultationFee || 0
        } has been processed successfully. Your appointment with Dr. ${
          state.doctor?.user.name
        } is confirmed.`,
        type: "payment_successful",
        priority: "high",
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: {
          relatedId: state.appointmentId?.toString(),
          relatedModel: "Appointment",
          category: "payments",
        },
      });
    }

    // Redirect to appointments list after a delay
    setTimeout(() => {
      router.push("/patient/appointments");
    }, 2000);
  }, [
    dispatch,
    state.paymentReference,
    state.appointmentId,
    state.timeSlot,
    state.doctor,
    stopTrackingPayment,
    router,
    user,
    addNotification,
  ]);

  const handlePaymentFailure = useCallback(() => {
    dispatch({ type: "SET_PAYMENT_STATUS", payload: "failed" });
    dispatch({
      type: "SET_PAYMENT_MESSAGE",
      payload: "Payment failed. Please try again.",
    });

    // Stop tracking payment
    if (state.paymentReference) {
      stopTrackingPayment(state.paymentReference);
    }

    // Create failure notification
    if (user) {
      addNotification({
        id: Date.now(), // Temporary ID for frontend
        title: "Payment Failed",
        message: `Your payment of FCFA ${
          state.timeSlot?.consultationFee || 0
        } has failed. Please try again or contact support if the issue persists.`,
        type: "payment_failed",
        priority: "high",
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: {
          relatedId: state.appointmentId?.toString(),
          relatedModel: "Appointment",
          category: "payments",
        },
      });
    }
  }, [
    dispatch,
    state.paymentReference,
    state.timeSlot,
    stopTrackingPayment,
    user,
    addNotification,
    state.appointmentId,
  ]);

  const cancelPayment = useCallback(() => {
    if (state.paymentReference) {
      stopTrackingPayment(state.paymentReference);
    }

    dispatch({ type: "SET_PAYMENT_STATUS", payload: "pending" });
    dispatch({
      type: "SET_PAYMENT_MESSAGE",
      payload: "Ready to process payment",
    });
    dispatch({ type: "SET_PAYMENT_REFERENCE", payload: null });
  }, [dispatch, state.paymentReference, stopTrackingPayment]);

  // Monitor payment status changes from the payment tracker
  useEffect(() => {
    if (state.paymentReference) {
      const paymentStatus = getPaymentStatus(state.paymentReference);
      if (paymentStatus) {
        if (paymentStatus.status === "SUCCESSFUL") {
          handlePaymentSuccess();
        } else if (paymentStatus.status === "FAILED") {
          handlePaymentFailure();
        }
      }
    }
  }, [
    state.paymentReference,
    getPaymentStatus,
    handlePaymentSuccess,
    handlePaymentFailure,
  ]);

  return {
    createAppointmentAndInitiatePayment,
    handlePaymentSuccess,
    handlePaymentFailure,
    cancelPayment,
    paymentStatus: state.paymentStatus,
    paymentMessage: state.paymentMessage,
    isLoading: state.isLoading,
    appointmentId: state.appointmentId,
    paymentReference: state.paymentReference,
  };
};
