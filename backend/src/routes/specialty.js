const express = require("express");
const {
  upload,
  handleCloudinaryUpload,
  formatFilePaths,
} = require("../middleware/multer");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const specialtyController = require("../controllers/specialty");

const router = express.Router();

// Public routes (for home page, etc.)
router.get("/", specialtyController.getAllSpecialties);
router.get("/stats", specialtyController.getSpecialtyStats);
router.get("/:id", specialtyController.getSpecialtyById);

// Admin-only routes
router.post(
  "/",
  authenticateUser,
  authorizeRoles(["admin"]),
  upload.single("specialtyImage"),
  handleCloudinaryUpload,
  formatFilePaths,
  specialtyController.createSpecialty
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  upload.single("specialtyImage"),
  handleCloudinaryUpload,
  formatFilePaths,
  specialtyController.updateSpecialty
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  specialtyController.deleteSpecialty
);

module.exports = router;
