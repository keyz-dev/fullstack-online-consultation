"use client";

import React from "react";
import { Badge } from "@/components/ui";
import {
  Clock,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { timeUtils, uiUtils } from "@/utils/availabilityHelpers";
import { TimeBlock } from "@/types/availability";

interface TimeBlockPreviewProps {
  formData: Partial<TimeBlock>;
  errors: Record<string, string>;
  isValid: boolean;
}

export const TimeBlockPreview: React.FC<TimeBlockPreviewProps> = ({
  formData,
  errors,
  isValid,
}) => {
  const generateTimeSlots = () => {
    if (
      !formData.startTime ||
      !formData.endTime ||
      !formData.consultationDuration
    )
      return [];

    return timeUtils.generateTimeSlots(
      formData.startTime,
      formData.endTime,
      formData.consultationDuration
    );
  };

  const timeSlots = generateTimeSlots();
  const totalDuration =
    formData.startTime && formData.endTime
      ? timeUtils.getTimeDifference(formData.startTime, formData.endTime)
      : 0;
  const potentialEarnings = timeSlots.length * (formData.consultationFee || 0);

  return (
    <div className="space-y-6">
      {/* Session Summary */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Session Summary
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Duration
              </span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {totalDuration} min
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Slots
              </span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {timeSlots.length}
            </div>
          </div>
        </div>

        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600 dark:text-green-400">
              Potential Earnings
            </span>
          </div>
          <div className="text-lg font-semibold text-green-700 dark:text-green-300">
            {uiUtils.formatCurrency(potentialEarnings)}
          </div>
        </div>
      </div>

      {/* Generated Time Slots */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Generated Time Slots
        </h4>

        {timeSlots.length > 0 ? (
          <div className="max-h-48 overflow-y-auto space-y-2">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {timeUtils.formatTime(slot)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {uiUtils.getDurationLabel(
                    formData.consultationDuration || 30
                  )}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400 dark:text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No time slots generated</p>
          </div>
        )}
      </div>

      {/* Conflict Warning */}
      {errors.conflict && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-600 dark:text-red-400">
              {errors.conflict}
            </span>
          </div>
        </div>
      )}

      {/* Validation Status */}
      <div className="flex items-center space-x-2">
        {isValid ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-600 dark:text-green-400">
              Ready to save
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              Please fix errors above
            </span>
          </>
        )}
      </div>
    </div>
  );
};
