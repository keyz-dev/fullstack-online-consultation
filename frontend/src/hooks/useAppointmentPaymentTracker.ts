import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "./useSocket";
import { shouldShowNotification } from "@/utils/notificationDeduplicator";

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
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(false);
  const [paymentStatuses, setPaymentStatuses] = useState<
    Record<string, PaymentStatus>
  >({});
  const [trackedPayments, setTrackedPayments] = useState<Set<string>>(
    new Set()
  );

  // Update connection status when socket changes
  useEffect(() => {
    if (socket.socket) {
      setIsConnected(socket.socket.connected);

      // Listen for connection events
      const handleConnect = () => {
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        setIsConnected(false);
      };

      socket.socket.on("connect", handleConnect);
      socket.socket.on("disconnect", handleDisconnect);

      // Set initial connection status
      setIsConnected(socket.socket.connected);

      return () => {
        if (socket.socket) {
          socket.socket.off("connect", handleConnect);
          socket.socket.off("disconnect", handleDisconnect);
        }
      };
    } else {
      setIsConnected(false);
    }
  }, [socket]);

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

  // Payment status update events
  useEffect(() => {
    if (!socket.socket) return;

    // Payment status update events
    const handlePaymentInitiated = (data: {
      reference: string;
      appointmentId: string;
      message?: string;
      timestamp: string;
    }) => {
      updatePaymentStatus(data.reference, {
        reference: data.reference,
        status: "PENDING",
        appointmentId: data.appointmentId,
        message:
          data.message || "Payment request sent. Please check your phone.",
        timestamp: new Date(data.timestamp),
      });
    };

    const handlePaymentStatusUpdate = (data: PaymentStatus) => {
      updatePaymentStatus(data.reference, data);

      // Only dispatch event if not a duplicate

      const shouldDispatch = shouldShowNotification(
        'payment_tracker',
        data.message || '',
        data.reference,
        user?.id?.toString()
      );

      if (shouldDispatch) {
        // Dispatch custom event for the booking payment hook to listen to
        const event = new CustomEvent("payment-status-updated", {
          detail: {
            status: data.status,
            reference: data.reference,
            appointmentId: data.appointmentId,
            message: data.message,
          },
        });
        window.dispatchEvent(event);
      }
    };

    socket.socket.on("payment-initiated", handlePaymentInitiated);
    socket.socket.on("payment-status-update", handlePaymentStatusUpdate);

    return () => {
      if (socket.socket) {
        socket.socket.off("payment-initiated", handlePaymentInitiated);
        socket.socket.off("payment-status-update", handlePaymentStatusUpdate);
      }
    };
  }, [socket.socket, updatePaymentStatus]);

  // Track a payment
  const trackPayment = useCallback(
    (paymentReference: string, appointmentId: string) => {
      if (trackedPayments.has(paymentReference)) {
        console.log(`Already tracking payment ${paymentReference}`);
        return;
      }
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
      if (socket.socket && isConnected) {
        socket.emit("track-payment", {
          paymentReference,
          userId: user?.id,
        });
        console.log(`🔌 Socket tracking enabled for ${paymentReference}`);
      } else {
        console.warn(
          "Socket not available or not connected for payment tracking"
        );
      }
    },
    [isConnected, user?.id, trackedPayments, updatePaymentStatus, socket]
  );

  // Stop tracking a payment
  const stopTrackingPayment = useCallback(
    (paymentReference: string) => {
      console.log(`🛑 Stopping tracking for payment: ${paymentReference}`);

      // Leave payment room via socket
      if (socket.socket && isConnected) {
        socket.emit("stop-tracking-payment", {
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
    [isConnected, socket]
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
