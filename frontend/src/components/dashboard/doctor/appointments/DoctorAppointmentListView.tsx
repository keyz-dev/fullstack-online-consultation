"use client";

import React from "react";
import { Table, StatusPill, DropdownMenu } from "@/components/ui";
import { DoctorAppointment } from "@/api/appointments";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Video,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  XCircle,
  Eye,
  CalendarClock,
  MessageCircle,
  RotateCcw,
  Trash2,
} from "lucide-react";

interface DoctorAppointmentListViewProps {
  appointments: DoctorAppointment[];
  onViewAppointment?: (appointment: DoctorAppointment) => void;
  onStartConsultation?: (appointment: DoctorAppointment) => void;
  onRescheduleAppointment?: (appointment: DoctorAppointment) => void;
  onCancelAppointment?: (appointment: DoctorAppointment) => void;
  onStartVideoCall?: (appointment: DoctorAppointment) => void;
  onStartChat?: (appointment: DoctorAppointment) => void;
  onInvalidateAppointment?: (appointment: DoctorAppointment) => void;
}

const DoctorAppointmentListView: React.FC<DoctorAppointmentListViewProps> = ({
  appointments,
  onViewAppointment,
  onRescheduleAppointment,
  onCancelAppointment,
  onStartVideoCall,
  onStartChat,
  onInvalidateAppointment,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), "hh:mm a");
  };

  const getSmartStatusLabel = (appointment: DoctorAppointment) => {
    const { status, timeSlot } = appointment;
    const now = new Date();
    const appointmentDate = new Date(timeSlot.date);
    const appointmentDateTime = new Date(
      `${timeSlot.date}T${timeSlot.startTime}`
    );
    const endDateTime = new Date(`${timeSlot.date}T${timeSlot.endTime}`);

    // Check if appointment is today
    const isToday = appointmentDate.toDateString() === now.toDateString();

    // Calculate time difference
    const minutesToStart = Math.floor(
      (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60)
    );
    const minutesSinceStart = Math.floor(
      (now.getTime() - appointmentDateTime.getTime()) / (1000 * 60)
    );
    const isPast = now > appointmentDateTime;
    const isCurrentlyHappening =
      now >= appointmentDateTime && now <= endDateTime;

    // Handle different statuses with time context
    switch (status) {
      case "confirmed":
      case "paid":
        if (isCurrentlyHappening) {
          return "Ready to Start";
        } else if (isToday && minutesToStart > 0 && minutesToStart <= 60) {
          return `Starting in ${minutesToStart} min${
            minutesToStart !== 1 ? "s" : ""
          }`;
        } else if (isToday && minutesToStart <= 0 && minutesSinceStart <= 30) {
          return "Should Start Now";
        } else if (isPast) {
          return "Overdue";
        } else if (isToday) {
          return "Today";
        } else {
          return "Upcoming";
        }

      case "in_progress":
        return "In Progress";

      case "completed":
        return "Completed";

      case "cancelled":
        return "Cancelled";

      case "no_show":
        return "Missed";

      case "pending_payment":
        return "Payment Pending";

      default:
        return status;
    }
  };

  const getStatusColor = (appointment: DoctorAppointment) => {
    const { status, timeSlot } = appointment;
    const now = new Date();
    const appointmentDateTime = new Date(
      `${timeSlot.date}T${timeSlot.startTime}`
    );
    const endDateTime = new Date(`${timeSlot.date}T${timeSlot.endTime}`);
    const isCurrentlyHappening =
      now >= appointmentDateTime && now <= endDateTime;
    const isPast = now > appointmentDateTime;
    const minutesToStart = Math.floor(
      (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60)
    );

    switch (status) {
      case "confirmed":
      case "paid":
        if (isCurrentlyHappening) {
          return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
        } else if (minutesToStart > 0 && minutesToStart <= 15) {
          return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
        } else if (isPast) {
          return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
        } else {
          return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
        }

      case "in_progress":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";

      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";

      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";

      case "no_show":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";

      case "pending_payment":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";

      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
      case "online":
        return Video;
      case "physical":
        return MapPin;
      default:
        return Video;
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

  const getPriorityIndicator = (appointment: DoctorAppointment) => {
    const { status, timeSlot } = appointment;
    const now = new Date();
    const appointmentDateTime = new Date(
      `${timeSlot.date}T${timeSlot.startTime}`
    );
    const isCurrentlyHappening =
      now >= appointmentDateTime &&
      now <= new Date(`${timeSlot.date}T${timeSlot.endTime}`);
    const minutesToStart = Math.floor(
      (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60)
    );
    const isPast = now > appointmentDateTime;

    if ((status === "confirmed" || status === "paid") && isCurrentlyHappening) {
      return { level: "urgent", icon: "🔴", text: "Start Now" };
    } else if (
      (status === "confirmed" || status === "paid") &&
      minutesToStart > 0 &&
      minutesToStart <= 15
    ) {
      return { level: "high", icon: "🟠", text: `${minutesToStart}m` };
    } else if ((status === "confirmed" || status === "paid") && isPast) {
      return { level: "overdue", icon: "⚠️", text: "Overdue" };
    } else if (status === "in_progress") {
      return { level: "active", icon: "🟢", text: "Active" };
    }

    return null;
  };

  const columns = [
    {
      Header: "Patient",
      accessor: "patient",
      Cell: ({ row }: { row: DoctorAppointment }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            {row.patient?.user.avatar ? (
              <img
                src={row.patient.user.avatar}
                alt={row.patient.user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {row.patient?.user.name.charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {row.patient?.user.name || "Unknown Patient"}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {row.patient?.user.email || "No email"}
            </div>
          </div>
        </div>
      ),
    },
    {
      Header: "Priority",
      accessor: "priority",
      Cell: ({ row }: { row: DoctorAppointment }) => {
        const priority = getPriorityIndicator(row);
        if (!priority) {
          return <span className="text-gray-400 dark:text-gray-500">—</span>;
        }

        return (
          <div className="flex items-center space-x-1">
            <span className="text-sm">{priority.icon}</span>
            <span
              className={`text-xs font-medium ${
                priority.level === "urgent"
                  ? "text-red-600 dark:text-red-400"
                  : priority.level === "high"
                  ? "text-orange-600 dark:text-orange-400"
                  : priority.level === "overdue"
                  ? "text-red-600 dark:text-red-400"
                  : priority.level === "active"
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {priority.text}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Date & Time",
      accessor: "timeSlot",
      Cell: ({ row }: { row: DoctorAppointment }) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {formatDate(row.timeSlot.date)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatTime(row.timeSlot.startTime)} -{" "}
            {formatTime(row.timeSlot.endTime)}
          </div>
        </div>
      ),
    },
    {
      Header: "Type",
      accessor: "consultationType",
      Cell: ({ row }: { row: DoctorAppointment }) => {
        const Icon = getConsultationTypeIcon(row.consultationType);
        return (
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-900 dark:text-white">
              {getConsultationTypeLabel(row.consultationType)}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }: { row: DoctorAppointment }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            row
          )}`}
        >
          {getSmartStatusLabel(row)}
        </span>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }: { row: DoctorAppointment }) => {
        const appointment = row;
        const canStartConsultation =
          appointment.status === "confirmed" || appointment.status === "paid";
        const canCancel = ["confirmed", "paid", "pending_payment"].includes(
          appointment.status
        );
        const canStartVideoCall =
          (appointment.status === "confirmed" ||
            appointment.status === "paid") &&
          appointment.consultationType === "online";
        const canStartChat =
          appointment.status === "confirmed" || appointment.status === "paid";

        const menuItems = [
          ...(onViewAppointment
            ? [
                {
                  icon: <Eye className="w-4 h-4" />,
                  label: "View Details",
                  onClick: () => onViewAppointment(appointment),
                },
              ]
            : []),
          ...(canStartVideoCall && onStartVideoCall
            ? [
                {
                  icon: <Video className="w-4 h-4" />,
                  label: "Start Video Call",
                  onClick: () => onStartVideoCall(appointment),
                },
              ]
            : []),
          ...(canStartChat && onStartChat
            ? [
                {
                  icon: <MessageCircle className="w-4 h-4" />,
                  label: "Start Chat",
                  onClick: () => onStartChat(appointment),
                },
              ]
            : []),
          ...(onRescheduleAppointment
            ? [
                {
                  icon: <RotateCcw className="w-4 h-4" />,
                  label: "Reschedule",
                  onClick: () => onRescheduleAppointment(appointment),
                },
              ]
            : []),
          ...(canCancel && onCancelAppointment
            ? [
                {
                  icon: (
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  ),
                  label: "Cancel",
                  onClick: () => onCancelAppointment(appointment),
                  isDestructive: true,
                },
              ]
            : []),
          ...(onInvalidateAppointment
            ? [
                {
                  icon: (
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  ),
                  label: "Invalidate",
                  onClick: () => onInvalidateAppointment(appointment),
                },
              ]
            : []),
        ];

        return <DropdownMenu items={menuItems} />;
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
      <Table
        columns={columns}
        data={appointments}
        emptyStateMessage="No appointments found"
      />
    </div>
  );
};

export default DoctorAppointmentListView;
