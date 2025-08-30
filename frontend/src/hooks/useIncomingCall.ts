"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocketContext } from "@/contexts";
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
  const { socket } = useSocketContext();
  const router = useRouter();

  // Handle incoming call event
  const handleIncomingCall = useCallback((callData: IncomingCallData) => {
    setIncomingCall(callData);
    setIsCallVisible(true);
  }, []);

  // Accept call
  const acceptCall = useCallback((roomId: string, consultationId: string) => {
    setIsCallVisible(false);
    setIncomingCall(null);
    
    // Navigate to video call room
    router.push(`/patient/consultation/${consultationId}/video?roomId=${roomId}`);
  }, [router]);

  // Decline call
  const declineCall = useCallback(() => {
    setIsCallVisible(false);
    setIncomingCall(null);
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for incoming video call
    socket.on("video_call_initiated", handleIncomingCall);

    // Listen for call cancellation (if doctor cancels before patient responds)
    socket.on("video_call_cancelled", () => {
      setIsCallVisible(false);
      setIncomingCall(null);
    });

    return () => {
      socket.off("video_call_initiated", handleIncomingCall);
      socket.off("video_call_cancelled");
    };
  }, [socket, handleIncomingCall]);

  return {
    incomingCall,
    isCallVisible,
    acceptCall,
    declineCall,
  };
};
