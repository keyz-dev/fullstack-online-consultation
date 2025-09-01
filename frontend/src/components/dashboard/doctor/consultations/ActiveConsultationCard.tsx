"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { Video, Clock, User, ArrowRight } from "lucide-react";
import { Consultation } from "@/types";

interface ActiveConsultationCardProps {
  consultation: Consultation;
  onJoin: (consultationId: string) => void;
}

const ActiveConsultationCard: React.FC<ActiveConsultationCardProps> = ({
  consultation,
  onJoin,
}) => {
  const router = useRouter();

  const formatDuration = (startedAt: string) => {
    const start = new Date(startedAt);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const minutes = Math.floor(diffMs / 60000);
    
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const handleJoinCall = () => {
    // Navigate directly to the video call room
    router.push(`/doctor/consultation/${consultation.id}/video?roomId=${consultation.roomId}`);
  };

  const handleViewDetails = () => {
    router.push(`/doctor/consultations/${consultation.id}`);
  };

  return (
    <Card className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
            <Video className="w-5 h-5" />
            Active Consultation
          </CardTitle>
          <Badge variant="success" className="animate-pulse">
            Live
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Patient Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {consultation.patient?.name || 'Unknown Patient'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {consultation.patient?.email || 'No email'}
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Duration: {consultation.startedAt ? formatDuration(consultation.startedAt) : 'Just started'}</span>
        </div>

        {/* Consultation Type */}
        <div className="flex items-center gap-2">
          <Badge variant={consultation.type === 'video_call' ? 'default' : 'secondary'}>
            {consultation.type.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClickHandler={handleJoinCall}
            additionalClasses="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4" />
            Rejoin Call
          </Button>
          
          <Button
            onClickHandler={handleViewDetails}
            additionalClasses="px-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveConsultationCard;
