"use client";

import React from "react";
import { Card, Button } from "@/components/ui";
import { Availability } from "@/types/availability";
import { timeUtils, uiUtils } from "@/utils/availabilityHelpers";
import {
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface WeeklyCalendarProps {
  availabilities: Availability[];
  onEditSession?: (availability: Availability) => void;
  onDeleteSession: (availability: Availability) => void;
  onInvalidateSession: (availability: Availability, reason: string) => void;
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

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  availabilities,
  onEditSession,
  onDeleteSession,
  onInvalidateSession,
}) => {
  const getAvailabilitiesForDay = (dayOfWeek: number) => {
    return availabilities.filter((av) => av.dayOfWeek === dayOfWeek);
  };

  const calculateDayStats = (dayAvailabilities: Availability[]) => {
    let totalHours = 0;
    let totalSlots = 0;
    let totalEarnings = 0;

    dayAvailabilities.forEach((av) => {
      const hours = timeUtils.getTimeDifference(av.startTime, av.endTime) / 60;
      const slots = Math.floor((hours * 60) / av.consultationDuration);

      totalHours += hours;
      totalSlots += slots;
      totalEarnings += slots * av.consultationFee;
    });

    return { totalHours, totalSlots, totalEarnings };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {DAY_NAMES.map((dayName, dayIndex) => {
          const dayAvailabilities = getAvailabilitiesForDay(dayIndex);
          const stats = calculateDayStats(dayAvailabilities);

          return (
            <Card key={dayIndex} className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  {dayName}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {dayAvailabilities.length} session
                  {dayAvailabilities.length !== 1 ? "s" : ""}
                </div>
              </div>

              {dayAvailabilities.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No sessions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayAvailabilities.map((availability, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        availability.isInvalidated
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {timeUtils.formatTime(availability.startTime)} -{" "}
                            {timeUtils.formatTime(availability.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {onEditSession && (
                            <Button
                              onClickHandler={() => onEditSession(availability)}
                              additionalClasses="h-6 w-6 p-0 text-gray-600 hover:text-gray-800"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            onClickHandler={() => onDeleteSession(availability)}
                            additionalClasses="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            {
                              CONSULTATION_TYPES.find(
                                (type) =>
                                  type.value === availability.consultationType
                              )?.icon
                            }{" "}
                            {availability.consultationType}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {availability.consultationDuration}min
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            {uiUtils.formatCurrency(
                              availability.consultationFee
                            )}
                          </span>
                          {availability.isInvalidated && (
                            <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                              <AlertTriangle className="w-3 h-3" />
                              <span className="text-xs">Invalidated</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {dayAvailabilities.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Hours:</span>
                      <span>{stats.totalHours.toFixed(1)}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Slots:</span>
                      <span>{stats.totalSlots}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Earnings:</span>
                      <span>{uiUtils.formatCurrency(stats.totalEarnings)}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
