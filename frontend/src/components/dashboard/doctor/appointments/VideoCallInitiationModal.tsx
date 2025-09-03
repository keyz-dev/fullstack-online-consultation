"use client";

import React, { useEffect } from "react";
import { ModalWrapper, Button } from "@/components/ui";
import { DoctorAppointment } from "@/api/appointments";
import { useConsultation } from "@/contexts";
import {
  X,
  Video,
  Clock,
  User,
  Mail,
  Wifi,
  WifiOff,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface VideoCallInitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: DoctorAppointment | null;
  onCallInitiated?: (roomId: string, consultationId: string) => void;
}

const VideoCallInitiationModal: React.FC<VideoCallInitiationModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onCallInitiated,
}) => {
  const {
    loading,
    currentConsultation,
    patientPresence,
    checkingPresence,
    getConsultationByAppointment,
    checkPatientPresence,
    initiateVideoCall,
    clearConsultationState,
  } = useConsultation();

  // Check if appointment is ready for call
  const isCallReady = () => {
    if (!appointment) return false;

    const now = new Date();
    const appointmentDateTime = new Date(
      `${appointment.timeSlot.date}T${appointment.timeSlot.startTime}`
    );
    const endDateTime = new Date(
      `${appointment.timeSlot.date}T${appointment.timeSlot.endTime}`
    );

    // Calculate minutes to start (negative means appointment has started)
    const minutesToStart = Math.floor(
      (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60)
    );

    // Calculate minutes since start (positive means appointment has started)
    const minutesSinceStart = Math.floor(
      (now.getTime() - appointmentDateTime.getTime()) / (1000 * 60)
    );

    const isCurrentlyHappening =
      now >= appointmentDateTime && now <= endDateTime;

    // Call window: 15 minutes before start to 30 minutes after start
    const isWithinCallWindow =
      (minutesToStart <= 15 && minutesToStart > 0) || // Before appointment
      (minutesSinceStart >= 0 && minutesSinceStart <= 30) || // During/after appointment
      isCurrentlyHappening; // Currently happening
    return (
      (appointment.status === "paid" || appointment.status === "confirmed") &&
      appointment.consultationType === "online" &&
      isWithinCallWindow
    );
  };

  // Initiate video call
  const handleInitiateCall = async () => {
    if (!currentConsultation?.id || !patientPresence?.isOnline) return;

    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MediaDevices API not available");
      }

      // Request camera/microphone permissions BEFORE initiating call
      console.log("🎥 Requesting camera/microphone permissions...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach((track) => track.stop());
      console.log("✅ Permissions granted, initiating call...");

      const result = await initiateVideoCall(currentConsultation.id.toString());
      if (result) {
        onCallInitiated?.(result.roomId, result.consultationId);
        onClose();
      }
    } catch (error) {
      console.error("❌ Permission denied or error:", error);

      let errorMessage = "Failed to access camera/microphone";
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          errorMessage =
            "Camera/microphone access denied. Please allow permissions and try again.";
        } else if (error.name === "NotFoundError") {
          errorMessage =
            "No camera or microphone found. Please check your devices.";
        } else if (error.name === "NotReadableError") {
          errorMessage =
            "Camera/microphone is already in use. Please close other video applications and try again.";
        }
      }

      alert(errorMessage);
    }
  };

  // Load data when modal opens
  useEffect(() => {
    if (isOpen && appointment) {
      // Get consultation by appointment ID
      getConsultationByAppointment(appointment.id.toString());

      // Check patient presence
      if (appointment.patient?.user?.id) {
        checkPatientPresence(appointment.patient.user.id.toString());

        // Refresh presence every 30 seconds while modal is open
        const presenceInterval = setInterval(() => {
          checkPatientPresence(appointment?.patient?.user.id.toString() || "");
        }, 30000);

        return () => clearInterval(presenceInterval);
      }
    }

    // Clear state when modal closes
    if (!isOpen) {
      clearConsultationState();
    }
  }, [
    isOpen,
    appointment,
    getConsultationByAppointment,
    checkPatientPresence,
    clearConsultationState,
  ]);

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen || !appointment) return null;

  const callReady = isCallReady();
  const canInitiateCall =
    callReady && patientPresence?.isOnline && currentConsultation?.id;

  return (
    <ModalWrapper>
      <div className="p-6 w-full lg:w-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          disabled={loading}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 shadow-b-sm p-4">
          <div className="flex-shrink-0">
            <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Start Video Consultation
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Initiate video call with patient
            </p>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Patient Details
            </h4>
            <div className="flex items-center space-x-1">
              {checkingPresence ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              ) : patientPresence?.isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    Online
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-600 font-medium">
                    Offline
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {appointment?.patient?.user.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {appointment?.patient?.user.email}
              </span>
            </div>
            {patientPresence?.lastSeen && !patientPresence.isOnline && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Last seen:{" "}
                  {format(new Date(patientPresence.lastSeen), "MMM dd, HH:mm")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Appointment Details
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-900 dark:text-white">
                {format(
                  new Date(appointment.timeSlot.date),
                  "EEEE, MMMM dd, yyyy"
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-900 dark:text-white">
                {format(
                  new Date(`2000-01-01T${appointment.timeSlot.startTime}`),
                  "hh:mm a"
                )}{" "}
                -{" "}
                {format(
                  new Date(`2000-01-01T${appointment.timeSlot.endTime}`),
                  "hh:mm a"
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Video className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-900 dark:text-white">
                Online Video Consultation
              </span>
            </div>
          </div>
        </div>

        {/* Call Status Messages */}
        {!callReady && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                This appointment is not ready for video call yet. Calls can be
                started 15 minutes before the scheduled time.
              </span>
            </div>
          </div>
        )}

        {callReady && !patientPresence?.isOnline && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800 dark:text-orange-200">
                Patient is currently offline. They need to be online to receive
                the call notification.
              </span>
            </div>
          </div>
        )}

        {callReady && patientPresence?.isOnline && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800 dark:text-green-200">
                Patient is online and ready to receive the call.
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between space-x-3 mt-6">
          <Button
            onClickHandler={handleClose}
            isDisabled={loading}
            additionalClasses="outlinebtn"
            text="Cancel"
          />
          <Button
            onClickHandler={handleInitiateCall}
            isLoading={loading}
            isDisabled={!canInitiateCall || loading}
            additionalClasses={`${
              canInitiateCall
                ? "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
            text={
              loading
                ? "Initiating..."
                : !callReady
                ? "Not Ready"
                : !patientPresence?.isOnline
                ? "Patient Offline"
                : !currentConsultation?.id
                ? "Loading..."
                : "Start Video Call"
            }
          />
        </div>

        {/* Refresh Presence Button */}
        <div className="mt-3 flex justify-center">
          <button
            onClick={() =>
              appointment?.patient?.user?.id &&
              checkPatientPresence(appointment.patient.user.id.toString())
            }
            disabled={checkingPresence}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50"
          >
            {checkingPresence ? "Checking..." : "Refresh patient status"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default VideoCallInitiationModal;
