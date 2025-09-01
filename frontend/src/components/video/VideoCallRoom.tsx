"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSocketContext } from "@/contexts";
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
  Settings,
  Maximize2,
  Minimize2,
} from "lucide-react";

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
  // Video/Audio states
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // UI states
  const [showNotes, setShowNotes] = useState(userRole === "doctor");
  const [showChat, setShowChat] = useState(false);
  const [notes, setNotes] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  // Connection states
  const [isConnected, setIsConnected] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState<number | null>(null);
  
  // WebRTC refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  
  const { socket } = useSocketContext();

  // Initialize WebRTC
  const initializeWebRTC = useCallback(async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket && remoteUserId) {
          socket.emit("video:ice-candidate", {
            roomId,
            candidate: event.candidate,
            toUserId: remoteUserId,
          });
        }
      };

      // Join room
      if (socket) {
        socket.emit("video:join-room", { roomId, consultationId });
      }

    } catch (error) {
      console.error("Error initializing WebRTC:", error);
    }
  }, [roomId, consultationId, socket, remoteUserId]);

  // Create offer (for call initiator)
  const createOffer = useCallback(async () => {
    if (!peerConnectionRef.current || !socket || !remoteUserId) return;

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit("video:offer", { roomId, toUserId: remoteUserId, offer });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }, [roomId, socket, remoteUserId]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  // Screen sharing
  const toggleScreenShare = useCallback(async () => {
    if (!peerConnectionRef.current) return;

    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        screenStreamRef.current = screenStream;
        
        // Replace video track with screen share
        const videoSender = peerConnectionRef.current
          .getSenders()
          .find(sender => sender.track?.kind === "video");
          
        if (videoSender) {
          await videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
        }
        
        setIsScreenSharing(true);
        
        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      } else {
        stopScreenShare();
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  }, [isScreenSharing]);

  const stopScreenShare = useCallback(async () => {
    if (!peerConnectionRef.current || !localStreamRef.current) return;

    try {
      // Stop screen sharing stream
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }

      // Replace screen share with camera
      const videoSender = peerConnectionRef.current
        .getSenders()
        .find(sender => sender.track?.kind === "video");
        
      if (videoSender && localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          await videoSender.replaceTrack(videoTrack);
        }
      }
      
      setIsScreenSharing(false);
    } catch (error) {
      console.error("Error stopping screen share:", error);
    }
  }, []);

  // End call
  const handleEndCall = useCallback(() => {
    console.log("🔚 Ending call - cleaning up resources...");
    
    // Stop all streams safely
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        if (track.readyState !== 'ended') {
          track.stop();
          console.log(`🎥 Stopped ${track.kind} track`);
        }
      });
      localStreamRef.current = null;
    }
    
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => {
        if (track.readyState !== 'ended') {
          track.stop();
          console.log(`🖥️ Stopped screen share ${track.kind} track`);
        }
      });
      screenStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      console.log("🔗 Closed peer connection");
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Emit call end event
    if (socket) {
      socket.emit("video:end-call", { roomId, consultationId });
    }

    onCallEnd();
  }, [roomId, consultationId, socket, onCallEnd]);

  // Send chat message
  const sendMessage = useCallback(() => {
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
    socket.emit("video:chat-message", message);

    setNewMessage("");
  }, [newMessage, socket, roomId, consultationId, userRole]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // User joined room - set up peer connection if we're the second person
    socket.on("video:user-joined", (data) => {
      const { userId } = data;
      setRemoteUserId(userId);
      
      // If we're the doctor (initiator), create offer when patient joins
      if (userRole === "doctor" && peerConnectionRef.current) {
        createOffer();
      }
    });

    // WebRTC signaling - corrected event names
    socket.on("video:offer", async (data) => {
      const { offer, fromUserId } = data;
      setRemoteUserId(fromUserId);
      
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(offer);
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit("video:answer", { roomId, toUserId: fromUserId, answer });
      }
    });

    socket.on("video:answer", async (data) => {
      const { answer } = data;
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(answer);
        setIsConnected(true);
      }
    });

    socket.on("video:ice-candidate", async (data) => {
      const { candidate } = data;
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(candidate);
      }
    });

    // Chat messages
    socket.on("chat_message", (message) => {
      setChatMessages(prev => [...prev, { ...message, sent: false }]);
    });

    // Call ended by other party
    socket.on("video:call-ended", () => {
      console.log("📞 Call ended by other party");
      // Don't emit another end call event, just clean up locally
      
      // Stop all streams safely
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          if (track.readyState !== 'ended') {
            track.stop();
            console.log(`🎥 Stopped ${track.kind} track (remote end)`);
          }
        });
        localStreamRef.current = null;
      }
      
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => {
          if (track.readyState !== 'ended') {
            track.stop();
            console.log(`🖥️ Stopped screen share ${track.kind} track (remote end)`);
          }
        });
        screenStreamRef.current = null;
      }

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
        console.log("🔗 Closed peer connection (remote end)");
      }

      // Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      onCallEnd();
    });

    // User left room
    socket.on("video:user-left", (data) => {
      setRemoteUserId(null);
      setIsConnected(false);
    });

    return () => {
      socket.off("video:user-joined");
      socket.off("video:offer");
      socket.off("video:answer");
      socket.off("video:ice-candidate");
      socket.off("chat_message");
      socket.off("video:call-ended");
      socket.off("video:user-left");
    };
  }, [socket, roomId, userRole, createOffer, handleEndCall]);

  // Initialize on mount
  useEffect(() => {
    initializeWebRTC();
    
    return () => {
      // Cleanup on unmount
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [initializeWebRTC]);

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

  const showSidePanel = showNotes || showChat;

  return (
    <div className="flex h-full bg-gray-900">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover bg-gray-800"
        />
        
        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* Connection Status */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isConnected 
              ? "bg-green-600 text-white" 
              : "bg-yellow-600 text-white"
          }`}>
            {isConnected ? "Connected" : "Connecting..."}
          </div>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-4">
            <Button
              onClickHandler={toggleAudio}
              additionalClasses={`p-3 rounded-full ${
                isAudioEnabled 
                  ? "bg-gray-600 hover:bg-gray-500 text-white" 
                  : "bg-red-600 hover:bg-red-500 text-white"
              }`}
              text={isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            />
            
            <Button
              onClickHandler={toggleVideo}
              additionalClasses={`p-3 rounded-full ${
                isVideoEnabled 
                  ? "bg-gray-600 hover:bg-gray-500 text-white" 
                  : "bg-red-600 hover:bg-red-500 text-white"
              }`}
              text={isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            />

            {userRole === "doctor" && (
              <Button
                onClickHandler={toggleScreenShare}
                additionalClasses={`p-3 rounded-full ${
                  isScreenSharing 
                    ? "bg-blue-600 hover:bg-blue-500 text-white" 
                    : "bg-gray-600 hover:bg-gray-500 text-white"
                }`}
                text={isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
              />
            )}

            <Button
              onClickHandler={() => setShowChat(!showChat)}
              additionalClasses={`p-3 rounded-full ${
                showChat 
                  ? "bg-blue-600 hover:bg-blue-500 text-white" 
                  : "bg-gray-600 hover:bg-gray-500 text-white"
              }`}
              text={<MessageSquare className="w-5 h-5" />}
            />

            {userRole === "doctor" && (
              <Button
                onClickHandler={() => setShowNotes(!showNotes)}
                additionalClasses={`p-3 rounded-full ${
                  showNotes 
                    ? "bg-blue-600 hover:bg-blue-500 text-white" 
                    : "bg-gray-600 hover:bg-gray-500 text-white"
                }`}
                text={<FileText className="w-5 h-5" />}
              />
            )}

            <Button
              onClickHandler={handleEndCall}
              additionalClasses="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full"
              text={<Phone className="w-5 h-5 transform rotate-[135deg]" />}
            />
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {showSidePanel && (
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Panel Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {userRole === "doctor" && (
              <button
                onClick={() => {
                  setShowNotes(true);
                  setShowChat(false);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  showNotes && !showChat
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Notes
              </button>
            )}
            <button
              onClick={() => {
                setShowChat(true);
                setShowNotes(false);
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                showChat && !showNotes
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Chat
            </button>
          </div>

          {/* Notes Panel */}
          {showNotes && userRole === "doctor" && (
            <div className="flex-1 p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Consultation Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter consultation notes here..."
                className="w-full h-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Chat Panel */}
          {showChat && (
            <div className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          msg.sent
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button
                    onClickHandler={sendMessage}
                    isDisabled={!newMessage.trim()}
                    additionalClasses="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                    text="Send"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoCallRoom;
