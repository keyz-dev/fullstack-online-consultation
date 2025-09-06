"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ModalWrapper, Button } from "@/components/ui";
import { useSocket } from "@/hooks/useSocket";
import { Video, Phone, PhoneOff, User, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

interface IncomingCallData {
  consultationId: string;
  roomId: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
}

interface IncomingCallNotificationProps {
  isVisible: boolean;
  callData: IncomingCallData | null;
  onAccept: (roomId: string, consultationId: string) => void;
  onDecline: () => void;
}

const IncomingCallNotification: React.FC<IncomingCallNotificationProps> = ({
  isVisible,
  callData,
  onAccept,
  onDecline,
}) => {
  const [isRinging, setIsRinging] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const socket = useSocket();

  // Initialize ringtone audio
  useEffect(() => {
    // Create audio element for ringtone
    audioRef.current = new Audio("/sounds/incoming-call.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const stopRingtone = useCallback(() => {
    setIsRinging(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const handleAccept = useCallback(() => {
    if (!callData) return;

    stopRingtone();

    // Emit socket event to accept call
    if (socket.socket) {
      socket.emit("video:accept-call", {
        consultationId: callData.consultationId,
        roomId: callData.roomId,
        doctorId: (callData as unknown)?.doctorUserId,
      });
    }

    onAccept(callData.roomId, callData.consultationId);
  }, [callData, socket, onAccept, stopRingtone]);

  const handleDecline = useCallback(() => {
    if (!callData) return;

    stopRingtone();

    // Emit socket event to decline call
    if (socket.socket) {
      socket.emit("video:reject-call", {
        consultationId: callData.consultationId,
        roomId: callData.roomId,
        doctorId: (callData as unknown)?.doctorUserId,
      });
    }

    onDecline();
  }, [callData, socket, onDecline, stopRingtone]);
  // Handle ringtone when call comes in
  useEffect(() => {
    if (isVisible && callData) {
      setIsRinging(true);

      // Start ringtone
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }

      // Auto-decline after 30 seconds if no response
      const autoDeclineTimer = setTimeout(() => {
        handleDecline();
      }, 30000);

      return () => {
        clearTimeout(autoDeclineTimer);
        stopRingtone();
      };
    } else {
      stopRingtone();
    }
  }, [isVisible, callData, handleDecline, stopRingtone]);

  // Debug logging
  console.log("🔔 IncomingCallNotification render:", {
    isVisible,
    hasCallData: !!callData,
    callData
  });

  if (!isVisible || !callData) {
    console.log("🔔 Not showing notification - isVisible:", isVisible, "callData:", !!callData);
    return null;
  }

  return (
    <ModalWrapper>
      <div className="p-6 w-full max-w-md relative">
        {/* Pulsing animation for incoming call */}
        <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-lg animate-pulse"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Incoming Video Call
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dr. {callData.doctorName} is calling you
            </p>
          </div>

          {/* Doctor Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Dr. {callData.doctorName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {callData.doctorSpecialty}
                </span>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Scheduled Appointment
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {format(
                    new Date(callData.appointmentDate),
                    "EEEE, MMMM dd, yyyy"
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {callData.appointmentTime}
                </span>
              </div>
            </div>
          </div>

          {/* Ringing Indicator */}
          {isRinging && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <div className="animate-bounce">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium animate-pulse">
                  Ringing...
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClickHandler={handleDecline}
              additionalClasses="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white px-8 py-3 rounded-full"
              leadingIcon={<PhoneOff className="w-5 h-5" />}
              text="Decline"
            />
            <Button
              onClickHandler={handleAccept}
              additionalClasses="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-8 py-3 rounded-full animate-pulse"
              leadingIcon={<Phone className="w-5 h-5" />}
              text="Accept"
            />
          </div>

          {/* Auto-decline warning */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Call will automatically decline in 30 seconds
            </p>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default IncomingCallNotification;
