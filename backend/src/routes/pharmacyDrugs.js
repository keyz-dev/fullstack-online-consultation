const express = require("express");
const router = express.Router();
const pharmacyDrugController = require("../controllers/pharmacyDrugController");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { upload } = require("../middleware/multer");

// ==================== PHARMACY DRUG ROUTES ====================

// Apply authentication middleware to all routes
router.use(authenticate);

// Apply pharmacy authorization to all routes
router.use(authorizeRoles(["pharmacy"]));

// Get all medications for a pharmacy with pagination and filtering
router.get("/", pharmacyDrugController.getPharmacyDrugs);

// Get medication statistics for a pharmacy
router.get("/stats", pharmacyDrugController.getPharmacyDrugStats);

// Get a single medication by ID
router.get("/:id", pharmacyDrugController.getPharmacyDrug);

// Create a new medication (with image upload)
router.post(
  "/",
  upload.fields([
    { name: "medicationImage", maxCount: 1 },
  ]),
  pharmacyDrugController.createPharmacyDrug
);

// Update a medication (with image upload)
router.put(
  "/:id",
  upload.fields([
    { name: "medicationImage", maxCount: 1 },
  ]),
  pharmacyDrugController.updatePharmacyDrug
);

// Delete a medication
router.delete("/:id", pharmacyDrugController.deletePharmacyDrug);

// Update medication stock
router.patch("/:id/stock", pharmacyDrugController.updateMedicationStock);

// Bulk import medications from Excel/CSV file
router.post(
  "/bulk-import",
  upload.fields([
    { name: "medicationFile", maxCount: 1 },
  ]),
  pharmacyDrugController.bulkImportPharmacyDrugs
);

// Download medication import template
router.get("/template/download", pharmacyDrugController.downloadTemplate);

module.exports = router;
