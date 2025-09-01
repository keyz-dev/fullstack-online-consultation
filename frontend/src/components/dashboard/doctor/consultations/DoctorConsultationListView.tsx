"use client";

import React from "react";
import { Table, StatusPill, DropdownMenu, Badge } from "@/components/ui";
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
} from "lucide-react";

interface DoctorConsultationListViewProps {
  consultations: Consultation[];
  onViewConsultation?: (consultation: Consultation) => void;
  onJoinConsultation?: (consultation: Consultation) => void;
  onViewNotes?: (consultation: Consultation) => void;
}

const DoctorConsultationListView: React.FC<DoctorConsultationListViewProps> = ({
  consultations,
  onViewConsultation,
  onJoinConsultation,
  onViewNotes,
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
      header: "Patient",
      key: "patient",
      render: (consultation: Consultation) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {consultation.patient?.name || 'Unknown Patient'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {consultation.patient?.email || 'No email'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      key: "type",
      render: (consultation: Consultation) => (
        <div className="flex items-center space-x-2">
          {getTypeIcon(consultation.type)}
          <span className="text-sm font-medium">
            {consultation.type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      header: "Date & Time",
      key: "scheduledAt",
      render: (consultation: Consultation) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(consultation.createdAt)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(consultation.createdAt)}
          </div>
        </div>
      ),
    },
    {
      header: "Duration",
      key: "duration",
      render: (consultation: Consultation) => (
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatDuration(consultation.duration)}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (consultation: Consultation) => {
        const isActive = consultation.status === "in_progress";
        return (
          <div className="flex items-center gap-2">
            <StatusPill 
              status={consultation.status} 
              colorScheme={getStatusColor(consultation.status)} 
            />
            {isActive && (
              <Badge variant="success" className="animate-pulse text-xs">
                Live
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: "Rating",
      key: "rating",
      render: (consultation: Consultation) => (
        <div className="flex items-center space-x-1">
          {consultation.rating ? (
            <>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{consultation.rating}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (consultation: Consultation) => {
        const isActive = consultation.status === "in_progress";
        const canJoin = isActive && consultation.roomId;
        
        const actions = [
          {
            label: "View Details",
            icon: Eye,
            onClick: () => onViewConsultation?.(consultation),
          },
        ];

        if (canJoin) {
          actions.unshift({
            label: "Join Call",
            icon: Play,
            onClick: () => onJoinConsultation?.(consultation),
          });
        }

        if (consultation.notes) {
          actions.push({
            label: "View Notes",
            icon: FileText,
            onClick: () => onViewNotes?.(consultation),
          });
        }

        return (
          <div className="flex items-center space-x-2">
            {canJoin && (
              <button
                onClick={() => onJoinConsultation?.(consultation)}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
              >
                <Play className="w-3 h-3 mr-1" />
                Join
              </button>
            )}
            
            <DropdownMenu
              trigger={
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              }
              items={actions}
            />
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
