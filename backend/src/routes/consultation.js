"use strict";

const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const consultationController = require("../controllers/consultation");
const {
  upload,
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
} = require("../middleware/multer");

const router = express.Router();

// Protect all consultation routes
router.use(authenticateUser);

/**
 * @desc    Get consultations for authenticated user
 * @route   GET /api/v1/consultations
 * @access  Private
 */
router.get("/", consultationController.getConsultations);

/**
 * @desc    Get active consultations for user
 * @route   GET /api/v1/consultations/active
 * @access  Private (Doctor/Patient)
 */
router.get("/active", consultationController.getActiveConsultations);

/**
 * @desc    Get single consultation by ID
 * @route   GET /api/v1/consultations/:id
 * @access  Private
 */
router.get("/:id", consultationController.getConsultation);

/**
 * @desc    Get consultation messages
 * @route   GET /api/v1/consultations/:id/messages
 * @access  Private (Doctor/Patient)
 */
router.get("/:id/messages", consultationController.getConsultationMessages);

/**
 * @desc    Upload file for consultation
 * @route   POST /api/v1/consultations/:id/upload
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
 * @route   PUT /api/v1/consultations/:id
 * @access  Private (Doctor)
 */
router.put(
  "/:id",
  authorizeRoles("doctor"),
  consultationController.updateConsultationNotes
);

/**
 * @desc    Initiate a video call for a consultation
 * @route   POST /api/v1/consultations/:id/initiate
 * @access  Private (Doctor)
 */
router.post(
  "/:id/initiate",
  authorizeRoles("doctor"),
  consultationController.initiateCall
);

/**
 * @desc    Get messages for a consultation
 * @route   GET /api/v1/consultations/:id/messages
 * @access  Private
 */
router.get("/:id/messages", consultationController.getMessages);

/**
 * @desc    Send a message in a consultation
 * @route   POST /api/v1/consultations/:id/messages
 * @access  Private
 */
router.post("/:id/messages", consultationController.sendMessage);

/**
 * @desc    Join consultation session
 * @route   POST /api/v1/consultations/:id/join
 * @access  Private (Doctor/Patient)
 */
router.post("/:id/join", consultationController.joinConsultationSession);

/**
 * @desc    Leave consultation session
 * @route   POST /api/v1/consultations/:id/leave
 * @access  Private (Doctor/Patient)
 */
router.post("/:id/leave", consultationController.leaveConsultationSession);

/**
 * @desc    Get consultation session status
 * @route   GET /api/v1/consultations/:id/session-status
 * @access  Private (Doctor/Patient)
 */
router.get("/:id/session-status", consultationController.getConsultationSessionStatus);

/**
 * @desc    Update consultation session heartbeat
 * @route   POST /api/v1/consultations/:id/heartbeat
 * @access  Private (Doctor/Patient)
 */
router.post("/:id/heartbeat", consultationController.updateSessionHeartbeat);

module.exports = router;
