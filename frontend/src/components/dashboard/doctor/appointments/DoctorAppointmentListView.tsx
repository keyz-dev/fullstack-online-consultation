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
  onStartConsultation,
  onRescheduleAppointment,
  onCancelAppointment,
  onStartVideoCall,
  onStartChat,
  onInvalidateAppointment,
}) => {
  console.log("🔍 DoctorAppointmentListView - appointments:", appointments);
  console.log(
    "🔍 DoctorAppointmentListView - appointments length:",
    appointments.length
  );
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), "hh:mm a");
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return "Confirmed";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "no_show":
        return "No Show";
      default:
        return status;
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
        <StatusPill status={getStatusLabel(row.status)} />
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
