"use client";

import React from "react";
import { StatRenderer } from "@/components/ui";
import { MessageSquare, Clock, Activity, TrendingUp, Video, CheckCircle } from "lucide-react";

interface DoctorConsultationStats {
  total: number;
  active: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  completed: number;
  avgDuration: number;
  successRate: number;
}

interface DoctorConsultationStatSectionProps {
  stats: DoctorConsultationStats;
  loading?: boolean;
}

const DoctorConsultationStatSection: React.FC<DoctorConsultationStatSectionProps> = ({ 
  stats, 
  loading 
}) => {
  const statCards = [
    {
      title: "Active Now",
      value: stats.active.toString(),
      icon: Video,
      colorTheme: "red" as const,
      description: "Ongoing consultations",
      trend: stats.active > 0 ? "Live" : undefined,
    },
    {
      title: "Total",
      value: stats.total.toString(),
      icon: MessageSquare,
      colorTheme: "blue" as const,
      description: "Total consultations",
    },
    {
      title: "Completed",
      value: stats.completed.toString(),
      icon: CheckCircle,
      colorTheme: "green" as const,
      description: "Successfully completed",
    },
    {
      title: "Avg Duration",
      value: `${stats.avgDuration}m`,
      icon: Clock,
      colorTheme: "yellow" as const,
      description: "Average consultation time",
    },
  ];

  return (
    <div className="mb-6">
      <StatRenderer
        statCards={statCards}
        loading={loading}
        columns={3} // Show 3 per row for better layout
      />
    </div>
  );
};

export default DoctorConsultationStatSection;
