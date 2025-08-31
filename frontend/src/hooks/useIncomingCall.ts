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
}

export const useIncomingCall = () => {
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const [isCallVisible, setIsCallVisible] = useState(false);
  const socket = useSocket();
  const router = useRouter();

  // Handle incoming call event
  const handleIncomingCall = useCallback((callData: IncomingCallData) => {
    console.log("📞 Incoming call received:", callData);
    setIncomingCall(callData);
    setIsCallVisible(true);
    
    // Emit ringing status to doctor
    if (socket.socket) {
      socket.socket.emit("video_call_ringing", {
        roomId: callData.roomId,
        consultationId: callData.consultationId
      });
    }
    
    console.log("📞 Call notification displayed, ringing status sent to doctor");
  }, [socket]);

  // Accept call
  const acceptCall = useCallback(async (roomId: string, consultationId: string) => {
    setIsCallVisible(false);
    setIncomingCall(null);
    
    // Force cleanup of any existing media streams using MediaStreamManager
    try {
      console.log('🧹 Force cleaning up all media streams before call acceptance');
      
      // Import and use the MediaStreamManager
      const { mediaStreamManager } = await import('../utils/mediaStreamManager');
      mediaStreamManager.forceReleaseAll();
      
      // Additional cleanup - stop any orphaned streams
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log(`📱 Found ${devices.length} media devices`);
      
    } catch (cleanupError) {
      console.log('🧹 Cleanup completed:', cleanupError);
    }
    
    // Wait a bit longer to ensure cleanup is complete
    setTimeout(() => {
      console.log('🚀 Navigating to video call room');
      router.push(`/patient/consultation/${consultationId}/video?roomId=${roomId}`);
    }, 1000);
  }, [router]);

  // Decline call
  const declineCall = useCallback(() => {
    if (incomingCall && socket.socket) {
      socket.socket.emit("video_call_rejected", {
        roomId: incomingCall.roomId,
        consultationId: incomingCall.consultationId
      });
    }
    setIsCallVisible(false);
    setIncomingCall(null);
  }, [incomingCall, socket]);

  // Socket event listeners
  useEffect(() => {
    if (!socket.socket) return;

    console.log("🔌 Setting up incoming call listeners for socket:", socket.socket.id);

    // Listen for incoming video call
    socket.socket.on("video_call_initiated", handleIncomingCall);

    // Listen for call cancellation (if doctor cancels before patient responds)
    socket.socket.on("video_call_cancelled", () => {
      console.log("📞 Call cancelled by doctor");
      setIsCallVisible(false);
      setIncomingCall(null);
    });

    return () => {
      console.log("🔌 Cleaning up incoming call listeners");
      if (socket.socket) {
        socket.socket.off("video_call_initiated", handleIncomingCall);
        socket.socket.off("video_call_cancelled");
      }
    };
  }, [socket.socket, handleIncomingCall]);

  return {
    incomingCall,
    isCallVisible,
    acceptCall,
    declineCall,
  };
};
