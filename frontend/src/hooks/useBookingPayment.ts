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

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_PAYMENT_STATUS", payload: "processing" });
      dispatch({
        type: "SET_PAYMENT_MESSAGE",
        payload: "Creating appointment...",
      });

      // Set a timeout to reset loading state if something goes wrong
      const loadingTimeout = setTimeout(() => {
        console.warn("Payment loading timeout - resetting loading state");
        dispatch({ type: "SET_LOADING", payload: false });
      }, 30000); // 30 seconds timeout

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

          // Clear the timeout since payment was initiated successfully
          clearTimeout(loadingTimeout);
        } else {
          throw new Error(
            paymentResponse.message || "Failed to initiate payment"
          );
        }
      } catch (error: unknown) {
        console.error("Error creating appointment:", error);
        const errorMessage = extractErrorMessage(error as Error);

        dispatch({ type: "SET_PAYMENT_STATUS", payload: "failed" });
        dispatch({ type: "SET_PAYMENT_MESSAGE", payload: errorMessage });
        dispatch({ type: "SET_ERROR", payload: errorMessage });

        toast.error(errorMessage);

        // Clear the timeout since we're handling the error
        clearTimeout(loadingTimeout);
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

    // Reset loading state
    dispatch({ type: "SET_LOADING", payload: false });

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

    // Redirect to patient dashboard after a delay
    setTimeout(() => {
      router.push("/patient");
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
      payload: "Payment failed. Please try again or return to dashboard.",
    });

    // Reset loading state
    dispatch({ type: "SET_LOADING", payload: false });

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

    // Reset loading state
    dispatch({ type: "SET_LOADING", payload: false });
  }, [dispatch, state.paymentReference, stopTrackingPayment]);

  // New function to retry payment for failed transactions
  const retryPayment = useCallback(
    async (phoneNumber: string) => {
      if (!user || !state.appointmentId) {
        toast.error("Missing appointment information for retry");
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_PAYMENT_STATUS", payload: "processing" });
      dispatch({
        type: "SET_PAYMENT_MESSAGE",
        payload: "Retrying payment...",
      });

      try {
        // Retry payment for existing appointment
        const paymentData = {
          appointmentId: state.appointmentId.toString(),
          phoneNumber: phoneNumber,
        };

        const paymentResponse = await appointmentsAPI.retryPayment(paymentData);

        if (paymentResponse.success) {
          dispatch({
            type: "SET_PAYMENT_REFERENCE",
            payload: paymentResponse.paymentReference,
          });
          dispatch({
            type: "SET_PAYMENT_MESSAGE",
            payload:
              "Payment retry initiated. Please check your phone for payment request.",
          });

          // Start tracking payment
          trackPayment(
            paymentResponse.paymentReference,
            state.appointmentId.toString()
          );

          toast.success("Payment retry initiated successfully");
        } else {
          throw new Error(paymentResponse.message || "Failed to retry payment");
        }
      } catch (error: unknown) {
        console.error("Error retrying payment:", error);
        const errorMessage = extractErrorMessage(error as Error);

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

  // Monitor payment status changes from the payment tracker
  useEffect(() => {
    if (state.paymentReference) {
      const paymentStatus = getPaymentStatus(state.paymentReference);
      if (paymentStatus) {
        if (paymentStatus.status === "SUCCESSFUL") {
          handlePaymentSuccess();
        } else if (
          paymentStatus.status === "FAILED" ||
          paymentStatus.status === "CANCELLED"
        ) {
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

  // Helper function to map backend status to frontend status
  const mapBackendStatusToFrontend = useCallback(
    (
      backendStatus: string
    ): "pending" | "processing" | "success" | "failed" => {
      switch (backendStatus) {
        case "SUCCESSFUL":
          return "success";
        case "FAILED":
        case "CANCELLED":
          return "failed";
        case "PENDING":
          return "processing";
        default:
          return "pending";
      }
    },
    []
  );

  // Listen for payment status updates from socket events
  useEffect(() => {
    const handlePaymentStatusUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{
        status: string;
        reference: string;
        appointmentId: string;
        message: string;
      }>;
      const { status, reference } = customEvent.detail;

      // Only handle events for the current payment reference
      if (reference === state.paymentReference) {
        if (status === "SUCCESSFUL") {
          handlePaymentSuccess();
        } else if (status === "FAILED" || status === "CANCELLED") {
          handlePaymentFailure();
        }
      }
    };

    window.addEventListener(
      "payment-status-updated",
      handlePaymentStatusUpdate
    );

    return () => {
      window.removeEventListener(
        "payment-status-updated",
        handlePaymentStatusUpdate
      );
    };
  }, [state.paymentReference, handlePaymentSuccess, handlePaymentFailure]);

  // Cleanup loading state on unmount
  useEffect(() => {
    return () => {
      // Reset loading state when component unmounts
      dispatch({ type: "SET_LOADING", payload: false });
    };
  }, [dispatch]);

  return {
    createAppointmentAndInitiatePayment,
    retryPayment,
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
