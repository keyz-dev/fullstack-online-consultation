import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { API_BASE_URL } from "@/api";

interface NotificationData {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  data?: {
    relatedId?: string;
    relatedModel?: string;
    category?: string;
  };
}

interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  timestamp: string;
}

interface VideoCallData {
  fromUserId: number;
  fromUserName: string;
  offer?: any;
  answer?: any;
  candidate?: any;
}

export const useSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  // Notification events are now handled directly in NotificationContext

  const connect = useCallback(() => {
    if (!user) return;

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Get token from localStorage
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    // Connect to socket server
    socketRef.current = io(API_BASE_URL.replace("/api", ""), {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
    });

    // Connection events
    socketRef.current.on("connect", () => {
      console.log(
        `🔌 Socket connected for user ${user.id} (${user.name}) - Role: ${user.role}`
      );

      // Explicitly join user notification room
      if (socketRef.current) {
        socketRef.current.emit("join-user-room", { userId: user.id });
        console.log(`📢 Requested to join user-${user.id} notification room`);
      }
    });

    socketRef.current.on("disconnect", () => {
      console.log(`🔌 Socket disconnected for user ${user.id}`);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("🚨 Socket connection error:", error);
    });

    // Handle room joining confirmation
    socketRef.current.on("room-joined", (data) => {
      console.log(
        `✅ Successfully joined room: ${data.room} - ${data.message}`
      );
    });

    // Note: Notification events are now handled directly in NotificationContext
    // This avoids stale closure issues and ensures real-time updates

    // Chat events
    socketRef.current.on("chat:message", (data: ChatMessage) => {
      console.log("New chat message:", data);
      // Handle new chat message
    });

    socketRef.current.on(
      "chat:typing",
      (data: { userId: number; userName: string; isTyping: boolean }) => {
        console.log("Typing indicator:", data);
        // Handle typing indicator
      }
    );

    // Video call events
    socketRef.current.on("video:offer", (data: VideoCallData) => {
      console.log("Video call offer:", data);
      // Handle incoming video call
    });

    socketRef.current.on("video:answer", (data: VideoCallData) => {
      console.log("Video call answer:", data);
      // Handle video call answer
    });

    socketRef.current.on("video:ice-candidate", (data: VideoCallData) => {
      console.log("ICE candidate:", data);
      // Handle ICE candidate
    });

    socketRef.current.on("video:end-call", (data: { fromUserId: number }) => {
      console.log("Video call ended:", data);
      // Handle call end
    });
  }, [user]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  // Connect on mount and when user changes
  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  return {
    socket: socketRef.current,
    emit,
    connect,
    disconnect,
  };
};
