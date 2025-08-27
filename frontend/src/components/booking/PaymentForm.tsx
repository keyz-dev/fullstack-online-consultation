import React, { useState, useEffect } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointmentPaymentTracker } from "@/hooks/useAppointmentPaymentTracker";
import { appointmentsAPI } from "@/api/appointments";
import {
  Calendar,
  Clock,
  User,
  Video,
  DollarSign,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

interface PaymentStatus {
  status: "pending" | "processing" | "success" | "failed";
  message: string;
}

const PaymentForm: React.FC = () => {
  const { state, dispatch } = useBooking();
  const { user } = useAuth();
  const router = useRouter();
  const { trackPayment, stopTrackingPayment, paymentStatus } =
    useAppointmentPaymentTracker();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentStatus>({
    status: "pending",
    message: "Ready to process payment",
  });
  const [appointmentId, setAppointmentId] = useState<number | null>(null);

  // Calculate total amount
  const totalAmount = state.timeSlot?.consultationFee || 0;

  const handleCreateAppointment = async () => {
    if (!user || !state.doctorId || !state.timeSlotId) {
      toast.error("Missing required information");
      return;
    }

    setIsProcessing(true);
    setPaymentInfo({
      status: "processing",
      message: "Creating appointment...",
    });

    try {
      // Create appointment
      const appointmentData = {
        doctorId: state.doctorId?.toString(),
        timeSlotId: state.timeSlotId?.toString(),
        consultationType: state.consultationType,
        notes: state.notes,
        symptomIds: state.symptomIds,
      };

      const appointmentResponse = await appointmentsAPI.createAppointment(
        appointmentData
      );
      const newAppointmentId = appointmentResponse.data.appointment.id;
      setAppointmentId(newAppointmentId);

      setPaymentInfo({
        status: "processing",
        message: "Initiating payment...",
      });

      // Initiate payment
      const paymentData = {
        appointmentId: newAppointmentId.toString(),
        phoneNumber: user.phoneNumber || "",
      };

      const paymentResponse = await appointmentsAPI.initiatePayment(
        paymentData
      );

      if (paymentResponse.success) {
        setPaymentInfo({
          status: "processing",
          message:
            "Payment initiated. Please check your phone for payment request.",
        });

        // Start tracking payment
        trackPayment(paymentResponse.paymentReference);

        toast.success(
          "Payment request sent to your phone. Please complete the payment."
        );
      } else {
        throw new Error(
          paymentResponse.message || "Failed to initiate payment"
        );
      }
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      setPaymentInfo({
        status: "failed",
        message: error.message || "Failed to create appointment",
      });
      toast.error(error.message || "Failed to create appointment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment status updates
  useEffect(() => {
    if (paymentStatus) {
      switch (paymentStatus.status) {
        case "success":
          setPaymentInfo({
            status: "success",
            message: "Payment successful! Your appointment has been confirmed.",
          });
          stopTrackingPayment();

          // Mark step as completed
          dispatch({
            type: "SET_STEP_COMPLETED",
            payload: { stepIndex: 4, completed: true },
          });

          // Redirect to success page after a delay
          setTimeout(() => {
            router.push(`/appointments/${appointmentId}`);
          }, 2000);
          break;

        case "failed":
          setPaymentInfo({
            status: "failed",
            message: "Payment failed. Please try again.",
          });
          stopTrackingPayment();
          break;

        case "pending":
          setPaymentInfo({
            status: "processing",
            message: "Waiting for payment confirmation...",
          });
          break;
      }
    }
  }, [paymentStatus, appointmentId, router, dispatch, stopTrackingPayment]);

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = () => {
    switch (paymentInfo.status) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "processing":
        return <Loader className="w-6 h-6 text-blue-500" />;
      default:
        return <CreditCard className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentInfo.status) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      case "processing":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Payment & Confirmation
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Review your appointment details and complete payment to confirm your
        booking.
      </p>

      {/* Appointment Summary */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
          Appointment Summary
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              Dr. {state.doctor?.user.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {state.appointmentDate && formatDate(state.appointmentDate)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {state.appointmentTime && formatTime(state.appointmentTime)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {state.consultationType === "online" ? (
              <Video className="w-4 h-4 text-gray-500" />
            ) : (
              <User className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-gray-600 dark:text-gray-400 capitalize">
              {state.consultationType} consultation
            </span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
          Payment Details
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-blue-800 dark:text-blue-200">
            Consultation Fee:
          </span>
          <span className="font-medium text-blue-900 dark:text-blue-100">
            ${totalAmount.toFixed(2)}
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-900 dark:text-blue-100">
              Total Amount:
            </span>
            <span className="font-bold text-lg text-blue-900 dark:text-blue-100">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      {paymentInfo.status !== "pending" && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className={`font-medium ${getStatusColor()}`}>
                {paymentInfo.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              Secure Payment
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              Your payment is processed securely through Campay. We use
              industry-standard encryption to protect your information.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {paymentInfo.status === "pending" && (
          <button
            onClick={handleCreateAppointment}
            disabled={isProcessing}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ${totalAmount.toFixed(2)}
              </>
            )}
          </button>
        )}

        {paymentInfo.status === "processing" && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Please complete the payment on your phone. You'll receive a
              notification once payment is confirmed.
            </p>
            <button
              onClick={() => stopTrackingPayment()}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel Payment
            </button>
          </div>
        )}

        {paymentInfo.status === "success" && (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-green-600 dark:text-green-400 font-medium">
              Payment successful! Redirecting to appointment details...
            </p>
          </div>
        )}

        {paymentInfo.status === "failed" && (
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 dark:text-red-400 mb-3">
              Payment failed. Please try again.
            </p>
            <button
              onClick={handleCreateAppointment}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
