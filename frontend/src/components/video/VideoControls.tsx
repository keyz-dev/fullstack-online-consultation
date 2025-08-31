"use client";

import React from "react";
import { Button } from "@/components/ui";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Monitor,
  MonitorOff,
  MessageSquare,
  FileText,
} from "lucide-react";

interface VideoControlsProps {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  showChat: boolean;
  showNotes: boolean;
  userRole: "doctor" | "patient";
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onToggleNotes: () => void;
  onEndCall: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isVideoEnabled,
  isAudioEnabled,
  isScreenSharing,
  showChat,
  showNotes,
  userRole,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onToggleChat,
  onToggleNotes,
  onEndCall,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-4">
        <Button
          onClickHandler={onToggleAudio}
          additionalClasses={`p-3 rounded-full ${
            isAudioEnabled 
              ? "bg-gray-600 hover:bg-gray-500 text-white" 
              : "bg-red-600 hover:bg-red-500 text-white"
          }`}
        >
          {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </Button>
        
        <Button
          onClickHandler={onToggleVideo}
          additionalClasses={`p-3 rounded-full ${
            isVideoEnabled 
              ? "bg-gray-600 hover:bg-gray-500 text-white" 
              : "bg-red-600 hover:bg-red-500 text-white"
          }`}
        >
          {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </Button>

        {userRole === "doctor" && (
          <Button
            onClickHandler={onToggleScreenShare}
            additionalClasses={`p-3 rounded-full ${
              isScreenSharing 
                ? "bg-blue-600 hover:bg-blue-500 text-white" 
                : "bg-gray-600 hover:bg-gray-500 text-white"
            }`}
          >
            {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </Button>
        )}

        <Button
          onClickHandler={onToggleChat}
          additionalClasses={`p-3 rounded-full ${
            showChat 
              ? "bg-blue-600 hover:bg-blue-500 text-white" 
              : "bg-gray-600 hover:bg-gray-500 text-white"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
        </Button>

        {userRole === "doctor" && (
          <Button
            onClickHandler={onToggleNotes}
            additionalClasses={`p-3 rounded-full ${
              showNotes 
                ? "bg-blue-600 hover:bg-blue-500 text-white" 
                : "bg-gray-600 hover:bg-gray-500 text-white"
            }`}
          >
            <FileText className="w-5 h-5" />
          </Button>
        )}

        <Button
          onClickHandler={onEndCall}
          additionalClasses="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full"
        >
          <Phone className="w-5 h-5 transform rotate-[135deg]" />
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;