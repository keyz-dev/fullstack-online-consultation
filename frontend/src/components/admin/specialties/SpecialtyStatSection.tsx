import React from "react";
import { StatRenderer } from "@/components/ui";
import { SpecialtyStats } from "@/api/specialties";
import { FolderOpen, CheckCircle, XCircle } from "lucide-react";

interface SpecialtyStatSectionProps {
  stats: SpecialtyStats;
  loading?: boolean;
}

const SpecialtyStatSection: React.FC<SpecialtyStatSectionProps> = ({
  stats,
  loading = false,
}) => {
  const statCards = [
    {
      title: "Total Specialties",
      value: stats?.total ?? (loading ? "..." : 0),
      colorTheme: "blue",
      icon: FolderOpen,
      description: "Total number of specialties",
    },
    {
      title: "Active",
      value: stats?.active ?? (loading ? "..." : 0),
      colorTheme: "green",
      icon: CheckCircle,
      description: "Active specialties",
    },
    {
      title: "Inactive",
      value: stats?.inactive ?? (loading ? "..." : 0),
      colorTheme: "red",
      icon: XCircle,
      description: "Inactive specialties",
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

export default SpecialtyStatSection;
