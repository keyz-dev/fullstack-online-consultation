import React from "react";
import { StatRenderer } from "@/components/ui";
import { SymptomStats } from "@/api/symptoms";
import { Thermometer, FolderOpen, Star } from "lucide-react";

interface SymptomStatSectionProps {
  stats: SymptomStats;
  loading?: boolean;
}

const SymptomStatSection: React.FC<SymptomStatSectionProps> = ({
  stats,
  loading = false,
}) => {
  const statCards = [
    {
      title: "Total Symptoms",
      value: stats.total,
      description: "Total number of symptoms",
      icon: Thermometer,
      colorTheme: "blue",
    },
    {
      title: "By Specialty",
      value: stats.bySpecialty.length,
      description: "Symptoms categorized by specialty",
      icon: FolderOpen,
      colorTheme: "green",
    },
    {
      title: "Top Symptoms",
      value: stats.topSymptoms.length,
      description: "Most common symptoms",
      icon: Star,
      colorTheme: "purple",
    },
  ];

  return (
    <StatRenderer
      statCards={statCards}
      className="lg:w-[230px]"
      isLoading={loading}
    />
  );
};

export default SymptomStatSection;
