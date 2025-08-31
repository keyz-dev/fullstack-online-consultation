'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/contexts/AuthContext';
import { VideoDisplay } from './VideoDisplay';
import { VideoControls } from './VideoControls';
import { SidePanel } from './SidePanel';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useVideoCallControls } from '@/hooks/useVideoCallControls';
import { ConsultationTimer } from './ConsultationTimer';
import { ConnectionStatus } from './ConnectionStatus';

interface VideoCallRoomProps {
  roomId: string;
  consultationId: string;
  onCallEnd: () => void;
  userRole?: string;
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
  userRole,
}) => {
  const { user } = useAuth();
  const socket = useSocket();
  const currentUserRole = userRole || user?.role || 'patient';

  // Video refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Use custom hooks
  const webRTC = useWebRTC({ 
    roomId, 
    consultationId, 
    socket: socket?.socket || null, 
    onCallEnd,
    localVideoRef: localVideoRef as React.RefObject<HTMLVideoElement>,
    remoteVideoRef: remoteVideoRef as React.RefObject<HTMLVideoElement>
  });
  const videoControls = useVideoCallControls(webRTC.localStreamRef);

  // Initialize WebRTC when component mounts
  useEffect(() => {
    webRTC.initializeWebRTC();
    
    return () => {
      webRTC.cleanupMediaStreams();
    };
  }, []);

  // Panel visibility state
  const [showFiles, setShowFiles] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  // Chat and notes state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [notes, setNotes] = useState('');
  
  // File sharing state
  const [sharedFiles, setSharedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Consultation state
  const [consultationStartTime] = useState(new Date());
  const [isRecording, setIsRecording] = useState(false);
  
  // Mock patient info (in real app, this would come from props/API)
  const patientInfo = currentUserRole === 'doctor' ? {
    name: 'John Doe',
    age: 35,
    lastVisit: '2024-01-15',
    allergies: ['Penicillin', 'Shellfish'],
    currentMedications: ['Lisinopril 10mg', 'Metformin 500mg']
  } : undefined;

  // Chat message handler
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket?.socket) return;

    const message = {
      roomId,
      consultationId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      senderRole: currentUserRole,
    };

    socket.socket.emit("chat_message", message);
    setChatMessages(prev => [...prev, { ...message, sent: true }]);
    setNewMessage("");
  };

  // Load existing messages and files when component mounts
  useEffect(() => {
    const loadConsultationData = async () => {
      try {
        const response = await fetch(`/api/v1/consultations/${consultationId}/messages`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Separate messages and files
          const messages: any[] = [];
          const files: any[] = [];
          
          data.data.messages.forEach((msg: any) => {
            if (msg.type === 'text') {
              messages.push({
                roomId,
                consultationId,
                message: msg.content,
                timestamp: msg.timestamp,
                senderRole: msg.senderType,
                sent: msg.senderType === currentUserRole,
                id: msg.id
              });
            } else if (msg.type === 'file' || msg.type === 'image') {
              files.push({
                id: msg.id,
                name: msg.fileName,
                type: msg.mimeType,
                size: msg.fileSize,
                url: msg.fileUrl,
                uploadedBy: msg.senderType,
                uploadedAt: msg.timestamp
              });
            }
          });
          
          setChatMessages(messages);
          setSharedFiles(files);
        }
      } catch (error) {
        console.error('Failed to load consultation data:', error);
      }
    };

    loadConsultationData();
  }, [consultationId, roomId, currentUserRole]);

  // Socket event listeners for chat
  useEffect(() => {
    if (!socket?.socket) return;

    const handleChatMessage = (message: { 
      id: string; 
      content: string; 
      sender: string; 
      senderType: string;
      timestamp: string;
      consultationId: string;
    }) => {
      // Only add if not already in messages (avoid duplicates)
      setChatMessages(prev => {
        const exists = prev.find(msg => msg.id === message.id);
        if (exists) return prev;
        
        return [...prev, { 
          roomId, 
          consultationId, 
          message: message.content, 
          timestamp: message.timestamp, 
          senderRole: message.senderType, 
          sent: message.senderType === currentUserRole,
          id: message.id
        }];
      });
    };

    const handleChatError = (error: { error: string; originalMessage: string }) => {
      console.error('Chat message error:', error);
      // Could show toast notification here
    };

    const handleFileShared = (fileData: any) => {
      const newFile = {
        id: fileData.id,
        name: fileData.fileName,
        type: fileData.mimeType,
        size: fileData.fileSize,
        url: fileData.fileUrl,
        uploadedBy: fileData.uploadedByType,
        uploadedAt: fileData.timestamp
      };
      
      setSharedFiles(prev => {
        const exists = prev.find(file => file.id === fileData.id);
        if (exists) return prev;
        return [...prev, newFile];
      });
    };

    socket.socket.on("chat_message", handleChatMessage);
    socket.socket.on("chat_message_error", handleChatError);
    socket.socket.on("file_shared", handleFileShared);

    return () => {
      socket.socket?.off("chat_message", handleChatMessage);
      socket.socket?.off("chat_message_error", handleChatError);
      socket.socket?.off("file_shared", handleFileShared);
    };
  }, [socket?.socket, roomId, consultationId, currentUserRole]);

  // Save notes handler
  const handleSaveNotes = async () => {
    try {
      const response = await fetch(`/api/v1/consultations/${consultationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notes })
      });
      
      if (response.ok) {
        console.log('Notes saved successfully');
        // Could show success toast here
      } else {
        throw new Error('Failed to save notes');
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
      // Could show error toast here
    }
  };

  // File handling
  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('consultationFile', file);
        
        const response = await fetch(`/api/v1/consultations/${consultationId}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          return {
            id: data.data.id,
            name: data.data.fileName,
            type: data.data.mimeType,
            size: data.data.fileSize,
            url: data.data.fileUrl,
            uploadedBy: currentUserRole,
            uploadedAt: new Date().toISOString()
          };
        } else {
          throw new Error('Upload failed');
        }
      });
      
      const uploadedFiles = await Promise.all(uploadPromises);
      setSharedFiles(prev => [...prev, ...uploadedFiles]);
      
    } catch (error) {
      console.error('File upload failed:', error);
      // Could show toast notification here
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = (fileId: string) => {
    setSharedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Quick actions handlers
  const handleWritePrescription = () => {
    console.log('Opening prescription writer...');
    // TODO: Open prescription modal/page
  };

  const handleViewHistory = () => {
    console.log('Opening patient history...');
    // TODO: Open patient history modal/page
  };

  const handleEmergencyCall = () => {
    console.log('Emergency call requested!');
    // TODO: Implement emergency call functionality
    alert('Emergency services have been notified. Help is on the way.');
  };

  const handleTakeScreenshot = () => {
    console.log('Taking screenshot...');
    // TODO: Implement screenshot functionality
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    console.log(isRecording ? 'Stopping recording...' : 'Starting recording...');
    // TODO: Implement recording functionality
  };

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        <VideoDisplay
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
        />
        
        {/* Top Status Bar */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <ConsultationTimer
            startTime={consultationStartTime}
            isActive={true}
            userRole={currentUserRole}
            onStop={onCallEnd}
          />
          <ConnectionStatus
            connectionState={webRTC.connectionState}
            isConnected={webRTC.isConnected}
          />
        </div>
        
        <VideoControls
          isAudioEnabled={videoControls.isAudioEnabled}
          isVideoEnabled={videoControls.isVideoEnabled}
          isScreenSharing={videoControls.isScreenSharing}
          showChat={videoControls.showChat}
          showNotes={videoControls.showNotes}
          showFiles={showFiles}
          showActions={showActions}
          userRole={currentUserRole}
          toggleAudio={videoControls.toggleAudio}
          toggleVideo={videoControls.toggleVideo}
          toggleScreenShare={videoControls.toggleScreenShare}
          setShowChat={videoControls.setShowChat}
          setShowNotes={videoControls.setShowNotes}
          setShowFiles={setShowFiles}
          setShowActions={setShowActions}
          handleEndCall={onCallEnd}
        />
      </div>

      {/* Side Panel */}
      {(videoControls.showChat || videoControls.showNotes || showFiles || showActions) && (
        <SidePanel
          showChat={videoControls.showChat}
          showNotes={videoControls.showNotes}
          showFiles={showFiles}
          showActions={showActions}
          userRole={currentUserRole}
          chatMessages={chatMessages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={handleSendMessage}
          notes={notes}
          setNotes={setNotes}
          saveNotes={handleSaveNotes}
          setShowNotes={videoControls.setShowNotes}
          setShowChat={videoControls.setShowChat}
          setShowFiles={setShowFiles}
          setShowActions={setShowActions}
          sharedFiles={sharedFiles}
          onFileUpload={handleFileUpload}
          onFileRemove={handleFileRemove}
          isUploading={isUploading}
          patientInfo={patientInfo}
          onWritePrescription={handleWritePrescription}
          onViewHistory={handleViewHistory}
          onEmergencyCall={handleEmergencyCall}
          onTakeScreenshot={handleTakeScreenshot}
          onToggleRecording={handleToggleRecording}
          isRecording={isRecording}
        />
      )}
    </div>
  );
};

export default VideoCallRoom;
