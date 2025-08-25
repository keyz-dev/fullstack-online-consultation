import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/api";

interface NotificationData {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
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
  const { user, token } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!user || !token) return;

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

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

    // Notification events
    socketRef.current.on(
      "notification:new",
      (data: { notification: NotificationData }) => {
        console.log("New notification received:", data.notification);

        // Show toast notification
        toast.info(data.notification.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // You can also update notification state here
        // dispatch({ type: 'ADD_NOTIFICATION', payload: data.notification });
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
  }, [user, token]);

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

  // Connect on mount and when user/token changes
  useEffect(() => {
    if (user && token) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [user, token, connect, disconnect]);

  return {
    socket: socketRef.current,
    emit,
    connect,
    disconnect,
  };
};
