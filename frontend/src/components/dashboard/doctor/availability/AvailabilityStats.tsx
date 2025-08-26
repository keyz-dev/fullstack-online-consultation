"use client";

import React from "react";
import { Card } from "@/components/ui";
import { Calendar, Clock, BarChart3, CheckCircle } from "lucide-react";
import { AvailabilityStats as Stats } from "@/types/availability";
import { uiUtils } from "@/utils/availabilityHelpers";

interface AvailabilityStatsProps {
  stats: Stats;
}

export const AvailabilityStats: React.FC<AvailabilityStatsProps> = ({
  stats,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Sessions
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.totalAvailabilities}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Weekly Hours
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.weeklyHours}h
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Time Slots
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.totalTimeSlots}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <CheckCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly Earnings
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {uiUtils.formatCurrency(stats.monthlyEarnings)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
