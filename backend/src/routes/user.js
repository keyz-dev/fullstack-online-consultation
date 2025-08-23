const express = require("express");
const router = express.Router();
const { authenticate, authorizeRoles } = require("../middleware/auth");
const {
  getAllUsers,
  getUserStats,
  getUserById,
  updateUserStatus,
  getUserActivity,
} = require("../controllers/user");

// Apply authentication and admin middleware to all routes
router.use(authenticate);
router.use(authorizeRoles(["admin"]));

// Get all users with filters and pagination
router.get("/", getAllUsers);

// Get user statistics
router.get("/stats", getUserStats);

// Get single user by ID
router.get("/:id", getUserById);

// Update user status (activate/deactivate)
router.patch("/:id/status", updateUserStatus);

// Get user activity logs
router.get("/:id/activity", getUserActivity);

module.exports = router;
