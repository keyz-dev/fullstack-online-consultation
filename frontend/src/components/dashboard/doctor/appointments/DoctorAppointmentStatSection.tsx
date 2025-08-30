"use client";

import React from "react";
import { StatRenderer } from "@/components/ui";
import { DoctorAppointmentStats } from "@/api/appointments";
import { Calendar, Clock, TrendingUp, Activity } from "lucide-react";

interface DoctorAppointmentStatSectionProps {
  stats: DoctorAppointmentStats;
  loading?: boolean;
}

const DoctorAppointmentStatSection: React.FC<
  DoctorAppointmentStatSectionProps
> = ({ stats, loading }) => {
  const statCards = [
    {
      title: "Total",
      value: stats.total.toString(),
      icon: Activity,
      colorTheme: "indigo" as const,
      description: "Total appointments",
    },
    {
      title: "Today",
      value: stats.today.toString(),
      icon: Calendar,
      colorTheme: "blue" as const,
      description: "Today's Appointments",
    },
    {
      title: "This Week",
      value: stats.thisWeek.toString(),
      icon: Clock,
      colorTheme: "green" as const,
      description: "Appointments this week",
    },
    {
      title: "This Month",
      value: stats.thisMonth.toString(),
      icon: TrendingUp,
      colorTheme: "purple" as const,
      description: "Appointments this month",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      icon: Activity,
      colorTheme: "yellow" as const,
      description: "Completed appointments rate",
    },
  ];

  return (
    <div className="mb-6">
      <StatRenderer
        statCards={statCards}
        className="lg:w-[240px]"
        isLoading={loading}
      />
    </div>
  );
};

export default DoctorAppointmentStatSection;
