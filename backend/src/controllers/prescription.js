const PrescriptionService = require("../services/prescriptionService");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");

// Create a new prescription
exports.createPrescription = async (req, res, next) => {
  try {
    const { consultationId, diagnosis, medications, instructions, dosage, duration, refills, notes, sideEffects, contraindications } = req.body;

    // Validate required fields
    if (!consultationId) {
      throw new BadRequestError("Consultation ID is required");
    }

    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      throw new BadRequestError("At least one medication is required");
    }

    // Create prescription data
    const prescriptionData = {
      consultationId,
      diagnosis,
      medications,
      instructions,
      dosage,
      duration,
      refills: refills || 0,
      notes,
      sideEffects,
      contraindications,
      status: "active",
      startDate: new Date(),
    };

    // Create prescription
    const prescription = await PrescriptionService.createPrescription(prescriptionData);

    res.status(201).json({
      status: "success",
      message: "Prescription created successfully",
      data: {
        prescription: {
          id: prescription.id,
          consultationId: prescription.consultationId,
          status: prescription.status,
          createdAt: prescription.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get prescription by ID
exports.getPrescriptionById = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await PrescriptionService.getPrescriptionById(prescriptionId);

    res.status(200).json({
      status: "success",
      data: {
        prescription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get prescriptions by consultation ID
exports.getPrescriptionsByConsultation = async (req, res, next) => {
  try {
    const { consultationId } = req.params;

    const prescriptions = await PrescriptionService.getPrescriptionsByConsultation(consultationId);

    res.status(200).json({
      status: "success",
      data: {
        prescriptions,
        count: prescriptions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update prescription
exports.updatePrescription = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;
    const updateData = req.body;

    const prescription = await PrescriptionService.updatePrescription(prescriptionId, updateData);

    res.status(200).json({
      status: "success",
      message: "Prescription updated successfully",
      data: {
        prescription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete prescription
exports.deletePrescription = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;

    await PrescriptionService.deletePrescription(prescriptionId);

    res.status(200).json({
      status: "success",
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Generate prescription PDF
exports.generatePrescriptionPDF = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;

    // This will be implemented as an async task
    // For now, return a placeholder response
    res.status(200).json({
      status: "success",
      message: "Prescription PDF generation started",
      data: {
        prescriptionId,
        status: "processing",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get prescription statistics
exports.getPrescriptionStats = async (req, res, next) => {
  try {
    const { doctorId, patientId } = req.query;

    const stats = await PrescriptionService.getPrescriptionStats(doctorId, patientId);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};
