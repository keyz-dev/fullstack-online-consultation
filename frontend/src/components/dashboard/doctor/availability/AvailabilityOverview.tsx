"use client";

import React from "react";
import { Card, Badge } from "@/components/ui";
import { BarChart3 } from "lucide-react";
import { Availability } from "@/types/availability";
import { uiUtils, scheduleUtils } from "@/utils/availabilityHelpers";

interface AvailabilityOverviewProps {
  availabilities: Availability[];
}

export const AvailabilityOverview: React.FC<AvailabilityOverviewProps> = ({
  availabilities,
}) => {
  return (
    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary dark:text-white" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Schedule Overview
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Summary */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Weekly Summary
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">
                Total Sessions
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {availabilities.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">
                Weekly Hours
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {scheduleUtils.calculateWeeklyHours(availabilities).toFixed(1)}h
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">
                Potential Earnings
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {uiUtils.formatCurrency(
                  scheduleUtils.calculateWeeklyEarnings(availabilities)
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Day Distribution */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Day Distribution
          </h4>
          <div className="space-y-2">
            {Object.entries(
              scheduleUtils.createWeekSchedule(availabilities)
            ).map(([dayIndex, day]) => (
              <div
                key={dayIndex}
                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {uiUtils.getDayName(parseInt(dayIndex))}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {day.availabilities.length} sessions
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
