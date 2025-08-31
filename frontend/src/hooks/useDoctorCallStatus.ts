"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";
import { useRouter } from "next/navigation";

type CallStatus = 'initiating' | 'ringing' | 'patient_offline' | 'accepted' | 'declined' | 'timeout';

interface CallStatusData {
  consultationId: string;
  roomId: string;
  patientName: string;
  patientEmail?: string;
}

export const useDoctorCallStatus = () => {
  const [isCallStatusVisible, setIsCallStatusVisible] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>('initiating');
  const [callData, setCallData] = useState<CallStatusData | null>(null);
  const [ringDuration, setRingDuration] = useState(0);
  const socket = useSocket();
  const router = useRouter();

  // Ring timer
  useEffect(() => {
    if (callStatus !== 'ringing') {
      setRingDuration(0);
      return;
    }

    const interval = setInterval(() => {
      setRingDuration(prev => {
        const newDuration = prev + 1;
        // Auto-timeout after 60 seconds
        if (newDuration >= 60) {
          setCallStatus('timeout');
          return 0;
        }
        return newDuration;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [callStatus]);

  // Start call status tracking
  const startCall = useCallback((data: CallStatusData, patientOnline: boolean = true) => {
    setCallData(data);
    setIsCallStatusVisible(true);
    
    if (!patientOnline) {
      setCallStatus('patient_offline');
    } else {
      setCallStatus('initiating');
      // Move to ringing after a brief delay
      setTimeout(() => {
        setCallStatus('ringing');
      }, 1000);
    }
  }, []);

  // Cancel call
  const cancelCall = useCallback(() => {
    if (callData && socket.socket) {
      socket.socket.emit("call_cancelled", {
        roomId: callData.roomId,
        consultationId: callData.consultationId
      });
    }
    
    setIsCallStatusVisible(false);
    setCallStatus('initiating');
    setCallData(null);
    setRingDuration(0);
  }, [callData, socket]);

  // Retry call
  const retryCall = useCallback(() => {
    if (callData) {
      setCallStatus('initiating');
      setTimeout(() => {
        setCallStatus('ringing');
      }, 1000);
    }
  }, [callData]);

  // Close status
  const closeStatus = useCallback(() => {
    setIsCallStatusVisible(false);
    setCallStatus('initiating');
    setCallData(null);
    setRingDuration(0);
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket.socket) return;

    // Patient is ringing
    socket.socket.on("video_call_ringing", (data) => {
      console.log("📱 Patient is ringing:", data);
      if (callData && data.consultationId === callData.consultationId) {
        setCallStatus('ringing');
      }
    });

    // Patient accepted call
    socket.socket.on("video_call_accepted", (data) => {
      console.log("✅ Patient accepted call:", data);
      if (callData && data.consultationId === callData.consultationId) {
        setCallStatus('accepted');
        
        // Navigate to video room after brief delay
        setTimeout(() => {
          setIsCallStatusVisible(false);
          router.push(`/doctor/consultation/${data.consultationId}/video?roomId=${data.roomId}`);
        }, 2000);
      }
    });

    // Patient rejected call
    socket.socket.on("video_call_rejected", (data) => {
      console.log("❌ Patient rejected call:", data);
      if (callData && data.consultationId === callData.consultationId) {
        setCallStatus('declined');
      }
    });

    // Call cancelled (by patient or system)
    socket.socket.on("call_cancelled", (data) => {
      console.log("📞 Call was cancelled:", data);
      if (callData && data.consultationId === callData.consultationId) {
        closeStatus();
      }
    });

    return () => {
      socket.socket?.off("video_call_ringing");
      socket.socket?.off("video_call_accepted");
      socket.socket?.off("video_call_rejected");
      socket.socket?.off("call_cancelled");
    };
  }, [socket.socket, callData, router, closeStatus]);

  // Auto-hide after successful states
  useEffect(() => {
    if (callStatus === 'accepted') {
      const timeout = setTimeout(() => {
        setIsCallStatusVisible(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [callStatus]);

  return {
    isCallStatusVisible,
    callStatus,
    callData,
    ringDuration,
    startCall,
    cancelCall,
    retryCall,
    closeStatus,
  };
};
