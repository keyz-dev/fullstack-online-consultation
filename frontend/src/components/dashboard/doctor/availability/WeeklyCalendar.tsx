"use client";

import React from "react";
import { Card, Button, Badge } from "@/components/ui";
import {
  DAY_NAMES,
  DAY_SHORT_NAMES,
  timeUtils,
  uiUtils,
  scheduleUtils,
} from "@/utils/availabilityHelpers";
import { Availability, TimeBlock } from "@/types/availability";
import { Calendar, Clock, Plus, Trash2, Edit3 } from "lucide-react";

interface WeeklyCalendarProps {
  availabilities: Availability[];
  onAddSession: (dayOfWeek: number) => void;
  onEditSession: (availability: Availability) => void;
  onDeleteSession: (availability: Availability) => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  availabilities,
  onAddSession,
  onEditSession,
  onDeleteSession,
}) => {
  const weekSchedule = scheduleUtils.createWeekSchedule(availabilities);

  const getDayStats = (dayIndex: number) => {
    const day = weekSchedule[dayIndex];
    const totalHours = day.availabilities.reduce((total, av) => {
      return total + timeUtils.getTimeDifference(av.startTime, av.endTime) / 60;
    }, 0);
    const totalEarnings = day.availabilities.reduce((total, av) => {
      const slots = timeUtils.generateTimeSlots(
        av.startTime,
        av.endTime,
        av.consultationDuration
      );
      return total + slots.length * av.consultationFee;
    }, 0);

    return { totalHours, totalEarnings };
  };

  return (
    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Weekly Schedule
        </h3>
      </div>

      <div className="space-y-4">
        {DAY_NAMES.map((dayName, dayIndex) => {
          const day = weekSchedule[dayIndex];
          const stats = getDayStats(dayIndex);

          return (
            <div
              key={dayIndex}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {dayName}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {day.availabilities.length} sessions
                  </Badge>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stats.totalHours.toFixed(1)}h
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {uiUtils.formatCurrency(stats.totalEarnings)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddSession(dayIndex)}
                    className="flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </Button>
                </div>
              </div>

              {/* Sessions */}
              <div className="p-4 space-y-3">
                {day.availabilities.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 dark:text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No sessions scheduled</p>
                  </div>
                ) : (
                  day.availabilities.map((availability) => (
                    <div
                      key={availability.id}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {timeUtils.formatTimeRange(
                              availability.startTime,
                              availability.endTime
                            )}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={uiUtils.getConsultationTypeColor(
                            availability.consultationType
                          )}
                        >
                          {uiUtils.getConsultationTypeLabel(
                            availability.consultationType
                          )}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {uiUtils.getDurationLabel(
                            availability.consultationDuration
                          )}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {uiUtils.formatCurrency(availability.consultationFee)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditSession(availability)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteSession(availability)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
