"use client";

import React from "react";
import {
  Table,
  StatusPill,
  DropdownMenu,
  Badge,
  UserInfo,
} from "@/components/ui";
import { Consultation } from "@/types";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Video,
  MessageSquare,
  Clock,
  User,
  Eye,
  Play,
  FileText,
  Star,
  Pill,
} from "lucide-react";

interface DoctorConsultationListViewProps {
  consultations: Consultation[];
  onViewConsultation?: (consultation: Consultation) => void;
  onJoinConsultation?: (consultation: Consultation) => void;
  onViewNotes?: (consultation: Consultation) => void;
  onGeneratePrescription?: (consultation: Consultation) => void;
}

const DoctorConsultationListView: React.FC<DoctorConsultationListViewProps> = ({
  consultations,
  onViewConsultation,
  onJoinConsultation,
  onViewNotes,
  onGeneratePrescription,
}) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "No date";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "Invalid date";
    }
  };

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return "No time";
    try {
      return format(new Date(dateString), "hh:mm a");
    } catch (error) {
      console.error("Invalid time:", dateString);
      return "Invalid time";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "success";
      case "completed":
        return "primary";
      case "cancelled":
        return "danger";
      case "no_show":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video_call":
        return <Video className="w-4 h-4" />;
      case "voice_call":
        return <MessageSquare className="w-4 h-4" />;
      case "chat":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return "-";
    if (duration < 60) return `${duration}m`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  const columns = [
    {
      Header: "Patient",
      accessor: "patient",
      Cell: ({ row }) => {
        return <UserInfo user={row.patient.user} />;
      },
    },
    {
      Header: "Type",
      accessor: "type",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {getTypeIcon(row.type)}
          <span className="text-sm font-medium">
            {row.type?.replace("_", " ").toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      Header: "Date & Time",
      accessor: "scheduledAt",
      Cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(row.createdAt)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(row.createdAt)}
          </div>
        </div>
      ),
    },
    {
      Header: "Duration",
      accessor: "duration",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatDuration(row.duration)}
          </span>
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => <StatusPill status={row.status} />,
    },
    {
      Header: "Rating",
      accessor: "rating",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          {row.rating ? (
            <>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{row.rating}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      accessor: "actions",
      Cell: ({ row }) => {
        const isActive = row.status === "in_progress";
        const canJoin = isActive && row.roomId;

        const actions = [
          {
            label: "View Details",
            icon: <Eye className="w-5 h-5" />,
            onClick: () => onViewConsultation?.(row),
          },
        ];

        if (canJoin) {
          actions.unshift({
            label: "Join Call",
            icon: <Play className="w-5 h-5" />,
            onClick: () => onJoinConsultation?.(row),
          });
        }

        if (row.notes) {
          actions.push({
            label: "View Notes",
            icon: <FileText className="w-5 h-5" />,
            onClick: () => onViewNotes?.(row),
          });
        }

        // Add prescription generation action for completed consultations
        if (row.status === "completed") {
          actions.push({
            label: "Generate Prescription",
            icon: <Pill className="w-5 h-5" />,
            onClick: () => onGeneratePrescription?.(row),
          });
        }

        return (
          <div className="flex items-center space-x-2">
            {canJoin && (
              <button
                onClick={() => onJoinConsultation?.(row)}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
              >
                <Play className="w-3 h-3 mr-1" />
                Join
              </button>
            )}

            <DropdownMenu items={actions} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={consultations}
        emptyMessage="No consultations found"
        className="bg-white dark:bg-gray-800"
      />
    </div>
  );
};

export default DoctorConsultationListView;
