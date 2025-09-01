import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/api";
import { shouldShowNotification } from "@/utils/notificationDeduplicator";

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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

    // Expose immediately so consumers re-run effects
    setSocket(socketRef.current);
    setIsConnected(!!socketRef.current.connected);

    // Connection events
    socketRef.current.on("connect", () => {
      setIsConnected(true);
      // Keep state socket in sync
      setSocket(socketRef.current);
      // Explicitly join user notification room
      if (socketRef.current) {
        socketRef.current.emit("join-user-room", { userId: user.id });
      }
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      setSocket(null);
    });

    // Handle notification events directly (NotificationContext approach had issues)
    socketRef.current.on(
      "notification:new",
      (data: { notification: NotificationData }) => {
        // Check for duplicates before showing
        const shouldShow = shouldShowNotification(
          'socket_notification',
          data.notification.message,
          data.notification.data?.relatedId,
          user.id.toString()
        );

        if (shouldShow) {
          // Show toast immediately
          toast.info(data.notification.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

        // Always dispatch custom event for other components (they can handle their own deduplication)
        const event = new CustomEvent("notification:received", {
          detail: data.notification,
        });
        window.dispatchEvent(event);
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
    // to avoid duplicate event listeners. Only keeping WebRTC signaling events here.
  }, [user]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setSocket(null);
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
    socket,
    isConnected,
    emit,
    connect,
    disconnect,
  };
};
