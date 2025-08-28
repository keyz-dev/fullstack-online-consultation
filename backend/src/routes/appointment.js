const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment/index");
const { verifyCamPayWebhook } = require("../middleware/verifyCampayWebhook");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const paymentController = require("../controllers/payment");
const {
  upload,
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
} = require("../middleware/multer");

// Create appointment (requires authentication)
router.post(
  "/create",
  authenticate,
  upload.fields([{ name: "patientDocument", maxCount: 10 }]),
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
  appointmentController.createAppointment
);

// Initiate payment for appointment (requires authentication)
router.post(
  "/initiate-payment",
  authenticate,
  paymentController.initiateAppointmentPayment
);

// Campay webhook (no auth needed, but verified by Campay signature)
router.post(
  "/webhook",
  verifyCamPayWebhook,
  paymentController.handleAppointmentPaymentWebhook
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

// Get appointment by ID (requires authentication)
router.get("/:id", authenticate, appointmentController.getAppointmentById);

module.exports = router;
