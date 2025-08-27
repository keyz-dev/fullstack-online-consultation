import React from "react";
import Image from "next/image";
import { Table, StatusPill, DropdownMenu } from "@/components/ui";
import { PatientAppointment } from "@/api/appointments";
import { formatDate } from "@/utils/dateUtils";
import {
  Eye,
  XCircle,
  Video,
  Phone,
  MessageSquare,
  MapPin,
  Edit,
} from "lucide-react";

interface PatientAppointmentListViewProps {
  appointments: PatientAppointment[];
  loading: boolean;
  onView: (appointment: PatientAppointment) => void;
  onCancel: (appointment: PatientAppointment) => void;
  onReschedule: (appointment: PatientAppointment) => void;
}

const PatientAppointmentListView: React.FC<PatientAppointmentListViewProps> = ({
  appointments,
  loading,
  onView,
  onCancel,
  onReschedule,
}) => {
  // Helper functions
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "blue";
      case "in_progress":
        return "green";
      case "completed":
        return "purple";
      case "cancelled":
        return "red";
      case "no_show":
        return "yellow";
      case "pending_payment":
        return "orange";
      case "paid":
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "no_show":
        return "No Show";
      case "pending_payment":
        return "Pending Payment";
      case "paid":
        return "Paid";
      default:
        return status;
    }
  };

  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
      case "online":
        return <Video className="w-4 h-4" />;
      case "physical":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getConsultationTypeLabel = (type: string) => {
    switch (type) {
      case "online":
        return "Online";
      case "physical":
        return "In Person";
      default:
        return type;
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Doctor",
        accessor: "doctor",
        Cell: ({ row }: { row: PatientAppointment }) => (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 relative">
              {row.doctor.user.avatar ? (
                <Image
                  src={row.doctor.user.avatar}
                  alt={row.doctor.user.name}
                  fill
                  className="object-cover rounded-full border border-gray-200 dark:border-gray-600"
                  sizes="40px"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
                  {row.doctor.user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Dr. {row.doctor.user.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {row.doctor.specialty.name}
              </p>
            </div>
          </div>
        ),
      },
      {
        Header: "Date & Time",
        accessor: "timeSlot",
        Cell: ({ row }: { row: PatientAppointment }) => (
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatDate(row.timeSlot.date)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatTime(row.timeSlot.startTime)} -{" "}
              {formatTime(row.timeSlot.endTime)}
            </p>
          </div>
        ),
      },
      {
        Header: "Type",
        accessor: "consultationType",
        Cell: ({ row }: { row: PatientAppointment }) => (
          <div className="flex items-center space-x-2">
            {getConsultationTypeIcon(row.consultationType)}
            <span className="text-gray-700 dark:text-gray-300">
              {getConsultationTypeLabel(row.consultationType)}
            </span>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }: { row: PatientAppointment }) => (
          <StatusPill
            status={getStatusLabel(row.status)}
            color={getStatusColor(row.status)}
          />
        ),
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: ({ row }: { row: PatientAppointment }) => (
          <span className="text-gray-600 dark:text-gray-300">
            {formatDate(row.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        Header: "Actions",
        Cell: ({ row }: { row: PatientAppointment }) => {
          const menuItems = [
            {
              label: "View Details",
              icon: <Eye size={16} />,
              onClick: () => onView(row),
            },
            ...(row.status === "confirmed"
              ? [
                  {
                    label: "Reschedule",
                    icon: <Edit size={16} />,
                    onClick: () => onReschedule(row),
                  },
                  {
                    label: "Cancel Appointment",
                    icon: <XCircle size={16} />,
                    onClick: () => onCancel(row),
                    isDestructive: true,
                  },
                ]
              : []),
          ];
          return <DropdownMenu items={menuItems} />;
        },
      },
    ],
    [onView, onCancel, onReschedule]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <Table
        columns={columns as any}
        data={appointments}
        isLoading={loading}
        emptyStateMessage="No appointments found. Book your first appointment to get started."
        onRowClick={(row) => onView(row)}
        clickableRows={true}
      />
    </div>
  );
};

export default PatientAppointmentListView;
