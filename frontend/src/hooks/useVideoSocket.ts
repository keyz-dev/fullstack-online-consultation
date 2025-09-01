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
  
  console.log("🎯 useVideoSocket hook called with:", {
    roomId,
    userRole,
    hasSocket: !!socket,
    socketConnected: socket?.connected
  });

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
    console.log("🔌 Setting up video socket listeners with:", { 
      hasSocket: !!socket, 
      socketConnected: socket?.connected,
      roomId,
      userRole 
    });
    
    if (!socket) {
      console.log("❌ No socket available in useVideoSocket");
      return;
    }

    if (!socket.connected) {
      console.log("⚠️ Socket not connected yet, waiting for connection...");
      
      const handleConnect = () => {
        console.log("✅ Socket connected, setting up video socket listeners");
        setupVideoListeners();
      };
      
      socket.on("connect", handleConnect);
      
      return () => {
        socket.off("connect", handleConnect);
        cleanupListeners();
      };
    } else {
      setupVideoListeners();
      return cleanupListeners;
    }

    function setupVideoListeners() {
      console.log("🎧 Setting up video socket event listeners...");
      
      // User joined room - set up peer connection if we're the second person
      socket.on("video:user-joined", (data: { userId: number; name: string; roomId: string; consultationId: string }) => {
        const { userId, name } = data;
        console.log(`👥 User ${name} (ID: ${userId}) joined room. Current user role: ${userRole}`);
        
        setRemoteUserId(userId);
        
        // Send any pending ICE candidates now that we have a remote user
        const pc = peerConnectionRef.current as RTCPeerConnection & { sendPendingCandidates?: () => void };
        if (pc && pc.sendPendingCandidates) {
          console.log("📤 Sending pending ICE candidates to new user");
          pc.sendPendingCandidates();
        }
        
        // If we're the doctor (initiator), create offer when patient joins
        if (userRole === "doctor") {
          console.log("👨‍⚕️ Doctor should create offer for patient:", userId);
          console.log("🔍 Peer connection state:", {
            hasPeerConnection: !!peerConnectionRef.current,
            connectionState: peerConnectionRef.current?.connectionState,
            signalingState: peerConnectionRef.current?.signalingState
          });
          
          if (peerConnectionRef.current) {
            console.log("✅ Peer connection ready, creating offer");
            setTimeout(() => {
              console.log("🤝 Creating offer after delay...");
              createOffer();
            }, 500);
          } else {
            console.log("⚠️ Peer connection not ready, will retry...");
            // Retry after a longer delay to allow WebRTC initialization
            setTimeout(() => {
              console.log("🔄 Retrying offer creation...");
              if (peerConnectionRef.current) {
                console.log("✅ Peer connection now ready, creating offer");
                createOffer();
              } else {
                console.error("❌ Peer connection still not ready after retry");
              }
            }, 2000);
          }
        }
      });

      // WebRTC signaling
      socket.on("video:offer", async (data: { offer: RTCSessionDescriptionInit; fromUserId: number; roomId: string }) => {
        const { offer, fromUserId } = data;
        console.log("📥 Offer received from:", fromUserId);
        setRemoteUserId(fromUserId);
        
        if (peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.setRemoteDescription(offer);
            console.log("✅ Remote description set from offer");
            
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            console.log("✅ Answer created and set as local description");
            
            socket.emit("video:answer", { roomId, toUserId: fromUserId, answer });
            console.log("📤 Answer sent to:", fromUserId);

            // Send any pending ICE candidates now that we have a remote user
            const pc = peerConnectionRef.current as RTCPeerConnection & { sendPendingCandidates?: () => void };
            if (pc.sendPendingCandidates) {
              pc.sendPendingCandidates();
            }
          } catch (error) {
            console.error("❌ Error handling offer:", error);
          }
        }
      });

      socket.on("video:answer", async (data: { answer: RTCSessionDescriptionInit; fromUserId: number; roomId: string }) => {
        const { answer } = data;
        console.log("📥 Answer received from:", data.fromUserId);
        
        if (peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.setRemoteDescription(answer);
            console.log("✅ Answer received and set as remote description");
            // Don't set connected here - let the connection state handler do it
          } catch (error) {
            console.error("❌ Error handling answer:", error);
          }
        }
      });

      socket.on("video:ice-candidate", async (data: { candidate: RTCIceCandidateInit; fromUserId: number; roomId: string }) => {
        const { candidate, fromUserId } = data;
        console.log("🧊 ICE candidate received from:", fromUserId);
        
        if (peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.addIceCandidate(candidate);
            console.log("✅ ICE candidate added successfully");
          } catch (error) {
            console.error("❌ Error adding ICE candidate:", error);
          }
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
    }

    function cleanupListeners() {
      console.log("🔌 Cleaning up video socket listeners");
      socket.off("video:user-joined");
      socket.off("video:offer");
      socket.off("video:answer");
      socket.off("video:ice-candidate");
      socket.off("video:call-ended");
      socket.off("video:user-left");
    }
  }, [socket, roomId, userRole, peerConnectionRef, setRemoteUserId, setIsConnected, createOffer, onCallEnd]);

  return {
    sendMessage,
  };
};
