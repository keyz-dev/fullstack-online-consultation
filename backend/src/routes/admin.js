const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const adminController = require("../controllers/admin");

const router = express.Router();

// All routes require admin authentication
router.use(authenticateUser, authorizeRoles(["admin"]));

// Application management routes
router.get("/applications", adminController.getAllApplications);
router.get("/applications/stats", adminController.getApplicationStats);
router.get("/applications/:id", adminController.getApplication);
router.put("/applications/:id/review", adminController.reviewApplication);

module.exports = router;
