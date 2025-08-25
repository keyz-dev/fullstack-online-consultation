import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { toast } from "react-toastify";
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

  // Get notification context safely
  let addNotification: ((notification: any) => void) | undefined;
  let getUnreadCount: (() => Promise<void>) | undefined;

  try {
    const notificationContext = useNotificationContext();
    addNotification = notificationContext?.addNotification;
    getUnreadCount = notificationContext?.getUnreadCount;
  } catch (error) {
    // Context not available yet, that's okay
    console.log("NotificationContext not available yet");
  }

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
      console.log("Socket connected");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Notification events - Now integrated with NotificationContext
    socketRef.current.on(
      "notification:new",
      (data: { notification: NotificationData }) => {
        console.log("New notification received:", data.notification);

        // Add notification to context (this will also show toast)
        if (addNotification) {
          addNotification(data.notification);
        }

        // Update unread count
        if (getUnreadCount) {
          getUnreadCount();
        }
      }
    );

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
  }, [user, addNotification, getUnreadCount]);

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
