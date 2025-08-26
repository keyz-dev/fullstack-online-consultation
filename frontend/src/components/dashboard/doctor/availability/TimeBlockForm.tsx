"use client";

import React from "react";
import { Input, Label, Button } from "@/components/ui";
import { DollarSign, Users, AlertCircle } from "lucide-react";
import {
  CONSULTATION_TYPES,
  DURATION_OPTIONS,
} from "@/utils/availabilityHelpers";
import { TimeBlock } from "@/types/availability";

interface TimeBlockFormProps {
  formData: Partial<TimeBlock>;
  errors: Record<string, string>;
  onInputChange: (field: keyof TimeBlock, value: any) => void;
}

export const TimeBlockForm: React.FC<TimeBlockFormProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Time Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Time Range
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label
              htmlFor="startTime"
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChangeHandler={(e) =>
                onInputChange("startTime", e.target.value)
              }
              className={errors.time ? "border-red-500" : ""}
            />
          </div>
          <div>
            <Label
              htmlFor="endTime"
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              End Time
            </Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChangeHandler={(e) => onInputChange("endTime", e.target.value)}
              className={errors.time ? "border-red-500" : ""}
            />
          </div>
        </div>
        {errors.time && (
          <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.time}</span>
          </div>
        )}
      </div>

      {/* Consultation Duration */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Consultation Duration
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {DURATION_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={
                formData.consultationDuration === option.value
                  ? "primary"
                  : "outline"
              }
              size="sm"
              className="flex flex-col items-center space-y-1 h-auto py-3"
              onClick={() =>
                onInputChange("consultationDuration", option.value)
              }
            >
              <span className="text-sm font-medium">{option.label}</span>
              <span className="text-xs text-gray-500">
                {option.description}
              </span>
            </Button>
          ))}
        </div>
        {errors.duration && (
          <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.duration}</span>
          </div>
        )}
      </div>

      {/* Consultation Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Consultation Type
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {CONSULTATION_TYPES.map((type) => (
            <Button
              key={type.value}
              variant={
                formData.consultationType === type.value ? "primary" : "outline"
              }
              size="sm"
              className="flex flex-col items-center space-y-1 h-auto py-3"
              onClick={() => onInputChange("consultationType", type.value)}
            >
              <span className="text-lg">{type.icon}</span>
              <span className="text-xs">{type.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Consultation Fee */}
      <div className="space-y-3">
        <Label
          htmlFor="consultationFee"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Consultation Fee (XAF)
        </Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="consultationFee"
            type="number"
            min="0"
            step="100"
            value={formData.consultationFee}
            onChangeHandler={(e) =>
              onInputChange("consultationFee", parseInt(e.target.value) || 0)
            }
            className={`pl-10 ${errors.fee ? "border-red-500" : ""}`}
            placeholder="5000"
          />
        </div>
        {errors.fee && (
          <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.fee}</span>
          </div>
        )}
      </div>

      {/* Max Patients (Optional) */}
      <div className="space-y-3">
        <Label
          htmlFor="maxPatients"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Max Patients (Optional)
        </Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="maxPatients"
            type="number"
            min="1"
            value={formData.maxPatients || ""}
            onChangeHandler={(e) =>
              onInputChange(
                "maxPatients",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            className={`pl-10 ${errors.maxPatients ? "border-red-500" : ""}`}
            placeholder="Leave empty for unlimited"
          />
        </div>
        {errors.maxPatients && (
          <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.maxPatients}</span>
          </div>
        )}
      </div>
    </div>
  );
};
