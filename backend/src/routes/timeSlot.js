const express = require("express");
const router = express.Router();
const {
  getDoctorTimeSlots,
  getTimeSlotById,
} = require("../controllers/timeSlot");

// Get available time slots for a doctor
router.get("/doctors/:doctorId/time-slots", getDoctorTimeSlots);

// Get specific time slot by ID
router.get("/:id", getTimeSlotById);

module.exports = router;
