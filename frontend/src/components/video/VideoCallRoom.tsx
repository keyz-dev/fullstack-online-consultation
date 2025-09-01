"use client";

import React, { useState, useEffect } from "react";
import { useSocketContext } from "@/contexts";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useVideoSocket } from "@/hooks/useVideoSocket";
import VideoDisplay from "./VideoDisplay";
import VideoControls from "./VideoControls";
import SimpleSidePanel from "./SimpleSidePanel";

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
  const [chatMessages, setChatMessages] = useState<Array<{
    roomId: string;
    consultationId: string;
    message: string;
    timestamp: string;
    senderRole: string;
    sent: boolean;
  }>>([]);
  const [newMessage, setNewMessage] = useState("");
  
  const { socket } = useSocketContext();

  // Use WebRTC hook
  const {
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    isConnected,
    remoteUserId,
    localVideoRef,
    remoteVideoRef,
    peerConnectionRef,
    initializeWebRTC,
    createOffer,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    handleEndCall,
    cleanup,
    setRemoteUserId,
    setIsConnected,
  } = useWebRTC({ roomId, consultationId, userRole, onCallEnd });

  // Debug socket state
  useEffect(() => {
    console.log("🔍 Socket state in VideoCallRoom:", {
      hasSocket: !!socket,
      socketConnected: socket?.connected,
      socketId: socket?.id,
      roomId,
      userRole
    });
  }, [socket, roomId, userRole]);

  // Use socket hook - but only after WebRTC is initialized
  const { sendMessage: sendSocketMessage } = useVideoSocket({
    roomId,
    userRole,
    peerConnectionRef,
    setRemoteUserId,
    setIsConnected,
    createOffer,
    onCallEnd,
  });

  // Send chat message
  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const message = {
      roomId,
      consultationId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      senderRole: userRole,
      sent: true,
    };

    setChatMessages(prev => [...prev, message]);
    sendSocketMessage(message);
    setNewMessage("");
  };

  // Socket event listeners for chat
  useEffect(() => {
    if (!socket) return;

    // Chat messages - use the correct event name
    socket.on("video:chat-message", (message: {
      roomId: string;
      consultationId: string;
      message: string;
      timestamp: string;
      senderRole: string;
    }) => {
      console.log("💬 Chat message received:", message);
      setChatMessages(prev => [...prev, { ...message, sent: false }]);
    });

    return () => {
      socket.off("video:chat-message");
    };
  }, [socket]);

  // Initialize on mount - run only when essential params change
  useEffect(() => {
    console.log("🚀 VideoCallRoom initializing for:", { roomId, consultationId, userRole });
    
    let isActive = true;
    
    const initialize = async () => {
      if (isActive) {
        await initializeWebRTC();
      }
    };
    
    initialize();
    
    return () => {
      console.log("🧹 VideoCallRoom unmounting, cleaning up");
      isActive = false;
      cleanup();
    };
  }, [roomId, consultationId, userRole, initializeWebRTC, cleanup]); // Include stable functions

  // Debug remote user state
  useEffect(() => {
    console.log("👤 Remote user state:", { remoteUserId, isConnected });
  }, [remoteUserId, isConnected]);

  // Note: Fullscreen functionality removed to clean up unused code

  return (
    <div className="flex h-full bg-gray-900">
      {/* Main Video Area */}
      <VideoDisplay
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        isConnected={isConnected}
      >
        {/* Video Controls */}
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
      <SimpleSidePanel
        showNotes={showNotes}
        showChat={showChat}
        userRole={userRole}
        chatMessages={chatMessages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        notes={notes}
        setNotes={setNotes}
        setShowNotes={setShowNotes}
        setShowChat={setShowChat}
      />
    </div>
  );
};

export default VideoCallRoom;
