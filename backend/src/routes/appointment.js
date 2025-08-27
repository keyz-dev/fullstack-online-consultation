const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment");
const { verifyCamPayWebhook } = require("../middleware/verifyCampayWebhook");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// Create appointment (requires authentication)
router.post("/create", authenticate, appointmentController.createAppointment);

// Initiate payment for appointment (requires authentication)
router.post(
  "/initiate-payment",
  authenticate,
  appointmentController.initiatePayment
);

// Campay webhook (no auth needed, but verified by Campay signature)
router.post(
  "/webhook",
  verifyCamPayWebhook,
  appointmentController.handlePaymentWebhook
);

// Patient-specific appointment routes (must come before /:id)
router.get(
  "/patient",
  authenticate,
  authorizeRoles(["patient"]),
  appointmentController.getPatientAppointments
);
router.get(
  "/patient/stats",
  authenticate,
  authorizeRoles(["patient"]),
  appointmentController.getPatientAppointmentStats
);

// Doctor-specific appointment routes (must come before /:id)
router.get(
  "/doctor",
  authenticate,
  authorizeRoles(["doctor"]),
  appointmentController.getDoctorAppointments
);
router.get(
  "/doctor/stats",
  authenticate,
  authorizeRoles(["doctor"]),
  appointmentController.getDoctorAppointmentStats
);

// Get user's appointments (requires authentication)
router.get("/", authenticate, appointmentController.getUserAppointments);

// Get appointment by ID (requires authentication)
router.get("/:id", authenticate, appointmentController.getAppointmentById);

module.exports = router;
