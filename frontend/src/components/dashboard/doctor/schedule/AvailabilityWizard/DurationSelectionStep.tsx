"use client";

import React from "react";
import { Card } from "@/components/ui";
import { Clock, Check } from "lucide-react";

interface DurationSelectionStepProps {
  duration: number;
  onDurationChange: (duration: number) => void;
}

const DURATION_OPTIONS = [
  { value: 15, label: "15 min", description: "Quick consultation" },
  { value: 30, label: "30 min", description: "Standard consultation" },
  { value: 45, label: "45 min", description: "Extended consultation" },
  { value: 60, label: "1 hour", description: "Comprehensive consultation" },
  { value: 90, label: "1.5 hours", description: "Detailed consultation" },
  { value: 120, label: "2 hours", description: "Full session" },
];

export const DurationSelectionStep: React.FC<DurationSelectionStepProps> = ({
  duration,
  onDurationChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          How long is each consultation?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This duration will be used for all your time sessions. Choose
          carefully as it affects how many patients you can see.
        </p>
      </div>

      {/* Duration Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DURATION_OPTIONS.map((option) => {
          const isSelected = duration === option.value;
          return (
            <Card
              key={option.value}
              className={`p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "ring-2 ring-primary bg-primary/5 border-primary"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => onDurationChange(option.value)}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? "bg-primary border-primary"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {option.value} min
                </div>
              </div>

              <div>
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {option.label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-primary/20">
                  <div className="text-xs text-primary font-medium">
                    ✓ Selected
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Selection Summary */}
      {duration > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {duration} minutes per consultation
            </span>
          </div>
          <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
            This means you can see approximately {Math.floor(60 / duration)}{" "}
            patients per hour
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          This duration will be used to automatically generate time slots in the
          next step.
        </p>
      </div>
    </div>
  );
};
