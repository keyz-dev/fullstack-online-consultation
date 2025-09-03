"use client";

import React from "react";
import { Badge, Button, UserInfo, StatusPill } from "@/components/ui";
import { Consultation } from "@/types";
import { format } from "date-fns";
import {
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

interface DoctorConsultationGridViewProps {
  consultations: Consultation[];
  onViewConsultation?: (consultation: Consultation) => void;
  onJoinConsultation?: (consultation: Consultation) => void;
  onViewNotes?: (consultation: Consultation) => void;
  onGeneratePrescription?: (consultation: Consultation) => void;
}

const DoctorConsultationGridView: React.FC<DoctorConsultationGridViewProps> = ({
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

  const formatDurationFromStart = (startedAt: string | null | undefined) => {
    if (!startedAt) return "0m";
    try {
      const start = new Date(startedAt);
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();
      const minutes = Math.floor(diffMs / 60000);

      if (minutes < 0) return "0m";
      if (minutes < 60) return `${minutes}m`;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    } catch (error) {
      console.error("Invalid start date:", startedAt);
      return "0m";
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {consultations.map((consultation) => {
        const isActive = consultation.status === "in_progress";
        const canJoin = isActive && consultation.roomId;

        return (
          <div
            key={consultation.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all hover:shadow-lg ${
              isActive
                ? "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10 shadow-md"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(consultation.type)}
                  <span className="text-sm font-medium">
                    {consultation.type.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={consultation.status} />
                  {isActive && (
                    <Badge
                      variant="default"
                      className="animate-pulse text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                    >
                      Live
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Patient Info */}
              <UserInfo user={consultation.patient.user} />

              {/* Date & Time */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>{formatDate(consultation.createdAt)}</span>
                  <span>{formatTime(consultation.createdAt)}</span>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>
                  {isActive && consultation.startedAt
                    ? `Live: ${formatDurationFromStart(consultation.startedAt)}`
                    : formatDuration(consultation.duration ?? 0)}
                </span>
              </div>

              {/* Rating */}
              {consultation.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">
                    {consultation.rating}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 flex gap-3">
              {canJoin ? (
                <Button
                  onClickHandler={() => onJoinConsultation?.(consultation)}
                  additionalClasses="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Rejoin Call
                </Button>
              ) : (
                <Button
                  onClickHandler={() => onViewConsultation?.(consultation)}
                  additionalClasses="flex-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm py-2"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              )}
              
              {/* Generate Prescription Button for completed consultations */}
              {consultation.status === "completed" && (
                <Button
                  onClickHandler={() => onGeneratePrescription?.(consultation)}
                  additionalClasses="px-3 bg-blue-600 hover:bg-blue-700 text-white border-0"
                >
                  <Pill className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DoctorConsultationGridView;
