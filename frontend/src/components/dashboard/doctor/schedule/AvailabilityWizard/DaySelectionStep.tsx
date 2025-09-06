"use client";

import React from "react";
import { Card, Button } from "@/components/ui";
import { Calendar, Check } from "lucide-react";

interface DaySelectionStepProps {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
}

const DAYS = [
  { value: 0, name: "Sunday", shortName: "Sun" },
  { value: 1, name: "Monday", shortName: "Mon" },
  { value: 2, name: "Tuesday", shortName: "Tue" },
  { value: 3, name: "Wednesday", shortName: "Wed" },
  { value: 4, name: "Thursday", shortName: "Thu" },
  { value: 5, name: "Friday", shortName: "Fri" },
  { value: 6, name: "Saturday", shortName: "Sat" },
];

export const DaySelectionStep: React.FC<DaySelectionStepProps> = ({
  selectedDays,
  onDaysChange,
}) => {
  const handleDayToggle = (dayValue: number) => {
    if (selectedDays.includes(dayValue)) {
      onDaysChange(selectedDays.filter((day) => day !== dayValue));
    } else {
      onDaysChange([...selectedDays, dayValue].sort());
    }
  };

  const handleSelectWeekdays = () => {
    const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday
    onDaysChange(weekdays);
  };

  const handleSelectAll = () => {
    onDaysChange([0, 1, 2, 3, 4, 5, 6]);
  };

  const handleClearAll = () => {
    onDaysChange([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Which days are you available?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select the days of the week when you&apos;ll be available for consultations
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClickHandler={handleSelectWeekdays}
          additionalClasses="outlinebtn text-xs"
          text="Weekdays Only"
        />
        <Button
          onClickHandler={handleSelectAll}
          additionalClasses="outlinebtn text-xs"
          text="All Days"
        />
        <Button
          onClickHandler={handleClearAll}
          additionalClasses="outlinebtn text-xs"
          text="Clear All"
        />
      </div>

      {/* Day Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {DAYS.map((day) => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <Card
              key={day.value}
              className={`p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "ring-2 ring-primary bg-primary/5 border-primary"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => handleDayToggle(day.value)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {day.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {day.shortName}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedDays.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              {selectedDays.length} day{selectedDays.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
          </div>
          <div className="mt-2 text-sm text-green-700 dark:text-green-300">
            {selectedDays
              .map((day) => DAYS.find((d) => d.value === day)?.name)
              .join(", ")}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Don&apos;t worry about specific times yet. We&apos;ll set those up in
          the next step.
        </p>
      </div>
    </div>
  );
};
