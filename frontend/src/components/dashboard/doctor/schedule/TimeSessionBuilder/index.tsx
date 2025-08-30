"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Input, ModalWrapper } from "@/components/ui";
import { TimeBlock } from "@/types/availability";
import { timeUtils } from "@/utils/availabilityHelpers";
import { DollarSign, AlertCircle, Check } from "lucide-react";

interface TimeSessionBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: TimeBlock) => void;
  dayOfWeek: number;
  consultationDuration: number;
  existingSession?: TimeBlock;
  existingSessions: TimeBlock[];
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CONSULTATION_TYPES = [
  { value: "online", label: "Online Consultation", icon: "🌐" },
  { value: "physical", label: "Physical Consultation", icon: "🏥" },
  { value: "both", label: "Both Types", icon: "🔄" },
];


export const TimeSessionBuilder: React.FC<TimeSessionBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  dayOfWeek,
  consultationDuration,
  existingSession,
  existingSessions,
}) => {
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    consultationType: "online" as "online" | "physical" | "both",
    consultationFee: "",
    maxPatients: "1",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Initialize form with existing session data
  useEffect(() => {
    if (existingSession) {
      const newFormData = {
        startTime: existingSession.startTime,
        endTime: existingSession.endTime,
        consultationType: existingSession.consultationType as
          | "online"
          | "physical"
          | "both",
        consultationFee: existingSession.consultationFee.toString(),
        maxPatients: existingSession.maxPatients?.toString() || "",
      };
      setFormData(newFormData);
    } else {
      const newFormData = {
        startTime: "",
        endTime: "",
        consultationType: "online" as "online" | "physical" | "both",
        consultationFee: "",
        maxPatients: "",
      };
      setFormData(newFormData);
    }
  }, [existingSession]);

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // If start time is changed, reset end time if it's now invalid
    if (field === "startTime" && value) {
      if (
        newFormData.endTime &&
        timeUtils.timeToMinutes(value) >=
          timeUtils.timeToMinutes(newFormData.endTime)
      ) {
        newFormData.endTime = "";
        setFormData(newFormData);
      }
    }

    // Only run validation if user has attempted to submit
    if (hasAttemptedSubmit) {
      const validationErrors = runValidation(newFormData);
      setErrors(validationErrors);
    }
  };

  const runValidation = (data: typeof formData = formData) => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!data.startTime) {
      newErrors.startTime = "Start time is required";
    }
    if (!data.endTime) {
      newErrors.endTime = "End time is required";
    }
    if (!data.consultationFee) {
      newErrors.consultationFee = "Consultation fee is required";
    }

    // Time validation
    if (data.startTime && data.endTime) {
      if (
        timeUtils.timeToMinutes(data.endTime) <=
        timeUtils.timeToMinutes(data.startTime)
      ) {
        newErrors.endTime = "End time must be after start time";
      }

      // Check for conflicts with existing sessions for the same day
      const hasConflict = existingSessions.some((session) => {
        // Skip if this is the session being edited
        if (existingSession && session.id === existingSession.id) return false;

        const newStart = timeUtils.timeToMinutes(data.startTime);
        const newEnd = timeUtils.timeToMinutes(data.endTime);
        const existingStart = timeUtils.timeToMinutes(session.startTime);
        const existingEnd = timeUtils.timeToMinutes(session.endTime);

        // Check if the new time range overlaps with existing session
        // Overlap occurs when: newStart < existingEnd AND newEnd > existingStart
        return newStart < existingEnd && newEnd > existingStart;
      });

      if (hasConflict) {
        newErrors.startTime =
          "This time range conflicts with an existing session for this day";
        newErrors.endTime =
          "This time range conflicts with an existing session for this day";
      }
    }

    // Fee validation
    if (data.consultationFee) {
      const fee = parseFloat(data.consultationFee);
      if (isNaN(fee) || fee < 0) {
        newErrors.consultationFee = "Please enter a valid fee amount";
      }
    }

    // Max patients validation
    if (data.maxPatients) {
      const maxPatients = parseInt(data.maxPatients);
      if (isNaN(maxPatients) || maxPatients < 1) {
        newErrors.maxPatients = "Max patients must be at least 1";
      }
    }

    // Only set errors if user has attempted to submit
    if (hasAttemptedSubmit) {
      setErrors(newErrors);
    }

    return newErrors;
  };

  const handleSave = () => {
    setHasAttemptedSubmit(true);
    runValidation(formData);

    // Check if there are any validation errors
    const validationErrors = runValidation(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const session: TimeBlock = {
        id: existingSession?.id || Date.now().toString(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        consultationDuration,
        consultationType: formData.consultationType,
        consultationFee: parseFloat(formData.consultationFee),
        maxPatients: formData.maxPatients
          ? parseInt(formData.maxPatients)
          : undefined,
      };

      onSave(session);
    } catch (error) {
      console.error("Failed to save session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateSlots = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const hours =
      timeUtils.getTimeDifference(formData.startTime, formData.endTime) / 60;
    return Math.floor((hours * 60) / consultationDuration);
  };

  const calculateEarnings = () => {
    const slots = calculateSlots();
    const fee = parseFloat(formData.consultationFee) || 0;
    return slots * fee;
  };

  const slots = calculateSlots();
  const earnings = calculateEarnings();


  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {existingSession ? "Edit" : "Add"} Time Session
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {DAY_NAMES[dayOfWeek]} • {consultationDuration} min consultations
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Time Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Time Range
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChangeHandler={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                  placeholder="Select start time"
                  error={errors.startTime}
                  step="300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Time
                </label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChangeHandler={(e) => handleInputChange("endTime", e.target.value)}
                  placeholder="Select end time"
                  error={errors.endTime}
                  step="300"
                />
              </div>
            </div>
          </div>

          {/* Consultation Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Consultation Type
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CONSULTATION_TYPES.map((type) => (
                <Card
                  key={type.value}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    formData.consultationType === type.value
                      ? "ring-2 ring-primary bg-primary/5 border-primary"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() =>
                    handleInputChange("consultationType", type.value)
                  }
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.consultationType === type.value
                          ? "bg-primary border-primary"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {formData.consultationType === type.value && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {type.icon} {type.label}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Fee and Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Consultation Fee
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="number"
                  value={formData.consultationFee}
                  onChangeHandler={(e) =>
                    handleInputChange("consultationFee", e.target.value)
                  }
                  placeholder="0.00"
                  additionalClasses="pl-10"
                  error={errors.consultationFee}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Patients (Optional)
              </label>
              <Input
                type="number"
                value={formData.maxPatients}
                onChangeHandler={(e) =>
                  handleInputChange("maxPatients", e.target.value)
                }
                placeholder="No limit"
                error={errors.maxPatients}
              />
            </div>
          </div>

          {/* Preview */}
          {formData.startTime && formData.endTime && (
            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
                Session Preview
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium">
                    Time Slots
                  </div>
                  <div className="text-blue-800 dark:text-blue-200">
                    {slots} consultations
                  </div>
                </div>
                <div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium">
                    Duration
                  </div>
                  <div className="text-blue-800 dark:text-blue-200">
                    {timeUtils.getTimeDifference(
                      formData.startTime,
                      formData.endTime
                    )}{" "}
                    minutes
                  </div>
                </div>
                <div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium">
                    Potential Earnings
                  </div>
                  <div className="text-blue-800 dark:text-blue-200">
                    {earnings.toFixed(2)} FCFA
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Error Summary */}
          {hasAttemptedSubmit && Object.keys(errors).length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    Please fix the following errors:
                  </h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>• {message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClickHandler={onClose}
            additionalClasses="outlinebtn"
            text="Cancel"
          />
          <Button
            onClickHandler={handleSave}
            isDisabled={isSubmitting}
            additionalClasses="primarybtn"
            text={
              isSubmitting
                ? "Saving..."
                : `${existingSession ? "Update" : "Add"} Session`
            }
            leadingIcon={
              isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )
            }
          />
        </div>
      </div>
    </ModalWrapper>
  );
};
