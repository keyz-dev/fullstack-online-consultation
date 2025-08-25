import React from "react";
import { StatRenderer } from "@/components/ui";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { ApplicationStats } from "@/api/admin";

interface ApplicationStatSectionProps {
  stats: ApplicationStats;
  loading: boolean;
}

const ApplicationStatSection: React.FC<ApplicationStatSectionProps> = ({ stats, loading }) => {
  const statCards = [
    {
      title: "Total Applications",
      value: stats?.total ?? (loading ? "..." : 0),
      colorTheme: "blue",
      icon: FileText,
      description: "Total number of applications",
    },
    {
      title: "Pending Review",
      value: stats?.pending ?? (loading ? "..." : 0),
      colorTheme: "orange",
      icon: Clock,
      description: "Applications awaiting review",
    },
    {
      title: "Approved",
      value: stats?.approved ?? (loading ? "..." : 0),
      colorTheme: "green",
      icon: CheckCircle,
      description: "Applications that have been approved",
    },
    {
      title: "Rejected",
      value: stats?.rejected ?? (loading ? "..." : 0),
      colorTheme: "red",
      icon: XCircle,
      description: "Applications that have been rejected",
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

export default ApplicationStatSection;
