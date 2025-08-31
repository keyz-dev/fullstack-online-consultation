import React from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, MessageSquare, FileText, Phone, Upload, Zap } from 'lucide-react';
import Button from '../ui/Button';

interface VideoControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  showChat: boolean;
  showNotes: boolean;
  showFiles: boolean;
  showActions: boolean;
  userRole: string;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  setShowChat: (show: boolean) => void;
  setShowNotes: (show: boolean) => void;
  setShowFiles: (show: boolean) => void;
  setShowActions: (show: boolean) => void;
  handleEndCall: () => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  showChat,
  showNotes,
  showFiles,
  showActions,
  userRole,
  toggleAudio,
  toggleVideo,
  toggleScreenShare,
  setShowChat,
  setShowNotes,
  setShowFiles,
  setShowActions,
  handleEndCall,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-2">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-full px-3 sm:px-6 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
        <Button
          onClickHandler={toggleAudio}
          additionalClasses={`p-2 sm:p-3 rounded-full ${
            isAudioEnabled 
              ? "bg-gray-600 hover:bg-gray-500 text-white" 
              : "bg-red-600 hover:bg-red-500 text-white"
          }`}
          title="Toggle Audio"
        >
          {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </Button>
        
        <Button
          onClickHandler={toggleVideo}
          additionalClasses={`p-2 sm:p-3 rounded-full ${
            isVideoEnabled 
              ? "bg-gray-600 hover:bg-gray-500 text-white" 
              : "bg-red-600 hover:bg-red-500 text-white"
          }`}
        >
          {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </Button>

        {userRole === "doctor" && (
          <Button
            onClickHandler={toggleScreenShare}
            additionalClasses={`p-2 sm:p-3 rounded-full ${
              isScreenSharing 
                ? "bg-blue-600 hover:bg-blue-500 text-white" 
                : "bg-gray-600 hover:bg-gray-500 text-white"
            }`}
          >
            {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </Button>
        )}

        <Button
          onClickHandler={() => setShowChat(!showChat)}
          additionalClasses={`p-2 sm:p-3 rounded-full ${
            showChat 
              ? "bg-blue-600 hover:bg-blue-500 text-white" 
              : "bg-gray-600 hover:bg-gray-500 text-white"
          }`}
          title="Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>

        <Button
          onClickHandler={() => setShowFiles(!showFiles)}
          additionalClasses={`p-2 sm:p-3 rounded-full ${
            showFiles 
              ? "bg-blue-600 hover:bg-blue-500 text-white" 
              : "bg-gray-600 hover:bg-gray-500 text-white"
          }`}
          title="Share Files"
        >
          <Upload className="w-5 h-5" />
        </Button>

        {userRole === "doctor" && (
          <Button
            onClickHandler={() => setShowNotes(!showNotes)}
            additionalClasses={`p-2 sm:p-3 rounded-full ${
              showNotes 
                ? "bg-blue-600 hover:bg-blue-500 text-white" 
                : "bg-gray-600 hover:bg-gray-500 text-white"
            }`}
            title="Notes"
          >
            <FileText className="w-5 h-5" />
          </Button>
        )}

        <Button
          onClickHandler={() => setShowActions(!showActions)}
          additionalClasses={`p-2 sm:p-3 rounded-full ${
            showActions 
              ? "bg-blue-600 hover:bg-blue-500 text-white" 
              : "bg-gray-600 hover:bg-gray-500 text-white"
          }`}
          title={userRole === 'doctor' ? 'Quick Actions' : 'Tools'}
        >
          <Zap className="w-5 h-5" />
        </Button>

        <Button
          onClickHandler={handleEndCall}
          additionalClasses="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full"
        >
          <Phone className="w-5 h-5 transform rotate-[135deg]" />
        </Button>
      </div>
    </div>
  );
};
