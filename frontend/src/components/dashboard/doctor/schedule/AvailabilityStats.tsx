"use client";

import React from "react";
import { StatRenderer } from "@/components/ui";
import { Calendar, Clock, BarChart3, DollarSign } from "lucide-react";
import { AvailabilityStats as Stats } from "@/types/availability";
import { uiUtils } from "@/utils/availabilityHelpers";

interface AvailabilityStatsProps {
  stats: Stats;
  loading?: boolean;
}

export const AvailabilityStats: React.FC<AvailabilityStatsProps> = ({
  stats,
  loading = false,
}) => {
  const statCards = [
    {
      title: "Total Sessions",
      value: stats.totalAvailabilities,
      description: "Active availability sessions",
      icon: Calendar,
      colorTheme: "blue",
    },
    {
      title: "Weekly Hours",
      value: `${stats.weeklyHours.toFixed(1)}h`,
      description: "Total hours per week",
      icon: Clock,
      colorTheme: "green",
    },
    {
      title: "Time Slots",
      value: stats.totalTimeSlots,
      description: "Available booking slots",
      icon: BarChart3,
      colorTheme: "purple",
    },
    {
      title: "Monthly Earnings",
      value: uiUtils.formatCurrency(stats.monthlyEarnings),
      description: "Potential monthly income",
      icon: DollarSign,
      colorTheme: "orange",
    },
  ];

  return (
    <StatRenderer
      statCards={statCards}
      className="lg:w-[240px]"
      isLoading={loading}
    />
  );
};
