const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/index.js");
const path = require("path");
const middleware = require("./middleware/index.js");
const { initializeSocket } = require("./sockets/index.js");
require("dotenv").config();
require("./config/database.js");

const port = process.env.PORT || 4500;
const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Mount API routes at /api endpoint
app.use("/api", apiRoutes);

// serve images from the src/uploads dir
app.use(
  "/uploads",
  (req, res, next) => {
    // Add CORS headers for uploads
    res.header(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL || "http://localhost:3000"
    );
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  },
  express.static(path.join(__dirname, "./uploads"))
);

app.get("/", (req, res) => {
  res.status(200).send({ message: "This server works doesn't it??" });
});

app.use("*", (req, res, next) => {
  return next(new Error("There is no such Route"));
});

app.use(middleware.errorHandler);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Initialize Socket.io
initializeSocket(server);

// Initialize appointment reminder service
// const appointmentReminderService = require("./services/appointmentReminderService");
// appointmentReminderService.start();

// // Graceful shutdown
// process.on("SIGTERM", () => {
//   console.log("SIGTERM received, shutting down gracefully");
//   appointmentReminderService.stop();
//   server.close(() => {
//     console.log("Server closed");
//     process.exit(0);
//   });
// });

// process.on("SIGINT", () => {
//   console.log("SIGINT received, shutting down gracefully");
//   appointmentReminderService.stop();
//   server.close(() => {
//     console.log("Server closed");
//     process.exit(0);
//   });
// });
