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
} from "lucide-react";

interface DoctorAppointmentListViewProps {
  appointments: DoctorAppointment[];
  onViewAppointment?: (appointment: DoctorAppointment) => void;
  onStartConsultation?: (appointment: DoctorAppointment) => void;
  onRescheduleAppointment?: (appointment: DoctorAppointment) => void;
  onCancelAppointment?: (appointment: DoctorAppointment) => void;
}

const DoctorAppointmentListView: React.FC<DoctorAppointmentListViewProps> = ({
  appointments,
  onViewAppointment,
  onStartConsultation,
  onRescheduleAppointment,
  onCancelAppointment,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), "hh:mm a");
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
        return "orange";
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
      header: "Patient",
      accessorKey: "patient",
      cell: ({ row }: { row: { original: DoctorAppointment } }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            {row.original.patient.user.avatar ? (
              <img
                src={row.original.patient.user.avatar}
                alt={row.original.patient.user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {row.original.patient.user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {row.original.patient.user.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {row.original.patient.user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Date & Time",
      accessorKey: "timeSlot",
      cell: ({ row }: { row: { original: DoctorAppointment } }) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {formatDate(row.original.timeSlot.date)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatTime(row.original.timeSlot.startTime)} -{" "}
            {formatTime(row.original.timeSlot.endTime)}
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "consultationType",
      cell: ({ row }: { row: { original: DoctorAppointment } }) => {
        const Icon = getConsultationTypeIcon(row.original.consultationType);
        return (
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-900 dark:text-white">
              {getConsultationTypeLabel(row.original.consultationType)}
            </span>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { original: DoctorAppointment } }) => (
        <StatusPill
          status={getStatusLabel(row.original.status)}
          color={getStatusColor(row.original.status)}
        />
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: { row: { original: DoctorAppointment } }) => {
        const appointment = row.original;
        const canStartConsultation = appointment.status === "confirmed";
        const canCancel = ["confirmed", "pending_payment"].includes(
          appointment.status
        );

        return (
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              {onViewAppointment && (
                <DropdownMenu.Item
                  onClick={() => onViewAppointment(appointment)}
                >
                  View Details
                </DropdownMenu.Item>
              )}
              {canStartConsultation && onStartConsultation && (
                <DropdownMenu.Item
                  onClick={() => onStartConsultation(appointment)}
                >
                  Start Consultation
                </DropdownMenu.Item>
              )}
              {onRescheduleAppointment && (
                <DropdownMenu.Item
                  onClick={() => onRescheduleAppointment(appointment)}
                >
                  Reschedule
                </DropdownMenu.Item>
              )}
              {canCancel && onCancelAppointment && (
                <DropdownMenu.Item
                  onClick={() => onCancelAppointment(appointment)}
                  className="text-red-600 dark:text-red-400"
                >
                  Cancel Appointment
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <Table data={appointments} columns={columns} className="w-full" />
    </div>
  );
};

export default DoctorAppointmentListView;
