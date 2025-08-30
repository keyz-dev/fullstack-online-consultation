const express = require("express");
const router = express.Router();
const { authenticate, authorizeRoles } = require("../middleware/auth");
const {
  getAllUsers,
  getUserStats,
  getUserById,
  updateUserStatus,
  getUserActivity,
  getUserPresence,
} = require("../controllers/user");

// Apply authentication to all routes
router.use(authenticate);

// Patient presence endpoint (accessible to doctors)
router.get("/:id/presence", authorizeRoles(["doctor"]), getUserPresence);

// Admin-only routes
router.use(authorizeRoles(["admin"]));

// Get all users with filters and pagination
router.get("/", getAllUsers);

// Get user statistics
router.get("/stats", getUserStats);

// Get single user by ID (admin only)
router.get("/:id", getUserById);

// Update user status (activate/deactivate)
router.patch("/:id/status", updateUserStatus);

// Get user activity logs
router.get("/:id/activity", getUserActivity);

module.exports = router;
