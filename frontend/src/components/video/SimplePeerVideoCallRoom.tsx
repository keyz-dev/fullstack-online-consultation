"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useSimplePeerWebRTC } from "@/hooks/useSimplePeerWebRTC";
import { consultationsAPI } from "@/api/consultations";
import VideoDisplay from "./VideoDisplay";
import VideoControls from "./VideoControls";
import SimpleSidePanel from "./SimpleSidePanel";
import { Button } from "@/components/ui";
import { Phone, PhoneOff } from "lucide-react";

interface SimplePeerVideoCallRoomProps {
  roomId: string;
  consultationId: string;
  userRole: "doctor" | "patient";
  onCallEnd: () => void;
}

const SimplePeerVideoCallRoom: React.FC<SimplePeerVideoCallRoomProps> = ({
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

  // Handle incoming chat messages
  const handleChatMessage = useCallback((data: {
    roomId: string;
    consultationId: string;
    message: string;
    timestamp: string;
    senderRole: string;
    fromUserId: number;
    fromName: string;
    sent: boolean;
  }) => {
    console.log('💬 Received chat message:', data);
    setChatMessages(prev => [...prev, data]);
  }, []);

  // Use Simple Peer WebRTC hook
  const {
    stream,
    call,
    callAccepted,
    callEnded,
    isConnected,
    remoteUserId,
    isVideoEnabled,
    isAudioEnabled,
    localVideoRef,
    remoteVideoRef,
    callUser,
    answerCall,
    leaveCall,
    toggleVideo,
    toggleAudio,
    sendChatMessage
  } = useSimplePeerWebRTC({
    roomId,
    consultationId,
    userRole,
    onCallEnd,
    onChatMessage: handleChatMessage
  });

  // Load existing consultation notes when call starts
  useEffect(() => {
    if (callAccepted && userRole === 'doctor' && !notes) {
      const loadExistingNotes = async () => {
        try {
          const consultation = await consultationsAPI.getConsultation(consultationId);
          if (consultation.data.consultations[0]?.notes) {
            setNotes(consultation.data.consultations[0].notes);
            console.log('📝 Loaded existing consultation notes');
          }
        } catch (error) {
          console.error('❌ Failed to load existing notes:', error);
        }
      };
      loadExistingNotes();
    }
  }, [callAccepted, userRole, consultationId, notes]);

  // Session tracking
  useEffect(() => {
    let heartbeatInterval: NodeJS.Timeout;

    const startSessionTracking = async () => {
      try {
        // Join consultation session when call is accepted
        if (callAccepted && !callEnded) {
          console.log('🔗 Joining consultation session for tracking');
          await consultationsAPI.joinConsultationSession(consultationId);
          
          // Start heartbeat to keep session alive
          heartbeatInterval = setInterval(async () => {
            try {
              await consultationsAPI.updateHeartbeat(consultationId);
              console.log('💓 Session heartbeat updated');
            } catch (error) {
              console.error('❌ Heartbeat failed:', error);
            }
          }, 30000); // Every 30 seconds
        }
      } catch (error) {
        console.error('❌ Failed to join consultation session:', error);
      }
    };

    startSessionTracking();

    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, [callAccepted, callEnded, consultationId]);

  // Leave session when call ends
  useEffect(() => {
    if (callEnded) {
      const leaveSession = async () => {
        try {
          console.log('🚪 Leaving consultation session');
          await consultationsAPI.leaveConsultationSession(consultationId);
        } catch (error) {
          console.error('❌ Failed to leave consultation session:', error);
        }
      };
      leaveSession();
    }
  }, [callEnded, consultationId]);

  console.log('🔍 Simple Peer Video Call Room State:', {
    hasStream: !!stream,
    calling: call.calling,
    callAccepted,
    callEnded,
    isConnected,
    remoteUserId,
    userRole
  });

  // Send chat message
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      roomId,
      consultationId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      senderRole: userRole,
      sent: true,
    };

    // Add to local chat first
    setChatMessages(prev => [...prev, message]);
    
    // Send via socket
    sendChatMessage(newMessage);
    
    setNewMessage("");
  };

  // Save consultation notes (for doctors)
  const saveNotes = useCallback(async () => {
    if (userRole !== 'doctor' || !notes.trim()) return;

    try {
      console.log('💾 Saving consultation notes...');
      await consultationsAPI.updateConsultationNotes(consultationId, notes);
      console.log('✅ Notes saved successfully');
      // Don't show toast here to avoid spam, just log success
    } catch (error) {
      console.error('❌ Failed to save notes:', error);
    }
  }, [consultationId, notes, userRole]);

  // Auto-save notes every 30 seconds when typing
  useEffect(() => {
    if (userRole !== 'doctor' || !notes.trim()) return;

    const autoSaveTimeout = setTimeout(() => {
      saveNotes();
    }, 30000); // Auto-save after 30 seconds of no typing

    return () => clearTimeout(autoSaveTimeout);
  }, [notes, saveNotes, userRole]);

  // Save notes when call ends
  useEffect(() => {
    if (callEnded && userRole === 'doctor' && notes.trim()) {
      saveNotes();
    }
  }, [callEnded, saveNotes, notes, userRole]);

  // Handle call actions
  const handleAnswer = () => {
    console.log('📞 Patient answering call');
    answerCall();
  };

  const handleDecline = () => {
    console.log('📞 Declining call');
    leaveCall();
  };

  const handleEndCall = () => {
    console.log('📞 Ending call');
    leaveCall();
  };

  return (
    <div className="flex h-full bg-gray-900">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Show incoming call notification for patient */}
        {call.calling && !callAccepted && userRole === "patient" && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">
                Incoming call from {call.name || 'Doctor'}
              </h3>
              <div className="flex space-x-4">
                <Button
                  onClickHandler={handleAnswer}
                  additionalClasses="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Answer</span>
                </Button>
                <Button
                  onClickHandler={handleDecline}
                  additionalClasses="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Decline</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Show connecting state */}
        {call.calling && !callAccepted && userRole === "doctor" && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">
                Calling {call.name || 'Patient'}...
              </h3>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        )}

        {/* Video Display */}
        <VideoDisplay
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          isConnected={isConnected}
        >
          {/* Video Controls - only show when call is active */}
          {(callAccepted || (stream && !call.calling)) && (
            <VideoControls
              isVideoEnabled={isVideoEnabled}
              isAudioEnabled={isAudioEnabled}
              isScreenSharing={false} // Simple Peer doesn't handle screen sharing in basic setup
              showChat={showChat}
              showNotes={showNotes}
              userRole={userRole}
              onToggleVideo={toggleVideo}
              onToggleAudio={toggleAudio}
              onToggleScreenShare={() => {}} // Disabled for Simple Peer
              onToggleChat={() => setShowChat(!showChat)}
              onToggleNotes={() => setShowNotes(!showNotes)}
              onEndCall={handleEndCall}
            />
          )}
        </VideoDisplay>
      </div>

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
        onSaveNotes={userRole === 'doctor' ? saveNotes : undefined}
      />
    </div>
  );
};

export default SimplePeerVideoCallRoom;
