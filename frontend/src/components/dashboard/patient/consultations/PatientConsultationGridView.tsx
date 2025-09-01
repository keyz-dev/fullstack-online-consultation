"use client";

import React from "react";
import { Badge, Button, UserInfo } from "@/components/ui";
import { Consultation } from "@/types";
import { format } from "date-fns";
import {
  Video,
  MessageSquare,
  Clock,
  Stethoscope,
  Eye,
  Play,
  Star,
} from "lucide-react";

interface PatientConsultationGridViewProps {
  consultations: Consultation[];
  onViewConsultation?: (consultation: Consultation) => void;
  onJoinConsultation?: (consultation: Consultation) => void;
  onRateConsultation?: (consultation: Consultation) => void;
}

const PatientConsultationGridView: React.FC<PatientConsultationGridViewProps> = ({
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
        return <Stethoscope className="w-4 h-4" />;
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

  const renderRating = (rating: number | null) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="text-sm font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {consultations.map((consultation) => {
        const isActive = consultation.status === "in_progress";
        const canJoin = isActive && consultation.roomId;
        const canRate = consultation.status === "completed" && !consultation.rating;

        return (
          <div
            key={consultation.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all hover:shadow-lg ${
              isActive 
                ? "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10 shadow-md" 
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(consultation.type)}
                  <span className="text-sm font-medium">
                    {consultation.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(consultation.status)}>
                    {consultation.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {isActive && (
                    <Badge variant="success" className="animate-pulse text-xs">
                      Live
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Doctor Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    Dr. {consultation.doctor?.name || 'Unknown Doctor'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {consultation.doctor?.specialty || 'General Practice'}
                  </p>
                </div>
              </div>

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
                    : formatDuration(consultation.duration)
                  }
                </span>
              </div>

              {/* Rating */}
              {renderRating(consultation.rating)}
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 flex gap-3">
              {canJoin ? (
                <Button
                  onClickHandler={() => onJoinConsultation?.(consultation)}
                  additionalClasses="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 flex items-center justify-center gap-2"
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
              
              {canRate && (
                <Button
                  onClickHandler={() => onRateConsultation?.(consultation)}
                  additionalClasses="px-3 border border-yellow-300 dark:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                >
                  <Star className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PatientConsultationGridView;
