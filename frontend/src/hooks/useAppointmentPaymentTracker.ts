import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE_URL } from "@/api";

interface PaymentStatus {
  reference: string;
  status: "PENDING" | "SUCCESSFUL" | "FAILED" | "CANCELLED";
  appointmentId: string;
  message: string;
  timestamp: Date;
}

interface AppointmentPaymentTracker {
  isConnected: boolean;
  trackPayment: (paymentReference: string, appointmentId: string) => void;
  stopTrackingPayment: (paymentReference: string) => void;
  getPaymentStatus: (paymentReference: string) => PaymentStatus | null;
  isTrackingPayment: (paymentReference: string) => boolean;
  clearAllPayments: () => void;
}

export const useAppointmentPaymentTracker = (): AppointmentPaymentTracker => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [paymentStatuses, setPaymentStatuses] = useState<
    Record<string, PaymentStatus>
  >({});
  const [trackedPayments, setTrackedPayments] = useState<Set<string>>(
    new Set()
  );

  // Initialize socket connection
  useEffect(() => {
    if (!user || trackedPayments.size === 0) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    // Connect to Socket.IO server
    socketRef.current = io(API_BASE_URL.replace("/api", ""), {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    // Connection event handlers
    socketRef.current.on("connect", () => {
      console.log("🔌 Connected to appointment payment socket");
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔌 Disconnected from appointment payment socket");
      setIsConnected(false);
    });

    // Payment status update events
    socketRef.current.on("payment-initiated", (data: any) => {
      console.log("💳 Payment initiated:", data);
      updatePaymentStatus(data.reference, {
        reference: data.reference,
        status: "PENDING",
        appointmentId: data.appointmentId,
        message:
          data.message || "Payment request sent. Please check your phone.",
        timestamp: new Date(data.timestamp),
      });

      toast.info(
        "Payment initiated. Please check your phone for the payment prompt.",
        {
          autoClose: 5000,
        }
      );
    });

    socketRef.current.on("payment-status-update", (data: PaymentStatus) => {
      console.log("💳 Payment status updated:", data);
      updatePaymentStatus(data.reference, data);

      if (data.status === "SUCCESSFUL") {
        toast.success(
          "Payment completed successfully! Your appointment is confirmed.",
          {
            autoClose: 5000,
          }
        );
      } else if (data.status === "FAILED") {
        toast.error("Payment failed. Please try again.", {
          autoClose: 5000,
        });
      } else if (data.status === "CANCELLED") {
        toast.warning("Payment was cancelled.", {
          autoClose: 5000,
        });
      }
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, trackedPayments.size]);

  // Update payment status helper
  const updatePaymentStatus = useCallback(
    (reference: string, statusData: PaymentStatus) => {
      setPaymentStatuses((prev) => ({
        ...prev,
        [reference]: statusData,
      }));
    },
    []
  );

  // Track a payment
  const trackPayment = useCallback(
    (paymentReference: string, appointmentId: string) => {
      if (trackedPayments.has(paymentReference)) {
        console.log(`Already tracking payment ${paymentReference}`);
        return;
      }

      console.log(`👤 Starting to track payment: ${paymentReference}`);

      // Add to tracked payments
      setTrackedPayments((prev) => new Set([...prev, paymentReference]));

      // Initialize status
      updatePaymentStatus(paymentReference, {
        reference: paymentReference,
        status: "PENDING",
        appointmentId,
        message: "Payment tracking started...",
        timestamp: new Date(),
      });

      // Join payment room via socket
      if (socketRef.current && isConnected) {
        socketRef.current.emit("track-payment", {
          paymentReference,
          userId: user?.id,
        });
        console.log(`🔌 Socket tracking enabled for ${paymentReference}`);
      }
    },
    [isConnected, user?.id, trackedPayments, updatePaymentStatus]
  );

  // Stop tracking a payment
  const stopTrackingPayment = useCallback(
    (paymentReference: string) => {
      console.log(`🛑 Stopping tracking for payment: ${paymentReference}`);

      // Leave payment room via socket
      if (socketRef.current && isConnected) {
        socketRef.current.emit("stop-tracking-payment", {
          paymentReference,
        });
      }

      // Remove from tracked payments
      setTrackedPayments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(paymentReference);
        return newSet;
      });

      // Remove from status
      setPaymentStatuses((prev) => {
        const newStatus = { ...prev };
        delete newStatus[paymentReference];
        return newStatus;
      });
    },
    [isConnected]
  );

  // Get status for a specific payment
  const getPaymentStatus = useCallback(
    (paymentReference: string): PaymentStatus | null => {
      return paymentStatuses[paymentReference] || null;
    },
    [paymentStatuses]
  );

  // Check if a payment is being tracked
  const isTrackingPayment = useCallback(
    (paymentReference: string): boolean => {
      return trackedPayments.has(paymentReference);
    },
    [trackedPayments]
  );

  // Clear all tracked payments
  const clearAllPayments = useCallback(() => {
    trackedPayments.forEach((paymentReference) => {
      stopTrackingPayment(paymentReference);
    });
  }, [trackedPayments, stopTrackingPayment]);

  return {
    isConnected,
    trackPayment,
    stopTrackingPayment,
    getPaymentStatus,
    isTrackingPayment,
    clearAllPayments,
  };
};
