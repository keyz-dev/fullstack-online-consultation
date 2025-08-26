"use client";

import React from "react";
import { Card } from "@/components/ui";
import { Availability } from "@/types/availability";
import { timeUtils, uiUtils } from "@/utils/availabilityHelpers";
import { Calendar, Clock, DollarSign } from "lucide-react";

interface AvailabilityOverviewProps {
  availabilities: Availability[];
}

export const AvailabilityOverview: React.FC<AvailabilityOverviewProps> = ({
  availabilities,
}) => {
  const calculateStats = () => {
    let totalHours = 0;
    let totalSlots = 0;
    let totalEarnings = 0;
    const dayDistribution: Record<number, number> = {};

    availabilities.forEach((availability) => {
      const hours =
        timeUtils.getTimeDifference(
          availability.startTime,
          availability.endTime
        ) / 60;
      const slots = Math.floor(
        (hours * 60) / availability.consultationDuration
      );

      totalHours += hours;
      totalSlots += slots;
      totalEarnings += slots * availability.consultationFee;

      dayDistribution[availability.dayOfWeek] =
        (dayDistribution[availability.dayOfWeek] || 0) + 1;
    });

    return { totalHours, totalSlots, totalEarnings, dayDistribution };
  };

  const stats = calculateStats();
  const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalHours.toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Weekly Hours
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalSlots}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Available Slots
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {uiUtils.formatCurrency(stats.totalEarnings)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Weekly Potential
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Day Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Day Distribution
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAY_NAMES.map((dayName, index) => {
            const sessionCount = stats.dayDistribution[index] || 0;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {dayName}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {sessionCount} session{sessionCount !== 1 ? "s" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        {availabilities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No availability sessions configured yet</p>
            <p className="text-sm">
              Start by adding your first availability session
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availabilities.slice(0, 5).map((availability, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {DAY_NAMES[availability.dayOfWeek]}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {timeUtils.formatTime(availability.startTime)} -{" "}
                      {timeUtils.formatTime(availability.endTime)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {uiUtils.formatCurrency(availability.consultationFee)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
