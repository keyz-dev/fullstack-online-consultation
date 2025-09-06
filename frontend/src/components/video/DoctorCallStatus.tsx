'use client';

import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Clock, User, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

type CallStatus = 'initiating' | 'ringing' | 'patient_offline' | 'accepted' | 'declined' | 'timeout';

interface DoctorCallStatusProps {
  isVisible: boolean;
  patientName: string;
  patientEmail?: string;
  callStatus: CallStatus;
  ringDuration: number;
  onCancel: () => void;
  onRetry?: () => void;
}

export const DoctorCallStatus: React.FC<DoctorCallStatusProps> = ({
  isVisible,
  patientName,
  patientEmail,
  callStatus,
  ringDuration,
  onCancel,
  onRetry,
}) => {
  const formatRingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusConfig = () => {
    switch (callStatus) {
      case 'initiating':
        return {
          icon: <Phone className="w-5 h-5 text-blue-400 animate-pulse" />,
          title: 'Initiating Call...',
          subtitle: 'Setting up video consultation',
          bgColor: 'from-blue-500 to-blue-600',
          showTimer: false,
        };
      case 'ringing':
        return {
          icon: <Phone className="w-5 h-5 text-green-400 animate-bounce" />,
          title: 'Calling Patient',
          subtitle: `Ringing ${patientName}...`,
          bgColor: 'from-green-500 to-green-600',
          showTimer: true,
        };
      case 'patient_offline':
        return {
          icon: <WifiOff className="w-5 h-5 text-orange-400" />,
          title: 'Patient Offline',
          subtitle: 'Patient is not currently available',
          bgColor: 'from-orange-500 to-orange-600',
          showTimer: false,
        };
      case 'accepted':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
          title: 'Call Accepted',
          subtitle: 'Connecting to video room...',
          bgColor: 'from-green-500 to-green-600',
          showTimer: false,
        };
      case 'declined':
        return {
          icon: <PhoneOff className="w-5 h-5 text-red-400" />,
          title: 'Call Declined',
          subtitle: 'Patient declined the call',
          bgColor: 'from-red-500 to-red-600',
          showTimer: false,
        };
      case 'timeout':
        return {
          icon: <Clock className="w-5 h-5 text-gray-400" />,
          title: 'Call Timeout',
          subtitle: 'Patient did not respond',
          bgColor: 'from-gray-500 to-gray-600',
          showTimer: false,
        };
      default:
        return {
          icon: <Phone className="w-5 h-5 text-gray-400" />,
          title: 'Unknown Status',
          subtitle: '',
          bgColor: 'from-gray-500 to-gray-600',
          showTimer: false,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] sm:max-w-sm"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${config.bgColor} p-4 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <div className="relative flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm">{config.title}</h3>
                  <p className="text-white/80 text-xs">{config.subtitle}</p>
                </div>
                {config.showTimer && (
                  <div className="text-white text-sm font-mono bg-white/20 px-2 py-1 rounded">
                    {formatRingTime(ringDuration)}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Patient Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{patientName}</p>
                  {patientEmail && (
                    <p className="text-gray-600 dark:text-gray-400 text-xs">{patientEmail}</p>
                  )}
                </div>
              </div>

              {/* Status-specific content */}
              {callStatus === 'patient_offline' && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
                  <p className="text-orange-800 dark:text-orange-200 text-xs">
                    The patient is not currently online. You can try again later or contact them via email.
                  </p>
                </div>
              )}

              {callStatus === 'ringing' && ringDuration > 30 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                    Patient hasn&apos;t responded yet. Call will timeout in {60 - ringDuration} seconds.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {(callStatus === 'ringing' || callStatus === 'initiating') && (
                  <Button
                    onClickHandler={onCancel}
                    additionalClasses="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                    text="Cancel Call"
                  />
                )}

                {(callStatus === 'patient_offline' || callStatus === 'declined' || callStatus === 'timeout') && (
                  <>
                    <Button
                      onClickHandler={onCancel}
                      additionalClasses="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                      text="Close"
                    />
                    {onRetry && (
                      <Button
                        onClickHandler={onRetry}
                        additionalClasses="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                        text="Try Again"
                      />
                    )}
                  </>
                )}

                {callStatus === 'accepted' && (
                  <div className="flex-1 text-center py-2">
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                      Redirecting to video call...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
