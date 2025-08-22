const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const contactInformationController = require("../controllers/contactInformation");

const router = express.Router();

// Public routes (for registration forms)
router.get(
  "/options",
  contactInformationController.getContactInformationOptions
);

// Admin-only routes
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin"]),
  contactInformationController.getAllContactInformation
);

router.get(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  contactInformationController.getContactInformationById
);

router.post(
  "/",
  authenticateUser,
  authorizeRoles(["admin"]),
  contactInformationController.createContactInformation
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  contactInformationController.updateContactInformation
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  contactInformationController.deleteContactInformation
);

module.exports = router;
