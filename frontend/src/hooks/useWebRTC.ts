import { useCallback, useRef, useEffect } from "react";
import { Socket } from "socket.io-client";
import { mediaStreamManager } from "../utils/mediaStreamManager";

interface UseWebRTCProps {
  roomId: string;
  consultationId: string;
  socket: Socket | null;
  onCallEnd: () => void;
}

export const useWebRTC = ({
  roomId,
  consultationId,
  socket,
  onCallEnd,
}: UseWebRTCProps) => {
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const cleanupExecutedRef = useRef(false);

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

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("ice_candidate", {
            roomId,
            candidate: event.candidate,
          });
        }
      };

      // Join room
      if (socket) {
        socket.emit("join_room", { roomId, consultationId });
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
  }, [roomId, consultationId, socket, onCallEnd]);

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
    peerConnectionRef,
    initializeWebRTC,
    cleanupMediaStreams,
  };
};
