import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useSocketContext } from "../contexts/SocketProvider";

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
  const { socket } = useSocketContext();
  const [isConnected, setIsConnected] = useState(false);
  const [paymentStatuses, setPaymentStatuses] = useState<
    Record<string, PaymentStatus>
  >({});
  const [trackedPayments, setTrackedPayments] = useState<Set<string>>(
    new Set()
  );

  // Update connection status when socket changes
  useEffect(() => {
    if (socket) {
      setIsConnected(socket.connected);

      // Listen for connection events
      const handleConnect = () => {
        console.log("🔌 Connected to appointment payment socket");
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        console.log("🔌 Disconnected from appointment payment socket");
        setIsConnected(false);
      };

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      // Set initial connection status
      setIsConnected(socket.connected);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      };
    } else {
      setIsConnected(false);
    }
  }, [socket]);

  // Payment status update events
  useEffect(() => {
    if (!socket) return;

    // Payment status update events
    const handlePaymentInitiated = (data: {
      reference: string;
      appointmentId: string;
      message?: string;
      timestamp: string;
    }) => {
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
    };

    const handlePaymentStatusUpdate = (data: PaymentStatus) => {
      updatePaymentStatus(data.reference, data);

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

      if (data.status === "SUCCESSFUL") {
        toast.success(
          "Payment completed successfully! Your appointment is confirmed.",
          {
            autoClose: 5000,
          }
        );
      }
    };

    socket.on("payment-initiated", handlePaymentInitiated);
    socket.on("payment-status-update", handlePaymentStatusUpdate);

    return () => {
      socket.off("payment-initiated", handlePaymentInitiated);
      socket.off("payment-status-update", handlePaymentStatusUpdate);
    };
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

  // Track a payment
  const trackPayment = useCallback(
    (paymentReference: string, appointmentId: string) => {
      if (trackedPayments.has(paymentReference)) {
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
      if (socket && isConnected) {
        socket.emit("track-payment", {
          paymentReference,
          userId: user?.id,
        });
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
      // Leave payment room via socket
      if (socket && isConnected) {
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
