const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const userApplicationController = require("../controllers/userApplication");

// All routes require authentication
router.use(authenticateUser);

// Get user's application status
router.get("/user", userApplicationController.getUserApplication);

// Get specific application status
router.get("/:id/status", userApplicationController.getApplicationStatus);

// Reapply for rejected application
router.put("/:id/reapply", userApplicationController.reapplyApplication);

// Activate account after approval
router.post("/:id/activate", userApplicationController.activateAccount);

// Cancel application
router.delete("/:id", userApplicationController.cancelApplication);

module.exports = router;
