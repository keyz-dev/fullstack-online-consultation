import { useState, useCallback } from "react";
import { useSocketContext } from "@/contexts";

interface ChatMessage {
  message: string;
  timestamp: string;
  senderRole: string;
  sent: boolean;
}

interface UseVideoChatProps {
  roomId: string;
  consultationId: string;
  userRole: "doctor" | "patient";
}

export const useVideoChat = ({ roomId, consultationId, userRole }: UseVideoChatProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  const { socket } = useSocketContext();

  // Send chat message
  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !socket) return;

    const message = {
      roomId,
      consultationId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      senderRole: userRole,
    };

    socket.emit("video:chat-message", message);
    setChatMessages(prev => [...prev, { ...message, sent: true }]);
    setNewMessage("");
  }, [newMessage, socket, roomId, consultationId, userRole]);

  return {
    chatMessages,
    setChatMessages,
    newMessage,
    setNewMessage,
    sendMessage,
  };
};