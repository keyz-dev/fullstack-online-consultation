import { useState, useRef, useCallback, useEffect } from "react";
import { useSocketContext } from "@/contexts";

interface UseWebRTCProps {
  roomId: string;
  consultationId: string;
  userRole: "doctor" | "patient";
  onCallEnd: () => void;
}

export const useWebRTC = ({ roomId, consultationId, userRole, onCallEnd }: UseWebRTCProps) => {
  // Video/Audio states
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState<number | null>(null);
  
  // Debug remoteUserId changes
  useEffect(() => {
    console.log("🆔 Remote user ID changed:", remoteUserId);
  }, [remoteUserId]);

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
      // Prevent multiple initializations
      if (peerConnectionRef.current) {
        console.log("⚠️ WebRTC already initialized, skipping...");
        return;
      }

      console.log("🔍 Initializing WebRTC with dependencies:", { 
        roomId, 
        consultationId, 
        hasSocket: !!socket,
        socketConnected: socket?.connected 
      });

      console.log("🎥 Initializing WebRTC...");
      
      // Use MediaStreamManager for proper device management
      const { mediaStreamManager } = await import('../utils/mediaStreamManager');
      const stream = await mediaStreamManager.getMediaStream(roomId);
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      console.log("🎥 Local stream obtained and set");

      // Create peer connection with better ICE servers
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
        ],
        iceCandidatePoolSize: 10,
      });

      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      console.log("🎥 Local tracks added to peer connection");

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log("🎥 Remote stream received:", event.streams[0]);
        console.log("🎥 Remote stream tracks:", event.streams[0]?.getTracks().map(t => `${t.kind}: ${t.label}`));
        
        if (remoteVideoRef.current && event.streams[0]) {
          const stream = event.streams[0];
          remoteVideoRef.current.srcObject = stream;
          console.log("🎥 Remote video element updated with stream");
          
          // Ensure all tracks are enabled
          stream.getTracks().forEach(track => {
            if (!track.enabled) {
              track.enabled = true;
              console.log(`✅ Enabled ${track.kind} track`);
            }
          });
          
          // Force video to play with better error handling
          setTimeout(async () => {
            if (remoteVideoRef.current) {
              try {
                await remoteVideoRef.current.play();
                console.log("✅ Remote video playing successfully");
              } catch (error) {
                console.error("❌ Remote video play error:", error);
                // Try again with user gesture if needed
                if (error instanceof Error && error.name === 'NotAllowedError') {
                  console.log("🔄 Retrying video play on user interaction");
                  const playOnClick = () => {
                    remoteVideoRef.current?.play().then(() => {
                      console.log("✅ Remote video started after user interaction");
                      document.removeEventListener('click', playOnClick);
                    });
                  };
                  document.addEventListener('click', playOnClick);
                }
              }
            }
          }, 100);
        } else {
          console.error("❌ Cannot set remote stream:", {
            hasVideoRef: !!remoteVideoRef.current,
            hasStream: !!event.streams[0]
          });
        }
      };

      // Store ICE candidates until we have remote user ID
      const pendingIceCandidates: RTCIceCandidate[] = [];

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          console.log("🧊 ICE candidate generated:", event.candidate.candidate);
          
          if (remoteUserId) {
            socket.emit("video:ice-candidate", {
              roomId,
              candidate: event.candidate,
              toUserId: remoteUserId,
            });
            console.log("🧊 ICE candidate sent to:", remoteUserId);
          } else {
            // Store candidates until we have remote user ID
            pendingIceCandidates.push(event.candidate);
            console.log("🧊 ICE candidate stored (no remote user yet)");
          }
        }
      };

      // Send pending ICE candidates when remote user is set
      const sendPendingCandidates = () => {
        if (remoteUserId && socket && pendingIceCandidates.length > 0) {
          console.log(`🧊 Sending ${pendingIceCandidates.length} pending ICE candidates`);
          pendingIceCandidates.forEach(candidate => {
            socket.emit("video:ice-candidate", {
              roomId,
              candidate,
              toUserId: remoteUserId,
            });
          });
          pendingIceCandidates.length = 0; // Clear the array
        }
      };

      // Store the function to send pending candidates
      (peerConnection as RTCPeerConnection & { sendPendingCandidates?: () => void }).sendPendingCandidates = sendPendingCandidates;

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log("🔗 Connection state:", peerConnection.connectionState);
        console.log("🔗 ICE connection state:", peerConnection.iceConnectionState);
        console.log("🔗 ICE gathering state:", peerConnection.iceGatheringState);
        
        if (peerConnection.connectionState === 'connected') {
          console.log("✅ WebRTC connection established!");
          setIsConnected(true);
        } else if (peerConnection.connectionState === 'disconnected' || 
                   peerConnection.connectionState === 'failed' ||
                   peerConnection.connectionState === 'closed') {
          console.log("❌ WebRTC connection lost or failed");
          setIsConnected(false);
        }
      };

      // Also monitor ICE connection state for better feedback
      peerConnection.oniceconnectionstatechange = () => {
        console.log("🧊 ICE connection state changed:", peerConnection.iceConnectionState);
        
        if (peerConnection.iceConnectionState === 'connected' || 
            peerConnection.iceConnectionState === 'completed') {
          console.log("✅ ICE connection successful!");
          setIsConnected(true);
        } else if (peerConnection.iceConnectionState === 'failed' ||
                   peerConnection.iceConnectionState === 'disconnected' ||
                   peerConnection.iceConnectionState === 'closed') {
          console.log("❌ ICE connection failed or lost");
          setIsConnected(false);
        }
      };

      // Monitor ICE gathering state
      peerConnection.onicegatheringstatechange = () => {
        console.log("🧊 ICE gathering state:", peerConnection.iceGatheringState);
      };

      // Join room
      if (socket) {
        console.log("🔍 Socket state before joining room:", {
          connected: socket.connected,
          id: socket.id,
          hasListeners: socket.listeners('video:user-joined').length
        });
        socket.emit("video:join-room", { roomId, consultationId });
        console.log("🏠 Joined room:", roomId);
      } else {
        console.error("❌ No socket available to join room!");
      }

    } catch (error) {
      console.error("❌ Error initializing WebRTC:", error);
    }
  }, [roomId, consultationId, socket]); // Remove remoteUserId to prevent re-initialization

  // Create offer (for call initiator)
  const createOffer = useCallback(async () => {
    if (!peerConnectionRef.current || !socket || !remoteUserId) {
      console.log("❌ Cannot create offer - missing:", {
        peerConnection: !!peerConnectionRef.current,
        socket: !!socket,
        remoteUserId: !!remoteUserId
      });
      return;
    }

    try {
      console.log("🤝 Creating offer for remote user:", remoteUserId);
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      socket.emit("video:offer", { roomId, toUserId: remoteUserId, offer });
      console.log("📤 Offer sent to remote user:", remoteUserId);

      // Send any pending ICE candidates now that we have a remote user
      const pc = peerConnectionRef.current as RTCPeerConnection & { sendPendingCandidates?: () => void };
      if (pc.sendPendingCandidates) {
        pc.sendPendingCandidates();
      }
    } catch (error) {
      console.error("❌ Error creating offer:", error);
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
        console.log("🖥️ Requesting screen share permission...");
        
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        console.log("🖥️ Screen share permission granted");
        screenStreamRef.current = screenStream;
        
        // Replace video track with screen share
        const videoSender = peerConnectionRef.current
          .getSenders()
          .find(sender => sender.track?.kind === "video");
          
        if (videoSender) {
          await videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
          console.log("🖥️ Video track replaced with screen share");
        }
        
        setIsScreenSharing(true);
        
        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          console.log("🖥️ Screen share ended by user");
          stopScreenShare();
        };
      } else {
        stopScreenShare();
      }
    } catch (error) {
      console.error("❌ Error toggling screen share:", error);
      
      // Handle specific permission errors
      const err = error as Error;
      if (err.name === 'NotAllowedError') {
        console.log("🚫 Screen share permission denied by user");
        // Don't show error to user - this is expected when they cancel
      } else if (err.name === 'NotSupportedError') {
        console.error("❌ Screen sharing not supported in this browser");
        alert("Screen sharing is not supported in this browser");
      } else if (err.name === 'NotFoundError') {
        console.error("❌ No screen sharing source found");
        alert("No screen available for sharing");
      } else {
        console.error("❌ Unexpected screen sharing error:", error);
        alert("Failed to start screen sharing. Please try again.");
      }
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
  const handleEndCall = useCallback(async () => {
    console.log("🔚 Ending call - cleaning up resources...");
    
    // Use MediaStreamManager for proper cleanup
    try {
      const { mediaStreamManager } = await import('../utils/mediaStreamManager');
      mediaStreamManager.releaseMediaStream(roomId);
    } catch (error) {
      console.error("Error releasing media stream:", error);
    }
    
    // Stop screen sharing stream
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

    // Clear refs
    localStreamRef.current = null;

    // Emit call end event
    if (socket) {
      socket.emit("video:end-call", { roomId, consultationId });
    }

    onCallEnd();
  }, [roomId, consultationId, socket, onCallEnd]);

  // Cleanup function
  const cleanup = useCallback(async () => {
    console.log("🧹 Cleaning up WebRTC resources...");
    
    // Use MediaStreamManager for proper cleanup
    try {
      const { mediaStreamManager } = await import('../utils/mediaStreamManager');
      mediaStreamManager.releaseMediaStream(roomId);
    } catch (error) {
      console.error("Error releasing media stream:", error);
    }
    
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    localStreamRef.current = null;
  }, [roomId]);

  return {
    // States
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    isConnected,
    remoteUserId,
    
    // Refs
    localVideoRef,
    remoteVideoRef,
    peerConnectionRef,
    
    // Functions
    initializeWebRTC,
    createOffer,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    handleEndCall,
    cleanup,
    
    // Setters for socket events
    setRemoteUserId,
    setIsConnected,
  };
};