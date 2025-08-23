const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  upload,
  handleCloudinaryUpload,
  formatFilePaths,
} = require("../middleware/multer");
const { validate } = require("../middleware/validate");
const {
  userUpdateSchema,
  userPasswordUpdateSchema,
} = require("../schema/userSchema");
const profileController = require("../controllers/profile");

// Apply authentication middleware to all routes
router.use(authenticate);

// Profile management routes
router.get("/profile", profileController.getUserProfile);
router.put(
  "/profile",
  validate(userUpdateSchema),
  profileController.updateProfile
);
router.put(
  "/password",
  validate(userPasswordUpdateSchema),
  profileController.updatePassword
);

// Avatar management routes
router.put(
  "/avatar",
  upload.single("avatar"),
  handleCloudinaryUpload,
  formatFilePaths,
  profileController.updateAvatar
);
router.delete("/avatar", profileController.deleteAvatar);

// User statistics and preferences
router.get("/stats", profileController.getUserStats);
router.put("/preferences", profileController.updatePreferences);

module.exports = router;
