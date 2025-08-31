const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token || socket.handshake.headers.authorization;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRET
      );
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user.id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `🔌 User ${socket.userId} (${socket.user.name}) connected - Role: ${socket.user.role}`
    );

    // Join user-specific room (main notification room)
    socket.join(`user-${socket.userId}`);
    console.log(`✅ User ${socket.userId} joined room: user-${socket.userId}`);

    // Join admin room if user is admin
    if (socket.user.role === "admin") {
      socket.join("admin-room");
      console.log(`✅ Admin ${socket.userId} joined admin-room`);
    }

    // Join doctor room if user is a doctor
    if (socket.user.role === "doctor" && socket.user.doctor) {
      socket.join(`doctor-${socket.user.doctor.id}`);
      console.log(
        `✅ Doctor ${socket.userId} joined doctor-${socket.user.doctor.id}`
      );
    }

    // Join patient room if user is a patient
    if (socket.user.role === "patient" && socket.user.patient) {
      socket.join(`patient-${socket.user.patient.id}`);
      console.log(
        `✅ Patient ${socket.userId} joined patient-${socket.user.patient.id}`
      );
    }

    // Log all rooms this socket has joined
    console.log(`🏠 Socket ${socket.userId} rooms:`, Array.from(socket.rooms));

    // Handle explicit room joining request from frontend
    socket.on("join-user-room", (data) => {
      const { userId } = data;
      if (userId === socket.userId) {
        socket.join(`user-${userId}`);
        console.log(`🔄 User ${socket.userId} re-joined room: user-${userId}`);

        // Confirm room joining
        socket.emit("room-joined", {
          room: `user-${userId}`,
          message: "Successfully joined notification room",
        });
      } else {
        console.warn(
          `⚠️ User ${socket.userId} tried to join room for user ${userId}`
        );
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`🔌 User ${socket.userId} disconnected`);
      // If user was in a video room, notify others they left
      if (socket.currentVideoRoom) {
        socket.to(socket.currentVideoRoom).emit("video:user-left", { 
          userId: socket.userId 
        });
      }
    });

    // Handle notification read
    socket.on("notification:read", async (data) => {
      try {
        // Update notification as read in database
        // This would be implemented in a notification service
        console.log(
          `User ${socket.userId} marked notification ${data.notificationId} as read`
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    });

    // Handle typing indicators for chat
    socket.on("chat:typing", (data) => {
      socket.to(`chat-${data.chatId}`).emit("chat:typing", {
        userId: socket.userId,
        userName: socket.user.name,
        isTyping: data.isTyping,
      });
    });

    // ====================================
    // ===== VIDEO CALL SIGNALING =======
    // ====================================

    // Patient accepts the call and is ready to join
    socket.on("video:accept-call", (data) => {
      const { roomId, doctorId } = data;
      console.log(`📞 Patient ${socket.userId} accepted call from doctor ${doctorId}`);
      // Notify doctor that patient has accepted
      io.to(`user-${doctorId}`).emit("video:call-accepted", { roomId, patientId: socket.userId });
    });

    // Patient rejects the call
    socket.on("video:reject-call", (data) => {
      const { doctorId } = data;
      console.log(`🚫 Patient ${socket.userId} rejected call from doctor ${doctorId}`);
      // Notify doctor that patient has rejected
      io.to(`user-${doctorId}`).emit("video:call-rejected", { patientId: socket.userId });
    });

    // User (doctor or patient) joins the video call room
    socket.on("video:join-room", (data) => {
      const { roomId, consultationId } = data;
      if (!roomId) return;
      socket.join(roomId);
      console.log(`✅ User ${socket.userId} joined video room: ${roomId}`);
      // Store room association for this socket
      socket.currentVideoRoom = roomId;
      // Announce to others in the room that a new user has joined
      socket.to(roomId).emit("video:user-joined", { 
        userId: socket.userId, 
        name: socket.user.name,
        roomId,
        consultationId 
      });
    });

    // --- WebRTC Signaling Events --- 

    // Relay SDP offer
    socket.on("video:offer", (data) => {
      const { offer, toUserId, roomId } = data;
      io.to(`user-${toUserId}`).emit("video:offer", { offer, fromUserId: socket.userId, roomId });
    });

    // Relay SDP answer
    socket.on("video:answer", (data) => {
      const { answer, toUserId, roomId } = data;
      io.to(`user-${toUserId}`).emit("video:answer", { answer, fromUserId: socket.userId, roomId });
    });

    // Relay ICE candidate
    socket.on("video:ice-candidate", (data) => {
      const { candidate, toUserId, roomId } = data;
      io.to(`user-${toUserId}`).emit("video:ice-candidate", { candidate, fromUserId: socket.userId, roomId });
    });

    // User leaves the video call room
    socket.on("video:leave-room", (data) => {
      const { roomId } = data;
      if (!roomId) return;
      socket.leave(roomId);
      console.log(`❌ User ${socket.userId} left video room: ${roomId}`);
      // Announce to others that a user has left
      socket.to(roomId).emit("video:user-left", { userId: socket.userId });
    });

    // A user ends the call for everyone
    socket.on("video:end-call", (data) => {
        const { roomId } = data;
        if (!roomId) return;
        console.log(`📞 User ${socket.userId} ended the call for room ${roomId}`);
        // Notify OTHER clients in the room to end the call (exclude sender)
        socket.to(roomId).emit("video:call-ended", { fromUserId: socket.userId });
        // Remove this socket from the room
        socket.leave(roomId);
        socket.currentVideoRoom = null;
    });

    // Handle video chat messages
    socket.on("video:chat-message", (data) => {
      const { roomId, consultationId, message, timestamp, senderRole } = data;
      if (!roomId) return;
      console.log(`💬 User ${socket.userId} sent chat message in room ${roomId}`);
      // Relay message to others in the room
      socket.to(roomId).emit("video:chat-message", {
        roomId,
        consultationId,
        message,
        timestamp,
        senderRole,
        fromUserId: socket.userId,
        sent: false
      });
    });

    // Handle appointment payment tracking
    socket.on("track-payment", (data) => {
      const { paymentReference, userId, sessionId } = data;
      socket.join(`payment-${paymentReference}`);
      console.log(
        `💰 User ${socket.userId} joined payment room: payment-${paymentReference}`,
        {
          paymentReference,
          userId: socket.userId,
          rooms: Array.from(socket.rooms),
        }
      );
    });

    socket.on("stop-tracking-payment", (data) => {
      const { paymentReference } = data;
      socket.leave(`payment-${paymentReference}`);
      console.log(
        `User ${socket.userId} stopped tracking payment ${paymentReference}`
      );
    });

    // Handle appointment status updates
    socket.on("appointment:status-update", (data) => {
      const { appointmentId, status } = data;
      socket
        .to(`appointment-${appointmentId}`)
        .emit("appointment:status-changed", {
          appointmentId,
          status,
          updatedBy: socket.userId,
          timestamp: new Date(),
        });
    });
  });

  // Make io available globally
  global.io = io;

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};
