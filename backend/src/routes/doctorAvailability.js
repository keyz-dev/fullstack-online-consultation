"use strict";

const express = require("express");
const router = express.Router();
const doctorAvailabilityController = require("../controllers/doctorAvailability");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// ==================== DOCTOR AVAILABILITY ROUTES ====================

/**
 * @route   POST /api/doctor-availability
 * @desc    Create multiple availability schedules for a doctor
 * @access  Private (Doctor only)
 */
router.post(
  "/",
  authenticate,
  authorizeRoles(["doctor"]),
  doctorAvailabilityController.createAvailabilities
);

/**
 * @route   GET /api/doctor-availability
 * @desc    Get all availabilities for the authenticated doctor
 * @access  Private (Doctor only)
 */
router.get(
  "/",
  authenticate,
  authorizeRoles(["doctor"]),
  doctorAvailabilityController.getAllByDoctor
);

/**
 * @route   GET /api/doctor-availability/:id
 * @desc    Get a specific availability by ID
 * @access  Private (Doctor only)
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles(["doctor"]),
  doctorAvailabilityController.getById
);

/**
 * @route   PUT /api/doctor-availability/:id
 * @desc    Update an availability
 * @access  Private (Doctor only)
 */
router.put(
  "/:id",
  authenticate,
  authorizeRoles(["doctor"]),
  doctorAvailabilityController.updateAvailability
);

/**
 * @route   DELETE /api/doctor-availability/:id
 * @desc    Delete an availability (only if no active bookings)
 * @access  Private (Doctor only)
 */
router.delete(
  "/:id",
  authenticate,
  authorizeRoles(["doctor"]),
  doctorAvailabilityController.deleteAvailability
);

/**
 * @route   PATCH /api/doctor-availability/:id/invalidate
 * @desc    Invalidate an availability (soft delete)
 * @access  Private (Doctor only)
 */
router.patch(
  "/:id/invalidate",
  authenticate,
  authorizeRoles(["doctor"]),
  doctorAvailabilityController.invalidateAvailability
);

/**
 * @route   PATCH /api/doctor-availability/:id/reactivate
 * @desc    Reactivate an invalidated availability
 * @access  Private (Doctor only)
 */
router.patch(
  "/:id/reactivate",
  authenticate,
  authorizeRoles(["doctor"]),
  doctorAvailabilityController.reactivateAvailability
);

/**
 * @route   POST /api/doctor-availability/:id/regenerate-slots
 * @desc    Manually regenerate time slots for an availability
 * @access  Private (Doctor only)
 */
router.post(
  "/:id/regenerate-slots",
  authenticate,
  authorizeRoles(["doctor"]),
  doctorAvailabilityController.regenerateTimeSlots
);

/**
 * @route   POST /api/doctor-availability/:id/test-slots
 * @desc    Test time slot generation for debugging
 * @access  Private (Doctor only)
 */
router.post(
  "/:id/test-slots",
  authenticate,
  authorizeRoles(["doctor"]),
  doctorAvailabilityController.testTimeSlotGeneration
);

// ==================== PATIENT ROUTES ====================

/**
 * @route   GET /api/doctor-availability/available-doctors
 * @desc    Get available doctors by symptoms and date (for patients)
 * @access  Private (Patient only)
 */
router.get(
  "/available-doctors",
  authenticate,
  authorizeRoles(["patient"]),
  doctorAvailabilityController.getAvailableDoctors
);

module.exports = router;
