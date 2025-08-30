"use strict";

const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const consultationController = require("../controllers/consultation");

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
 * @desc    Initiate a video call for a consultation
 * @route   POST /api/v1/consultations/:id/initiate
 * @access  Private (Doctor)
 */
router.post(
  "/:id/initiate",
  authorizeRoles("doctor"),
  consultationController.initiateCall
);

module.exports = router;
