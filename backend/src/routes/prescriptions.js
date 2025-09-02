const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescription");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// Apply authentication to all routes
router.use(authenticate);

// Create prescription (doctors only)
router.post(
  "/",
  authorizeRoles(["doctor"]),
  prescriptionController.createPrescription
);

// Get prescription by ID
router.get(
  "/:prescriptionId",
  prescriptionController.getPrescriptionById
);

// Get prescriptions by consultation ID
router.get(
  "/consultation/:consultationId",
  prescriptionController.getPrescriptionsByConsultation
);

// Update prescription (doctors only)
router.put(
  "/:prescriptionId",
  authorizeRoles(["doctor"]),
  prescriptionController.updatePrescription
);

// Delete prescription (doctors only)
router.delete(
  "/:prescriptionId",
  authorizeRoles(["doctor"]),
  prescriptionController.deletePrescription
);

// Generate prescription PDF (doctors only)
router.post(
  "/:prescriptionId/generate-pdf",
  authorizeRoles(["doctor"]),
  prescriptionController.generatePrescriptionPDF
);

// Get prescription statistics
router.get(
  "/stats",
  prescriptionController.getPrescriptionStats
);

module.exports = router;
