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
    
    // CRITICAL: Doctor must join the room to receive patient responses
    if (socket.socket) {
      socket.socket.emit("video:join-room", {
        roomId: data.roomId,
        consultationId: data.consultationId
      });
    }
    
    if (!patientOnline) {
      setCallStatus('patient_offline');
    } else {
      setCallStatus('initiating');
      // Move to ringing after a brief delay
      setTimeout(() => {
        setCallStatus('ringing');
      }, 1000);
    }
  }, [socket]);

  // Cancel call
  const cancelCall = useCallback(() => {
    if (callData && socket.socket) {
      socket.socket.emit("video:call-cancelled", {
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

    // Patient accepted call
    socket.socket.on("video:call-accepted", (data) => {
      const receivedId = String(data.consultationId);
      const expectedId = String(callData?.consultationId || "");
      if (callData && receivedId === expectedId) {
        setCallStatus('accepted');
        
        // Navigate to video room after brief delay
        setTimeout(() => {
          setIsCallStatusVisible(false);
          router.push(`/doctor/consultation/${receivedId}/video?roomId=${data.roomId}`);
        }, 2000);
      }
    });

    // Patient rejected call
    socket.socket.on("video:call-rejected", (data) => {
      const receivedId = String(data.consultationId);
      const expectedId = String(callData?.consultationId || "");
      if (callData && receivedId === expectedId) {
        setCallStatus('declined');
      } 
    });

    // Call cancelled (by patient or system)
    socket.socket.on("video:call-cancelled", (data) => {
      const receivedId = String(data.consultationId);
      const expectedId = String(callData?.consultationId || "");
      if (callData && receivedId === expectedId) {
        closeStatus();
      }
    });

    return () => {
      // socket.socket?.off("video:call-ringing");
      socket.socket?.off("video:call-accepted");
      socket.socket?.off("video:call-rejected");
      socket.socket?.off("video:call-cancelled");
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
