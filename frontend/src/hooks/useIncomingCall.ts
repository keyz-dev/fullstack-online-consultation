"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";
import { useRouter } from "next/navigation";

interface IncomingCallData {
  consultationId: string;
  roomId: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  doctorUserId?: string; // normalized from backend payload
}

export const useIncomingCall = () => {
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(
    null
  );
  const [isCallVisible, setIsCallVisible] = useState(false);
  const { socket } = useSocket();
  const router = useRouter();

  // Accept call
  const acceptCall = useCallback(
    async (roomId: string, consultationId: string) => {
      // Emit acceptance to doctor first
      if (socket && incomingCall) {
        socket.emit("video:accept-call", {
          roomId,
          consultationId,
          doctorId: incomingCall.doctorUserId,
        });
      }

      setIsCallVisible(false);
      setIncomingCall(null);

      // Force cleanup of any existing media streams using MediaStreamManager
      try {
        // Import and use the MediaStreamManager
        const { mediaStreamManager } = await import(
          "../utils/mediaStreamManager"
        );
        mediaStreamManager.forceReleaseAll();

        // Additional cleanup - stop any orphaned streams
        const devices = await navigator.mediaDevices.enumerateDevices();
      } catch (cleanupError) {
        console.log("🧹 Cleanup completed:", cleanupError);
      }

      // Wait a bit longer to ensure cleanup is complete
      setTimeout(() => {
        console.log("🚀 Navigating to video call room");
        router.push(
          `/patient/consultation/${consultationId}/video?roomId=${roomId}`
        );
      }, 1000);
    },
    [router, socket, incomingCall]
  );

  // Decline call
  const declineCall = useCallback(() => {
    if (incomingCall && socket) {
      const rejectionData = {
        roomId: incomingCall.roomId,
        consultationId: incomingCall.consultationId,
        doctorId: incomingCall.doctorUserId,
      };

      socket.emit("video:reject-call", rejectionData);
    } else {
      console.log("❌ Cannot decline call - missing data:", {
        incomingCall: !!incomingCall,
        socket: !!socket,
      });
    }

    setIsCallVisible(false);
    setIncomingCall(null);
  }, [incomingCall, socket]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) {
      console.log("❌ No socket available in useIncomingCall");
      return;
    }

    // If socket is not connected, wait for connection
    if (!socket.connected) {
      const handleConnect = () => { 
        setupListeners();
      };

      socket.on("connect", handleConnect);

      // If already connected by the time we get here
      if (socket.connected) {
        setupListeners();
      }

      return () => {
        socket.off("connect", handleConnect);
        cleanupListeners();
      };
    } else {
      setupListeners();
      return cleanupListeners;
    }

    function setupListeners() {
      // Handle incoming video call
      const handleVideoCallInitiated = (data: IncomingCallData) => {
        // Normalize and persist doctorUserId for accept/reject payloads
        const normalized: IncomingCallData = {
          consultationId: String(data.consultationId),
          roomId: data.roomId,
          doctorName: data.doctorName,
          doctorSpecialty: data.doctorSpecialty,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          patientName: data.patientName,
          doctorUserId: data.doctorUserId
            ? String(data.doctorUserId)
            : undefined,
        };
        setIncomingCall(normalized);
        setIsCallVisible(true);

        // CRITICAL: Join the room so we can receive video:call-cancelled events
        if (socket) {
          socket.emit("video:join-room", {
            roomId: data.roomId,
            consultationId: data.consultationId,
          });
          console.log("🏠 Joined room for call notifications:", data.roomId);

          // Emit ringing status to doctor
          socket.emit("video:call-ringing", {
            roomId: data.roomId,
            consultationId: data.consultationId,
          });
        }
      };

      // Handle call cancellation
      const handleCallCancelled = (data: IncomingCallData) => {
        // Dismiss the incoming call notification
        setIsCallVisible(false);
        setIncomingCall(null);
        // Could show a toast: "Call was cancelled by doctor"
      };

      // Register event listeners
      if (socket) {
        socket.on("video:call-initiated", handleVideoCallInitiated);
        socket.on("video:call-cancelled", handleCallCancelled);
      }
    }

    function cleanupListeners() {
      if (socket) {
        socket.off("video:call-initiated");
        socket.off("video:call-cancelled");
      }
    }
  }, [socket]); // Remove handleIncomingCall from dependencies

  return {
    incomingCall,
    isCallVisible,
    acceptCall,
    declineCall,
  };
};
