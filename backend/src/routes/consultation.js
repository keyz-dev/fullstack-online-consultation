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
 * @desc    Reset a consultation (for stuck consultations)
 * @route   POST /api/v1/consultations/:id/reset
 * @access  Private (Doctor)
 */
router.post(
  "/:id/reset",
  authorizeRoles("doctor"),
  consultationController.resetConsultation
);

module.exports = router;
