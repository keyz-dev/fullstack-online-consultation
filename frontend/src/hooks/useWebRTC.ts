import { useRef, useCallback, useEffect, useState } from "react";
import { useSocketContext } from "@/contexts";

interface UseWebRTCProps {
  roomId: string;
  consultationId: string;
  userRole: "doctor" | "patient";
  onCallEnd: () => void;
}

export const useWebRTC = ({ roomId, consultationId, userRole, onCallEnd }: UseWebRTCProps) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);

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
  const createOffer = useCallback(async (targetUserId: string) => {
    if (!peerConnectionRef.current || !socket) return;

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit("video:offer", { 
        roomId, 
        offer, 
        toUserId: targetUserId 
      });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }, [roomId, socket]);

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
    console.log("🔚 useWebRTC: Ending call - cleaning up resources...");
    
    // Stop all streams safely
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        if (track.readyState !== 'ended') {
          track.stop();
          console.log(`🎥 useWebRTC: Stopped ${track.kind} track`);
        }
      });
      localStreamRef.current = null;
    }
    
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => {
        if (track.readyState !== 'ended') {
          track.stop();
          console.log(`🖥️ useWebRTC: Stopped screen share ${track.kind} track`);
        }
      });
      screenStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      console.log("🔗 useWebRTC: Closed peer connection");
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Emit call end event (only if not already ending)
    if (socket) {
      socket.emit("video:end-call", { roomId });
    }

    onCallEnd();
  }, [roomId, socket, onCallEnd]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Track remote user and handle user joined
    socket.on("video:user-joined", (data: any) => {
      console.log("User joined:", data);
      if (data.userId !== socket.id) {
        setRemoteUserId(data.userId);
        // If this is the second person to join, create an offer
        if (userRole === "doctor") {
          setTimeout(() => createOffer(data.userId), 1000);
        }
      }
    });

    // WebRTC signaling
    socket.on("video:offer", async (data: any) => {
      if (peerConnectionRef.current) {
        setRemoteUserId(data.fromUserId);
        await peerConnectionRef.current.setRemoteDescription(data.offer);
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit("video:answer", { 
          roomId, 
          answer, 
          toUserId: data.fromUserId 
        });
      }
    });

    socket.on("video:answer", async (data: any) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(data.answer);
      }
    });

    socket.on("video:ice-candidate", async (data: any) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(data.candidate);
      }
    });

    // Call ended by other party - don't call handleEndCall to avoid loop
    socket.on("video:call-ended", () => {
      console.log("📞 useWebRTC: Call ended by other party");
      
      // Stop all streams safely
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          if (track.readyState !== 'ended') {
            track.stop();
            console.log(`🎥 useWebRTC: Stopped ${track.kind} track (remote end)`);
          }
        });
        localStreamRef.current = null;
      }
      
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => {
          if (track.readyState !== 'ended') {
            track.stop();
            console.log(`🖥️ useWebRTC: Stopped screen share ${track.kind} track (remote end)`);
          }
        });
        screenStreamRef.current = null;
      }

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
        console.log("🔗 useWebRTC: Closed peer connection (remote end)");
      }

      // Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      // Just call onCallEnd without emitting another socket event
      onCallEnd();
    });

    return () => {
      socket.off("video:user-joined");
      socket.off("video:offer");
      socket.off("video:answer");
      socket.off("video:ice-candidate");
      socket.off("video:call-ended");
    };
  }, [socket, roomId, onCallEnd, createOffer, userRole]);

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

  return {
    localVideoRef,
    remoteVideoRef,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    handleEndCall,
  };
};