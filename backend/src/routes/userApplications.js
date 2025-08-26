const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const userApplicationController = require("../controllers/userApplication");

// All routes require authentication
router.use(authenticateUser);

// Get user's application status
router.get("/me", userApplicationController.getUserApplication);

// Refresh application status
router.post("/me/refresh", userApplicationController.refreshApplicationStatus);

// Activate account after approval
router.post("/me/activate", userApplicationController.activateAccount);

// Reapply for rejected application
router.post("/me/reapply", userApplicationController.reapplyApplication);

// Get application timeline/history
router.get("/me/timeline", userApplicationController.getApplicationTimeline);

// Download application document
router.get(
  "/me/documents/:documentId/download",
  userApplicationController.downloadDocument
);

// Get application statistics
router.get("/me/stats", userApplicationController.getApplicationStats);

// Legacy routes for backward compatibility
router.get("/user", userApplicationController.getUserApplication);
router.get("/:id/status", userApplicationController.getApplicationStatus);
router.put("/:id/reapply", userApplicationController.reapplyApplication);
router.post("/:id/activate", userApplicationController.activateAccount);
router.delete("/:id", userApplicationController.cancelApplication);

module.exports = router;
