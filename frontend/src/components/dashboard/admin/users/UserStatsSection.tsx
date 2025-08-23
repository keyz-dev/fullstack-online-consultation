import React from "react";
import { StatRenderer } from "@/components/ui";
import { UserStats } from "@/api/users";
import { Users, UserCheck, Shield, TrendingUp, Clock } from "lucide-react";

interface UserStatsSectionProps {
  stats: UserStats;
  loading?: boolean;
}

const UserStatsSection: React.FC<UserStatsSectionProps> = ({
  stats,
  loading = false,
}) => {
  const statCards = [
    {
      title: "Total Users",
      value: stats?.total ?? (loading ? "..." : 0),
      colorTheme: "blue" as const,
      icon: Users,
      description: "All registered users",
    },
    {
      title: "Active Users",
      value: stats?.active ?? (loading ? "..." : 0),
      colorTheme: "green" as const,
      icon: UserCheck,
      description: "Currently active accounts",
    },
    {
      title: "Verified Users",
      value: stats?.verified ?? (loading ? "..." : 0),
      colorTheme: "purple" as const,
      icon: Shield,
      description: "Email verified accounts",
    },
    {
      title: "Recent Registrations",
      value: stats?.recentRegistrations ?? (loading ? "..." : 0),
      colorTheme: "orange" as const,
      icon: TrendingUp,
      description: "Last 30 days",
    },
    // {
    //   title: "Pending Applications",
    //   value:
    //     (stats?.byRole?.pending_doctor ?? 0) +
    //     (stats?.byRole?.pending_pharmacy ?? 0),
    //   colorTheme: "indigo" as const,
    //   icon: Clock,
    //   description: "Awaiting approval",
    // },
  ];

  return (
    <StatRenderer
      statCards={statCards}
      className="lg:w-[240px]"
      isLoading={loading}
    />
  );
};

export default UserStatsSection;
