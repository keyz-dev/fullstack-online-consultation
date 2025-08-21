const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");

// Get home page data (specialties, symptoms, testimonials, stats, services)
router.get("/data", homeController.getHomeData);

// Get all specialties
router.get("/specialties", homeController.getSpecialties);

// Get specialty details by ID
router.get("/specialties/:id", homeController.getSpecialtyDetails);

// Get all symptoms
router.get("/symptoms", homeController.getSymptoms);

module.exports = router;
