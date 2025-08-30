'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/contexts/AuthContext';
import { VideoDisplay } from './VideoDisplay';
import { VideoControls } from './VideoControls';
import { SidePanel } from './SidePanel';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useVideoCallControls } from '@/hooks/useVideoCallControls';

interface VideoCallRoomProps {
  roomId: string;
  consultationId: string;
  onCallEnd: () => void;
}

interface ChatMessage {
  roomId: string;
  consultationId: string;
  message: string;
  timestamp: string;
  senderRole: string;
  sent: boolean;
}

const VideoCallRoom: React.FC<VideoCallRoomProps> = ({
  roomId,
  consultationId,
  onCallEnd,
}) => {
  const { user } = useAuth();
  const socket = useSocket();
  const userRole = user?.role || 'patient';

  // Video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Use custom hooks
  const videoControls = useVideoCallControls();
  const webRTC = useWebRTC({ 
    roomId, 
    consultationId, 
    socket: socket?.socket || null, 
    onCallEnd
  });

  // Chat and notes state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [notes, setNotes] = useState('');

  // Chat message handler
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket?.socket) return;

    const message = {
      roomId,
      consultationId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      senderRole: userRole,
    };

    socket.socket.emit("chat_message", message);
    setChatMessages(prev => [...prev, { ...message, sent: true }]);
    setNewMessage("");
  };

  // Socket event listeners for chat
  useEffect(() => {
    if (!socket?.socket) return;

    const handleChatMessage = (message: { 
      id: string; 
      content: string; 
      sender: string; 
      timestamp: string 
    }) => {
      setChatMessages(prev => [...prev, { 
        roomId, 
        consultationId, 
        message: message.content, 
        timestamp: message.timestamp, 
        senderRole: message.sender, 
        sent: false 
      }]);
    };

    socket.socket.on("chat_message", handleChatMessage);

    return () => {
      socket.socket?.off("chat_message", handleChatMessage);
    };
  }, [socket?.socket, roomId, consultationId]);

  // Save notes handler
  const handleSaveNotes = () => {
    console.log('Saving notes:', notes);
    // TODO: Implement notes saving to backend
  };

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        <VideoDisplay
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
        />
        
        <VideoControls
          isAudioEnabled={videoControls.isAudioEnabled}
          isVideoEnabled={videoControls.isVideoEnabled}
          isScreenSharing={videoControls.isScreenSharing}
          showChat={videoControls.showChat}
          showNotes={videoControls.showNotes}
          userRole={userRole}
          toggleAudio={videoControls.toggleAudio}
          toggleVideo={videoControls.toggleVideo}
          toggleScreenShare={videoControls.toggleScreenShare}
          setShowChat={videoControls.setShowChat}
          setShowNotes={videoControls.setShowNotes}
          handleEndCall={onCallEnd}
        />
      </div>

      {/* Side Panel */}
      {(videoControls.showChat || videoControls.showNotes) && (
        <SidePanel
          showChat={videoControls.showChat}
          showNotes={videoControls.showNotes}
          userRole={userRole}
          chatMessages={chatMessages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={handleSendMessage}
          notes={notes}
          setNotes={setNotes}
          saveNotes={handleSaveNotes}
          setShowNotes={videoControls.setShowNotes}
          setShowChat={videoControls.setShowChat}
        />
      )}
    </div>
  );
};

export default VideoCallRoom;
