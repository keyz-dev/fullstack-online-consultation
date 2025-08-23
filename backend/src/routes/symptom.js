const express = require("express");
const {
  upload,
  handleCloudinaryUpload,
  formatFilePaths,
} = require("../middleware/multer");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const symptomController = require("../controllers/symptom");

const router = express.Router();

// Public routes (for home page, etc.)
router.get("/", symptomController.getAllSymptoms);
router.get("/stats", symptomController.getSymptomStats);
router.get("/:id", symptomController.getSymptomById);

// Admin-only routes
router.post(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "doctor"]),
  upload.single("symptomImage"),
  handleCloudinaryUpload,
  formatFilePaths,
  symptomController.createSymptom
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin", "doctor"]),
  upload.single("symptomImage"),
  handleCloudinaryUpload,
  formatFilePaths,
  symptomController.updateSymptom
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  symptomController.deleteSymptom
);

module.exports = router;
