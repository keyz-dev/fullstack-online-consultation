import React, { useState, useEffect } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBookingPayment } from "@/hooks/useBookingPayment";
import { Button, DocumentFile, PhoneInput } from "@/components/ui";
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
  const { state } = useBooking();
  const { user } = useAuth();
  const router = useRouter();
  const {
    createAppointmentAndInitiatePayment,
    cancelPayment,
    paymentStatus,
    paymentMessage,
    isLoading,
  } = useBookingPayment();

  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [phoneError, setPhoneError] = useState("");

  // Calculate total amount - ensure it's a number
  const totalAmount = Number(state.timeSlot?.consultationFee) || 0;

  const handleCreateAppointment = async () => {
    // Validate phone number
    if (!phoneNumber || phoneNumber.trim() === "") {
      setPhoneError("Phone number is required");
      return;
    }

    // Use the booking payment hook
    await createAppointmentAndInitiatePayment(phoneNumber);
  };

  // Handle payment status updates - this will be handled by the payment tracker hook
  // The payment tracker will show toast notifications for status updates

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
    switch (paymentStatus) {
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
    switch (paymentStatus) {
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
            FCFA {totalAmount.toFixed(2)}
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-900 dark:text-blue-100">
              Total Amount:
            </span>
            <span className="font-bold text-lg text-blue-900 dark:text-blue-100">
              FCFA {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      {paymentStatus !== "pending" && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className={`font-medium ${getStatusColor()}`}>
                {paymentMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Phone Number Input */}
      <div className="mb-6">
        <PhoneInput
          label="Phone Number"
          name="phoneNumber"
          value={phoneNumber}
          onChangeHandler={(e) => {
            setPhoneNumber(e.target.value);
            if (phoneError) setPhoneError("");
          }}
          placeholder="Enter your phone number for payment"
          required={true}
          error={phoneError}
        />
      </div>

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
        {paymentStatus === "pending" && (
          <div className="w-full flex justify-end">
            <Button
              onClickHandler={handleCreateAppointment}
              isDisabled={
                isLoading || !phoneNumber || phoneNumber.trim() === ""
              }
              additionalClasses="secondarybtn"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay {totalAmount.toFixed(2)} XAF
                </>
              )}
            </Button>
          </div>
        )}

        {paymentStatus === "processing" && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Please complete the payment on your phone. You&apos;ll receive a
              notification once payment is confirmed.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClickHandler={cancelPayment}
                additionalClasses="outlinebtn"
                text="Cancel Payment"
              />
              <Button
                onClickHandler={() => router.push("/patient")}
                additionalClasses="outlinebtn"
                text="Back to Dashboard"
              />
            </div>
          </div>
        )}

        {paymentStatus === "success" && (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-green-600 dark:text-green-400 font-medium mb-3">
              Payment successful! Your appointment has been confirmed.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Redirecting to your dashboard in a few seconds...
            </p>
          </div>
        )}

        {paymentStatus === "failed" && (
          <div className="flex items-center w-full flex-col">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 dark:text-red-400 mb-3">
              Payment failed. Please try again or return to dashboard.
            </p>
            <div className="flex gap-3">
              <Button
                onClickHandler={handleCreateAppointment}
                additionalClasses="secondarybtn"
                text="Try Again"
              />
              <Button
                onClickHandler={() => router.push("/patient")}
                additionalClasses="outlinebtn"
                text="Back to Dashboard"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
