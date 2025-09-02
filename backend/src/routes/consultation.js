"use strict";

const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const consultationController = require("../controllers/consultation");
const patientConsultationController = require("../controllers/patientConsultationController");
const doctorConsultationController = require("../controllers/doctorConsultationController");
const {
  upload,
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
} = require("../middleware/multer");

const router = express.Router();

// Protect all consultation routes
router.use(authenticateUser);

// ============================================================================
// SECURE ROLE-SPECIFIC ENDPOINTS (These provide proper user isolation)
// ============================================================================

/**
 * @desc    Get consultations for the authenticated patient (SECURE)
 * @route   GET /api/consultation/patient
 * @access  Private (Patient only)
 */
router.get(
  "/patient",
  authorizeRoles(["patient"]),
  patientConsultationController.getPatientConsultations
);

/**
 * @desc    Get active consultations for the authenticated patient (SECURE)
 * @route   GET /api/consultation/patient/active
 * @access  Private (Patient only)
 */
router.get(
  "/patient/active",
  authorizeRoles(["patient"]),
  patientConsultationController.getPatientActiveConsultations
);

/**
 * @desc    Get consultation statistics for the authenticated patient (SECURE)
 * @route   GET /api/consultation/patient/stats
 * @access  Private (Patient only)
 */
router.get(
  "/patient/stats",
  authorizeRoles(["patient"]),
  patientConsultationController.getPatientConsultationStats
);

/**
 * @desc    Get consultations for the authenticated doctor (SECURE)
 * @route   GET /api/consultation/doctor
 * @access  Private (Doctor only)
 */
router.get(
  "/doctor",
  authorizeRoles(["doctor"]),
  doctorConsultationController.getDoctorConsultations
);

/**
 * @desc    Get active consultations for the authenticated doctor (SECURE)
 * @route   GET /api/consultation/doctor/active
 * @access  Private (Doctor only)
 */
router.get(
  "/doctor/active",
  authorizeRoles(["doctor"]),
  doctorConsultationController.getDoctorActiveConsultations
);

/**
 * @desc    Get consultation statistics for the authenticated doctor (SECURE)
 * @route   GET /api/consultation/doctor/stats
 * @access  Private (Doctor only)
 */
router.get(
  "/doctor/stats",
  authorizeRoles(["doctor"]),
  doctorConsultationController.getDoctorConsultationStats
);

// ============================================================================
// LEGACY ENDPOINTS (These will be deprecated - use role-specific ones above)
// ============================================================================

/**
 * @desc    Get all consultations for user (DEPRECATED - Use /patient or /doctor instead)
 * @route   GET /api/consultation
 * @access  Private
 * @deprecated Use /api/consultation/patient or /api/consultation/doctor for secure access
 */
router.get("/", consultationController.getConsultations);

/**
 * @desc    Get single consultation by ID (DEPRECATED - Use /patient/:id or /doctor/:id instead)
 * @route   GET /api/consultation/:id
 * @access  Private
 * @deprecated Use /api/consultation/patient/:id or /api/consultation/doctor/:id for secure access
 */
router.get("/:id", consultationController.getConsultation);

// ============================================================================
// SHARED FUNCTIONALITY ENDPOINTS (These remain as-is)
// ============================================================================

/**
 * @desc    Get consultation messages
 * @route   GET /api/consultation/:id/messages
 * @access  Private (Doctor/Patient)
 */
router.get("/:id/messages", consultationController.getConsultationMessages);

/**
 * @desc    Upload file for consultation
 * @route   POST /api/consultation/:id/upload
 * @access  Private (Doctor/Patient)
 */
router.post(
  "/:id/upload",
  upload.single("consultationFile"),
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
  consultationController.uploadConsultationFile
);

/**
 * @desc    Update consultation notes
 * @route   PUT /api/consultation/:id
 * @access  Private (Doctor)
 */
router.put(
  "/:id",
  authorizeRoles("doctor"),
  consultationController.updateConsultationNotes
);

/**
 * @desc    Initiate a video call for a consultation
 * @route   POST /api/consultation/:id/initiate
 * @access  Private (Doctor)
 */
router.post(
  "/:id/initiate",
  authorizeRoles("doctor"),
  consultationController.initiateCall
);

/**
 * @desc    Get messages for a consultation
 * @route   GET /api/consultation/:id/messages
 * @access  Private
 */
router.get("/:id/messages", consultationController.getMessages);

/**
 * @desc    Send a message in a consultation
 * @route   POST /api/consultation/:id/messages
 * @access  Private
 */
router.post("/:id/messages", consultationController.sendMessage);

/**
 * @desc    Join consultation session
 * @route   POST /api/consultation/:id/join
 * @access  Private (Doctor/Patient)
 */
router.post("/:id/join", consultationController.joinConsultationSession);

/**
 * @desc    Leave consultation session
 * @route   POST /api/consultation/:id/leave
 * @access  Private (Doctor/Patient)
 */
router.post("/:id/leave", consultationController.leaveConsultationSession);

/**
 * @desc    Get consultation session status
 * @route   GET /api/consultation/:id/session-status
 * @access  Private (Doctor/Patient)
 */
router.get(
  "/:id/session-status",
  consultationController.getConsultationSessionStatus
);

/**
 * @desc    Update consultation session heartbeat
 * @route   POST /api/consultation/:id/heartbeat
 * @access  Private (Doctor/Patient)
 */
router.post("/:id/heartbeat", consultationController.updateSessionHeartbeat);

/**
 * @desc    Cancel a consultation
 * @route   POST /api/consultation/:id/cancel
 * @access  Private (Doctor)
 */
router.post(
  "/:id/cancel",
  authorizeRoles("doctor"),
  consultationController.cancelConsultation
);

module.exports = router;
