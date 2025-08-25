const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const registrationController = require("../controllers/registration");
const {
  upload,
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
} = require("../middleware/multer");
const { authenticate } = require("../middleware/auth");

// ==================== REGISTRATION ROUTES ====================

// Admin registration (simple, no documents)
router.post(
  "/register/admin",
  upload.single("avatar"),
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
  registrationController.registerAdmin
);

// Patient registration (simple, no documents)
router.post(
  "/register/patient",
  upload.single("avatar"),
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
  registrationController.registerPatient
);

// Initiate doctor registration (basic user info only)
router.post(
  "/register/:role/initiate",
  upload.single("avatar"),
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
  registrationController.initiateRegistration
);

// Doctor registration (with documents and images) - for final application submission
router.post(
  "/register/doctor",
  authenticate, // Require authentication
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "doctorDocument", maxCount: 10 },
  ]),
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
  registrationController.registerDoctor
);

// Pharmacy registration (with documents and images)
router.post(
  "/register/pharmacy",
  authenticate, // Require authentication
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "pharmacyLogo", maxCount: 1 },
    { name: "pharmacyImage", maxCount: 5 },
    { name: "pharmacyDocument", maxCount: 10 },
  ]),
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
  registrationController.registerPharmacy
);

// ==================== LOGIN ROUTES ====================

// Unified login for all user types
router.post("/login", authController.login);

// Google OAuth login (sign in only, no account creation)
router.post("/google-login", authController.googleLogin);

// ==================== EMAIL VERIFICATION ROUTES ====================

// Verify email with code
router.post("/verify-email", authController.verifyEmail);

// Resend verification email
router.post("/resend-verification", authController.resendVerificationEmail);

// ==================== PASSWORD RESET ROUTES ====================

// Forgot password
router.post("/forgot-password", authController.forgotPassword);

// Reset password (requires reset token middleware)
router.post("/reset-password", authController.resetPassword);

// ==================== TOKEN VERIFICATION ====================

// Verify authentication token
router.get("/verify-token", authenticate, authController.verifyToken);

module.exports = router;
