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

    // Handle video call signaling
    socket.on("video:offer", (data) => {
      socket.to(`user-${data.targetUserId}`).emit("video:offer", {
        fromUserId: socket.userId,
        fromUserName: socket.user.name,
        offer: data.offer,
      });
    });

    socket.on("video:answer", (data) => {
      socket.to(`user-${data.targetUserId}`).emit("video:answer", {
        fromUserId: socket.userId,
        answer: data.answer,
      });
    });

    socket.on("video:ice-candidate", (data) => {
      socket.to(`user-${data.targetUserId}`).emit("video:ice-candidate", {
        fromUserId: socket.userId,
        candidate: data.candidate,
      });
    });

    socket.on("video:end-call", (data) => {
      socket.to(`user-${data.targetUserId}`).emit("video:end-call", {
        fromUserId: socket.userId,
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
