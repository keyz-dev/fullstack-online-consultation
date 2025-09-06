"use client";

import React from "react";
import { Card } from "@/components/ui";
import { TimeBlock } from "@/types/availability";
import { timeUtils, uiUtils } from "@/utils/availabilityHelpers";
import { Calendar, Clock, DollarSign, Check } from "lucide-react";

interface ReviewStepProps {
  selectedDays: number[];
  consultationDuration: number;
  timeSessions: Record<number, TimeBlock[]>;
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
  { value: "online", label: "Online", icon: "🌐" },
  { value: "physical", label: "Physical", icon: "🏥" },
  { value: "both", label: "Both", icon: "🔄" },
];

export const ReviewStep: React.FC<ReviewStepProps> = ({
  selectedDays,
  consultationDuration,
  timeSessions,
}) => {
  const calculateTotalStats = () => {
    let totalSessions = 0;
    let totalHours = 0;
    let totalSlots = 0;
    let totalEarnings = 0;

    selectedDays.forEach((dayOfWeek) => {
      const sessions = timeSessions[dayOfWeek] || [];
      totalSessions += sessions.length;

      sessions.forEach((session) => {
        const hours =
          timeUtils.getTimeDifference(session.startTime, session.endTime) / 60;
        const slots = Math.floor((hours * 60) / consultationDuration);

        totalHours += hours;
        totalSlots += slots;
        totalEarnings += slots * session.consultationFee;
      });
    });

    return { totalSessions, totalHours, totalSlots, totalEarnings };
  };

  const stats = calculateTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Review Your Schedule
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please review your availability schedule before saving. You can go
          back to make changes if needed.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Days Available */}
        <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700 hover:shadow-xs transition-shadow duration-200 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg flex-shrink-0">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
              Days Available
            </h3>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {selectedDays.length}
          </div>
        </div>

        {/* Time Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700 hover:shadow-xs transition-shadow duration-200 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg flex-shrink-0">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
              Time Sessions
            </h3>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalSessions}
          </div>
        </div>

        {/* Consultation Slots */}
        <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700 hover:shadow-xs transition-shadow duration-200 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg flex-shrink-0">
              <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
              Consultation Slots
            </h3>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalSlots}
          </div>
        </div>

        {/* Weekly Potential */}
        <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700 hover:shadow-xs transition-shadow duration-200 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-lg flex-shrink-0">
              <DollarSign className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
              Weekly Potential
            </h3>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {uiUtils.formatCurrency(stats.totalEarnings)}
          </div>
        </div>
      </div>

      {/* Schedule Details */}
      <Card className="p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Schedule Details
        </h4>

        <div className="space-y-4">
          {/* Consultation Duration */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">
                Consultation Duration
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {consultationDuration} minutes
            </span>
          </div>

          {/* Selected Days */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">
                Available Days
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              {selectedDays.map((day) => DAY_NAMES[day]).join(", ")}
            </span>
          </div>

          {/* Time Sessions by Day */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900 dark:text-white">
              Time Sessions
            </h5>
            {selectedDays.map((dayOfWeek) => {
              const sessions = timeSessions[dayOfWeek] || [];
              if (sessions.length === 0) return null;

              return (
                <div key={dayOfWeek} className="pl-8">
                  <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {DAY_NAMES[dayOfWeek]}
                  </div>
                  <div className="space-y-2">
                    {sessions.map((session, index) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {timeUtils.formatTime(session.startTime)} -{" "}
                            {timeUtils.formatTime(session.endTime)}
                          </span>
                          <div className="flex items-center space-x-2">
                            {
                              CONSULTATION_TYPES.find(
                                (type) =>
                                  type.value === session.consultationType
                              )?.icon
                            }
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {
                                CONSULTATION_TYPES.find(
                                  (type) =>
                                    type.value === session.consultationType
                                )?.label
                              }
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {uiUtils.formatCurrency(session.consultationFee)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Additional Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center mt-0.5">
            <Check className="w-3 h-3 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              What happens next?
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>
                • Your schedule will be saved and time slots will be generated
                automatically
              </li>
              <li>
                • Patients can start booking appointments based on your
                availability
              </li>
              <li>• You can modify your schedule anytime from the dashboard</li>
              <li>
                • You&apos;ll receive notifications when patients book appointments
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
