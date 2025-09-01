"use client";

import React from "react";
import { StatRenderer } from "@/components/ui";
import { MessageSquare, Clock, Star, TrendingUp, Video, CheckCircle } from "lucide-react";

interface PatientConsultationStats {
  total: number;
  active: number;
  upcoming: number;
  completed: number;
  thisMonth: number;
  avgRating: number;
  totalHours: number;
}

interface PatientConsultationStatSectionProps {
  stats: PatientConsultationStats;
  loading?: boolean;
}

const PatientConsultationStatSection: React.FC<PatientConsultationStatSectionProps> = ({ 
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
      description: "All consultations",
    },
    {
      title: "Completed",
      value: stats.completed.toString(),
      icon: CheckCircle,
      colorTheme: "green" as const,
      description: "Finished consultations",
    },
    {
      title: "Avg Rating",
      value: stats.avgRating > 0 ? stats.avgRating.toString() : "-",
      icon: Star,
      colorTheme: "yellow" as const,
      description: "Your consultation ratings",
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

export default PatientConsultationStatSection;
