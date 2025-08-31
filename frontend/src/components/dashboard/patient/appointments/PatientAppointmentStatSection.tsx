import React from "react";
import { StatRenderer } from "@/components/ui";
import { PatientAppointmentStats } from "@/api/appointments";
import {
  Calendar,
  Clock,
  CheckCircle,
  CreditCard,
} from "lucide-react";

interface PatientAppointmentStatSectionProps {
  stats: PatientAppointmentStats;
  loading?: boolean;
}

const PatientAppointmentStatSection: React.FC<
  PatientAppointmentStatSectionProps
> = ({ stats, loading = false }) => {
  const statCards = [
    {
      title: "Total Appointments",
      value: stats?.total ?? (loading ? "..." : 0),
      colorTheme: "blue",
      icon: Calendar,
      description: "All your appointments",
    },
    {
      title: "Upcoming",
      value: stats?.upcoming ?? (loading ? "..." : 0),
      colorTheme: "green",
      icon: Clock,
      description: "Scheduled appointments",
    },
    {
      title: "Completed",
      value: stats?.completed ?? (loading ? "..." : 0),
      colorTheme: "purple",
      icon: CheckCircle,
      description: "Finished consultations",
    },
    {
      title: "Pending Payment",
      value: stats?.pendingPayment ?? (loading ? "..." : 0),
      colorTheme: "yellow",
      icon: CreditCard,
      description: "Awaiting payment",
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

export default PatientAppointmentStatSection;
