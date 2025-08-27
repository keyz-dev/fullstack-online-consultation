const express = require("express");
const router = express.Router();
const doctorsController = require("../controllers/doctor");

// ==================== DOCTORS ROUTES ====================

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors with filters and pagination
 * @access  Public
 */
router.get("/", doctorsController.getAllDoctors);

/**
 * @route   GET /api/doctors/search
 * @desc    Search doctors by name
 * @access  Public
 */
router.get("/search", doctorsController.searchDoctors);

/**
 * @route   GET /api/doctors/:id
 * @desc    Get doctor by ID with full details
 * @access  Public
 */
router.get("/:id", doctorsController.getDoctorById);

module.exports = router;
