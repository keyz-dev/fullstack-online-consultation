const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const consultationController = require("../controllers/consultation");

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateUser);

// ===== CONSULTATION/APPOINTMENT MANAGEMENT =====

// Create new consultation/appointment
router.post("/", consultationController.createConsultation);

// Get consultations with filtering and pagination
router.get("/", consultationController.getConsultations);

// Get single consultation by ID
router.get("/:id", consultationController.getConsultation);

// Update consultation
router.put("/:id", consultationController.updateConsultation);

// Delete consultation (soft delete)
router.delete("/:id", consultationController.deleteConsultation);

// ===== AVAILABILITY MANAGEMENT =====

// Get doctor availability
router.get(
  "/availability/:doctorId",
  consultationController.getDoctorAvailability
);

// Set doctor availability
router.post(
  "/availability",
  authorizeRoles(["doctor"]),
  consultationController.setDoctorAvailability
);

// Get available time slots for a doctor
router.get("/slots/:doctorId", consultationController.getAvailableSlots);

// ===== CONSULTATION ACTIONS =====

// Start consultation
router.post("/:id/start", consultationController.startConsultation);

// End consultation
router.post("/:id/end", consultationController.endConsultation);

// Cancel consultation
router.post("/:id/cancel", consultationController.cancelConsultation);

// Reschedule consultation
router.post("/:id/reschedule", consultationController.rescheduleConsultation);

// ===== REAL-TIME FEATURES =====

// Join video call
router.post("/:id/join", consultationController.joinVideoCall);

// Leave video call
router.post("/:id/leave", consultationController.leaveVideoCall);

// Handle WebRTC signaling
router.post("/:id/signal", consultationController.handleSignal);

// ===== CHAT MESSAGES =====

// Send message
router.post("/:id/messages", consultationController.sendMessage);

// Get messages
router.get("/:id/messages", consultationController.getMessages);

// ===== RATINGS & REVIEWS =====

// Rate consultation
router.post("/:id/rate", consultationController.rateConsultation);

// Get consultation rating
router.get("/:id/rating", consultationController.getConsultationRating);

// ===== ADMIN ENDPOINTS =====

// Get all consultations (admin only)
router.get(
  "/admin/all",
  authorizeRoles(["admin"]),
  consultationController.getAllConsultations
);

// Get consultation statistics (admin only)
router.get(
  "/admin/stats",
  authorizeRoles(["admin"]),
  consultationController.getConsultationStats
);

module.exports = router;
