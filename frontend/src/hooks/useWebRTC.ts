import { useCallback, useRef, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { mediaStreamManager } from "../utils/mediaStreamManager";

interface UseWebRTCProps {
  roomId: string;
  consultationId: string;
  socket: Socket | null;
  onCallEnd: () => void;
  localVideoRef?: React.RefObject<HTMLVideoElement>;
  remoteVideoRef?: React.RefObject<HTMLVideoElement>;
}

export const useWebRTC = ({
  roomId,
  consultationId,
  socket,
  onCallEnd,
  localVideoRef,
  remoteVideoRef,
}: UseWebRTCProps) => {
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const cleanupExecutedRef = useRef(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');

  // Cleanup media streams
  const cleanupMediaStreams = useCallback(() => {
    if (cleanupExecutedRef.current) {
      console.log("🧹 Cleanup already executed, skipping");
      return;
    }

    cleanupExecutedRef.current = true;
    console.log("🧹 Starting media cleanup...");

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      console.log("🔌 Peer connection closed");
    }

    // Release media stream through manager
    mediaStreamManager.releaseMediaStream(roomId);

    // Clear local stream ref
    localStreamRef.current = null;

    console.log("🧹 Media cleanup completed");
  }, [roomId]);

  // Initialize WebRTC with device conflict handling
  const initializeWebRTC = useCallback(async () => {
    try {
      console.log("🎥 Initializing WebRTC...");

      // Reset cleanup flag
      cleanupExecutedRef.current = false;

      // Force cleanup any existing streams first
      mediaStreamManager.forceReleaseAll();

      // Small delay to ensure any previous cleanup is complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get user media through global manager to prevent conflicts
      const stream = await mediaStreamManager.getMediaStream(roomId);

      console.log(
        "🎥 Got user media stream:",
        stream.getTracks().map((t) => `${t.kind}: ${t.label}`)
      );

      localStreamRef.current = stream;

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
        console.log("🎥 Received remote stream:", event.streams[0]);
        const remoteStream = event.streams[0];
        remoteStreamRef.current = remoteStream;
        
        // Attach to video element
        if (remoteVideoRef?.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          // Ensure remote video plays
          remoteVideoRef.current.play().catch(e => console.log("Remote video autoplay failed:", e));
        }
        setIsConnected(true);
        setConnectionState('connected');
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;
        console.log("🔗 Connection state changed:", state);
        setConnectionState(state);
        
        if (state === 'connected') {
          setIsConnected(true);
          console.log("✅ WebRTC connection established successfully!");
        } else if (state === 'disconnected') {
          setIsConnected(false);
          console.log("⚠️ WebRTC connection disconnected");
        } else if (state === 'failed') {
          setIsConnected(false);
          console.log("❌ WebRTC connection failed");
          // Attempt to restart ICE
          peerConnection.restartIce();
        } else if (state === 'connecting') {
          console.log("🔄 WebRTC connection in progress...");
        }
      };

      // Handle ICE connection state changes
      peerConnection.oniceconnectionstatechange = () => {
        const iceState = peerConnection.iceConnectionState;
        console.log("🧊 ICE connection state:", iceState);
        
        if (iceState === 'failed' || iceState === 'disconnected') {
          console.log("🔄 ICE connection issues, attempting restart...");
          // Attempt to restart ICE gathering
          peerConnection.restartIce();
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          console.log("🧊 Sending ICE candidate");
          socket.emit("video:ice-candidate", {
            roomId,
            candidate: event.candidate,
            toUserId: null, // Will be handled by server
          });
        }
      };

      // Attach local stream to video element
      if (localVideoRef?.current) {
        localVideoRef.current.srcObject = stream;
        // Ensure video plays
        localVideoRef.current.play().catch(e => console.log("Local video autoplay failed:", e));
      }

      // Join video room
      if (socket) {
        socket.emit("video:join-room", { roomId, consultationId });
      }
    } catch (error) {
      console.error("❌ Error initializing WebRTC:", error);

      // Show user-friendly error message
      let errorMessage = "Failed to access camera/microphone";
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          errorMessage =
            "Camera/microphone access denied. Please allow permissions and try again.";
        } else if (error.name === "NotFoundError") {
          errorMessage =
            "No camera or microphone found. Please check your devices.";
        } else if (error.name === "NotReadableError") {
          errorMessage =
            "Camera/microphone is already in use. Please close other video applications and refresh the page.";
        }
      }

      alert(errorMessage);
      onCallEnd();
    }
  }, [roomId, consultationId, socket, onCallEnd, localVideoRef, remoteVideoRef]);

  // Create offer for video call
  const createOffer = useCallback(async () => {
    if (!peerConnectionRef.current || !socket) return;

    try {
      console.log("📞 Creating offer...");
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      
      await peerConnectionRef.current.setLocalDescription(offer);
      
      socket.emit("video:offer", {
        roomId,
        offer,
        toUserId: null, // Will be handled by server
      });
      
      console.log("📞 Offer sent");
    } catch (error) {
      console.error("❌ Error creating offer:", error);
    }
  }, [roomId, socket]);

  // Handle incoming offer
  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current || !socket) return;

    try {
      console.log("📞 Received offer, creating answer...");
      await peerConnectionRef.current.setRemoteDescription(offer);
      
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      socket.emit("video:answer", {
        roomId,
        answer,
        toUserId: null, // Will be handled by server
      });
      
      console.log("📞 Answer sent");
    } catch (error) {
      console.error("❌ Error handling offer:", error);
    }
  }, [roomId, socket]);

  // Handle incoming answer
  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;

    try {
      console.log("📞 Received answer");
      await peerConnectionRef.current.setRemoteDescription(answer);
      console.log("📞 Answer processed successfully");
    } catch (error) {
      console.error("❌ Error handling answer:", error);
    }
  }, []);

  // Handle incoming ICE candidate
  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return;

    try {
      console.log("🧊 Adding ICE candidate");
      await peerConnectionRef.current.addIceCandidate(candidate);
    } catch (error) {
      console.error("❌ Error adding ICE candidate:", error);
    }
  }, []);

  // Setup socket event listeners for WebRTC signaling
  useEffect(() => {
    if (!socket) return;

    socket.on("video:offer", ({ offer, fromUserId }) => {
      console.log(`📞 Received offer from user ${fromUserId}`);
      handleOffer(offer);
    });
    
    socket.on("video:answer", ({ answer, fromUserId }) => {
      console.log(`📞 Received answer from user ${fromUserId}`);
      handleAnswer(answer);
    });
    
    socket.on("video:ice-candidate", ({ candidate, fromUserId }) => {
      console.log(`🧊 Received ICE candidate from user ${fromUserId}`);
      handleIceCandidate(candidate);
    });
    
    socket.on("video:user-joined", ({ userId, name, role, roomSize }) => {
      console.log(`👤 User ${name} (${role}) joined the call. Room size: ${roomSize}`);
      
      // If we're already in the room and someone new joins, we should create an offer
      if (peerConnectionRef.current && 
          peerConnectionRef.current.signalingState === 'stable' && 
          roomSize === 2) { // Only when it becomes 2 people
        console.log("📞 Creating offer for new participant...");
        setTimeout(() => createOffer(), 1000); // Small delay to ensure both peers are ready
      }
    });
    
    socket.on("video:room-joined", ({ roomId, roomSize }) => {
      console.log(`🏠 Successfully joined room ${roomId}. Room size: ${roomSize}`);
      setConnectionState('connecting');
    });
    
    socket.on("video:call-ended", () => {
      console.log("📞 Call ended by remote user");
      onCallEnd();
    });

    return () => {
      socket.off("video:offer");
      socket.off("video:answer");
      socket.off("video:ice-candidate");
      socket.off("video:user-joined");
      socket.off("video:room-joined");
      socket.off("video:call-ended");
    };
  }, [socket, handleOffer, handleAnswer, handleIceCandidate, createOffer, onCallEnd]);

  // Setup cleanup listeners
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("🔄 Page unload detected, cleaning up media...");
      cleanupMediaStreams();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("👁️ Tab hidden, cleaning up media...");
        cleanupMediaStreams();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cleanupMediaStreams();
    };
  }, [cleanupMediaStreams]);

  return {
    localStreamRef,
    remoteStreamRef,
    peerConnectionRef,
    initializeWebRTC,
    cleanupMediaStreams,
    createOffer,
    isConnected,
    connectionState,
  };
};
