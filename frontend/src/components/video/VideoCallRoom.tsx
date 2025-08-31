"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useSocketContext } from "@/contexts";
import { Button } from "@/components/ui";
import { Video, Maximize2, Minimize2 } from "lucide-react";
import {
  VideoControls,
  VideoDisplay,
  VideoSidePanel,
} from "@/components/video";
import { FadeInContainer } from "@/components/ui";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useVideoChat } from "@/hooks/useVideoChat";

interface VideoCallRoomProps {
  roomId: string;
  consultationId: string;
  userRole: "doctor" | "patient";
  onCallEnd: () => void;
}

const VideoCallRoom: React.FC<VideoCallRoomProps> = ({
  roomId,
  consultationId,
  userRole,
  onCallEnd,
}) => {
  // UI states
  const [showNotes, setShowNotes] = useState(userRole === "doctor");
  const [showChat, setShowChat] = useState(false);
  const [notes, setNotes] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Custom hooks for WebRTC and chat
  const {
    localVideoRef,
    remoteVideoRef,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    handleEndCall,
  } = useWebRTC({ roomId, consultationId, userRole, onCallEnd });

  const {
    chatMessages,
    setChatMessages,
    newMessage,
    setNewMessage,
    sendMessage,
  } = useVideoChat({ roomId, consultationId, userRole });

  const { socket } = useSocketContext();

  // Socket event listeners for chat
  useEffect(() => {
    if (!socket) return;

    // Chat messages
    socket.on("video:chat-message", (message: any) => {
      setChatMessages(prev => [...prev, { ...message, sent: false }]);
    });

    return () => {
      socket.off("video:chat-message");
    };
  }, [socket, setChatMessages]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <FadeInContainer>
      <div className="h-screen bg-gray-900 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Video className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">
            Video Consultation - Room {roomId.slice(-6)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClickHandler={toggleFullscreen}
            additionalClasses="bg-gray-700 hover:bg-gray-600 text-white p-2"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            onClickHandler={handleEndCall}
            additionalClasses="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
            text="End Call"
          />
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <VideoDisplay
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
        >
          {/* Controls Overlay */}
          <VideoControls
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            isScreenSharing={isScreenSharing}
            showChat={showChat}
            showNotes={showNotes}
            userRole={userRole}
            onToggleVideo={toggleVideo}
            onToggleAudio={toggleAudio}
            onToggleScreenShare={toggleScreenShare}
            onToggleChat={() => setShowChat(!showChat)}
            onToggleNotes={() => setShowNotes(!showNotes)}
            onEndCall={handleEndCall}
          />
        </VideoDisplay>

        {/* Side Panel */}
        <VideoSidePanel
          isVisible={showNotes || showChat}
          showNotes={showNotes}
          showChat={showChat}
          userRole={userRole}
          notes={notes}
          chatMessages={chatMessages}
          newMessage={newMessage}
          onNotesChange={setNotes}
          onMessageChange={setNewMessage}
          onSendMessage={sendMessage}
          onToggleNotes={() => { setShowNotes(true); setShowChat(false); }}
          onToggleChat={() => { setShowChat(true); setShowNotes(false); }}
        />
      </div>
      </div>
    </FadeInContainer>
  );
};

export default VideoCallRoom;