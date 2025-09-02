"use client";

import React from "react";
import { Table, StatusPill, DropdownMenu, Badge } from "@/components/ui";
import { Consultation } from "@/types";
import { format } from "date-fns";
import Image from "next/image";
import {
  MoreHorizontal,
  Video,
  MessageSquare,
  Clock,
  User,
  Eye,
  Play,
  Star,
  Stethoscope,
} from "lucide-react";

interface PatientConsultationListViewProps {
  consultations: Consultation[];
  onViewConsultation?: (consultation: Consultation) => void;
  onJoinConsultation?: (consultation: Consultation) => void;
  onRateConsultation?: (consultation: Consultation) => void;
}

const PatientConsultationListView: React.FC<
  PatientConsultationListViewProps
> = ({
  consultations,
  onViewConsultation,
  onJoinConsultation,
  onRateConsultation,
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

  const renderRating = (rating: number | null) => {
    if (!rating)
      return <span className="text-sm text-gray-400">Not rated</span>;

    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
        <span className="text-sm font-medium ml-1">{rating}</span>
      </div>
    );
  };

  const columns = [
    {
      Header: "Doctor",
      accessor: "doctor",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            {row.doctor?.user?.avatar ? (
              <Image
                src={row.doctor?.user?.avatar}
                alt={row.doctor?.user?.name}
                height={40}
                width={40}
                className="object-cover rounded-full"
              />
            ) : (
              <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              Dr. {row.doctor?.user?.name || "Unknown Doctor"}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {row.doctor?.specialties?.[0]?.name || "General"}
            </div>
          </div>
        </div>
      ),
    },
    {
      Header: "Type",
      accessor: "type",
      Cell: ({ row }) => {
        console.log(row);

        return (
          <div className="flex items-center space-x-2">
            {getTypeIcon(row.type)}
            <span className="text-sm font-medium">
              {row.type.replace("_", " ").toUpperCase()}
            </span>
          </div>
        );
      },
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
      Cell: ({ row }) => {
        const isActive = row.status === "in_progress";
        return (
          <div className="flex items-center gap-2">
            <StatusPill status={row.status} />
            {isActive && (
              <Badge
                variant="default"
                className="animate-pulse text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
              >
                Live
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      Header: "Rating",
      accessor: "rating",
      Cell: ({ row }) => renderRating(row.rating),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => {
        const isActive = row.status === "in_progress";
        const canJoin = isActive && row.roomId;
        const canRate = row.status === "completed" && !row.rating;

        const actions = [
          {
            label: "View Details",
            icon: <Eye className="w-4 h-4" />,
            onClick: () => onViewConsultation?.(row),
          },
        ];

        if (canJoin) {
          actions.unshift({
            label: "Join Call",
            icon: <Play className="w-4 h-4" />,
            onClick: () => onJoinConsultation?.(row),
          });
        }

        if (canRate) {
          actions.push({
            label: "Rate",
            icon: <Star className="w-4 h-4" />,
            onClick: () => onRateConsultation?.(row),
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

export default PatientConsultationListView;
