import { useEffect, useCallback } from "react";
import { useSocketContext } from "@/contexts";

interface UseVideoSocketProps {
  roomId: string;
  userRole: "doctor" | "patient";
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>;
  setRemoteUserId: (userId: number | null) => void;
  setIsConnected: (connected: boolean) => void;
  createOffer: () => Promise<void>;
  onCallEnd: () => void;
}

export const useVideoSocket = ({
  roomId,
  userRole,
  peerConnectionRef,
  setRemoteUserId,
  setIsConnected,
  createOffer,
  onCallEnd,
}: UseVideoSocketProps) => {
  const { socket } = useSocketContext();

  // Send chat message
  const sendMessage = useCallback((messageData: {
    roomId: string;
    consultationId: string;
    message: string;
    timestamp: string;
    senderRole: string;
    sent: boolean;
  }) => {
    if (socket) {
      socket.emit("video:chat-message", messageData);
    }
  }, [socket]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // User joined room - set up peer connection if we're the second person
    socket.on("video:user-joined", (data: { userId: number; name: string; roomId: string; consultationId: string }) => {
      const { userId } = data;
      setRemoteUserId(userId);
      
      // If we're the doctor (initiator), create offer when patient joins
      if (userRole === "doctor" && peerConnectionRef.current) {
        createOffer();
      }
    });

    // WebRTC signaling
    socket.on("video:offer", async (data: { offer: RTCSessionDescriptionInit; fromUserId: number; roomId: string }) => {
      const { offer, fromUserId } = data;
      setRemoteUserId(fromUserId);
      
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(offer);
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit("video:answer", { roomId, toUserId: fromUserId, answer });
      }
    });

    socket.on("video:answer", async (data: { answer: RTCSessionDescriptionInit; fromUserId: number; roomId: string }) => {
      const { answer } = data;
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(answer);
        console.log("✅ Answer received and set as remote description");
        // Don't set connected here - let the connection state handler do it
      }
    });

    socket.on("video:ice-candidate", async (data: { candidate: RTCIceCandidateInit; fromUserId: number; roomId: string }) => {
      const { candidate } = data;
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(candidate);
      }
    });

    // Call ended by other party
    socket.on("video:call-ended", async () => {
      console.log("📞 Call ended by other party");
      
      // Clean up media streams
      try {
        const { mediaStreamManager } = await import('../utils/mediaStreamManager');
        mediaStreamManager.releaseMediaStream(roomId);
      } catch (error) {
        console.error("Error releasing media stream on call end:", error);
      }
      
      onCallEnd();
    });

    // User left room
    socket.on("video:user-left", () => {
      setRemoteUserId(null);
      setIsConnected(false);
    });

    return () => {
      socket.off("video:user-joined");
      socket.off("video:offer");
      socket.off("video:answer");
      socket.off("video:ice-candidate");
      socket.off("video:call-ended");
      socket.off("video:user-left");
    };
  }, [socket, roomId, userRole, peerConnectionRef, setRemoteUserId, setIsConnected, createOffer, onCallEnd]);

  return {
    sendMessage,
  };
};
