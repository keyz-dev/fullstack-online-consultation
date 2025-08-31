'use client';

import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, User, Clock, Video, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

interface IncomingCallData {
  consultationId: string;
  roomId: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
}

interface FloatingCallNotificationProps {
  isVisible: boolean;
  callData: IncomingCallData | null;
  onAccept: (roomId: string, consultationId: string) => void;
  onDecline: () => void;
}

export const FloatingCallNotification: React.FC<FloatingCallNotificationProps> = ({
  isVisible,
  callData,
  onAccept,
  onDecline,
}) => {
  const [ringDuration, setRingDuration] = useState(0);

  // Ring timer
  useEffect(() => {
    if (!isVisible) {
      setRingDuration(0);
      return;
    }

    const interval = setInterval(() => {
      setRingDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Auto-decline after 60 seconds
  useEffect(() => {
    if (ringDuration >= 60) {
      onDecline();
    }
  }, [ringDuration, onDecline]);

  const formatRingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!callData) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 left-4 z-50 w-80 max-w-[calc(100vw-2rem)] sm:max-w-sm"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header with pulsing animation */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              <div className="relative flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">Incoming Video Call</p>
                  <p className="text-white/80 text-xs flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatRingTime(ringDuration)}
                  </p>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Dr. {callData.doctorName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs flex items-center">
                    <Stethoscope className="w-3 h-3 mr-1" />
                    {callData.doctorSpecialty}
                  </p>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Scheduled Appointment</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {callData.appointmentDate} at {callData.appointmentTime}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClickHandler={() => onAccept(callData.roomId, callData.consultationId)}
                  additionalClasses="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>Accept</span>
                </Button>
                
                <Button
                  onClickHandler={onDecline}
                  additionalClasses="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Decline</span>
                </Button>
              </div>

              {/* Auto-decline warning */}
              {ringDuration > 45 && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-orange-600 dark:text-orange-400 text-center mt-2"
                >
                  Call will end in {60 - ringDuration} seconds
                </motion.p>
              )}
            </div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 -z-10 bg-green-400/20 blur-xl rounded-xl animate-pulse"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
