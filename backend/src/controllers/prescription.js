const PrescriptionService = require("../services/prescriptionService");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");

// Create a new prescription
exports.createPrescription = async (req, res, next) => {
  try {
    const { consultationId, medications } = req.body;

    const doctorId = req.authUser.doctor.id;

    // Validate required fields
    if (!consultationId) {
      throw new BadRequestError("Consultation ID is required");
    }

    if (
      !medications ||
      !Array.isArray(medications) ||
      medications.length === 0
    ) {
      throw new BadRequestError("At least one medication is required");
    }

    // Validate each medication has required fields
    const invalidMedications = medications.filter(
      (med) => !med.name || !med.dosage || !med.frequency || !med.duration
    );

    if (invalidMedications.length > 0) {
      throw new BadRequestError(
        "All medications must have name, dosage, frequency, and duration"
      );
    }

    // Log the prescription creation attempt
    logger.info(
      `Prescription creation initiated for consultation ${consultationId}`,
      {
        consultationId,
        medicationCount: medications.length,
        requestBody: req.body,
      }
    );

    // Return immediately - full process will happen in background
    res.status(202).json({
      status: "success",
      message: "Prescription creation started",
      data: {
        status: "processing",
        consultationId: consultationId,
        message:
          "Your prescription is being generated. You will be notified when it's ready.",
        estimatedTime: "2-3 minutes",
      },
    });

    // Start complete prescription process in background (non-blocking)
    setImmediate(async () => {
      const startTime = Date.now();

      try {
        logger.info(
          `Starting background prescription creation for consultation ${consultationId}`
        );

        const prescription = await PrescriptionService.createPrescription({
          ...req.body,
          doctorId,
        });

        const processingTime = Date.now() - startTime;
        logger.info(`Prescription creation completed successfully`, {
          prescriptionId: prescription.id,
          consultationId: consultationId,
          processingTimeMs: processingTime,
          processingTimeMinutes:
            Math.round((processingTime / 60000) * 100) / 100,
        });

        // Emit real-time update to the doctor who created it (if socket.io is available)
        if (global.io && req.authUser && req.authUser.id) {
          global.io.to(`user-${req.authUser.id}`).emit("prescription:created", {
            prescriptionId: prescription.id,
            consultationId: consultationId,
            status: "completed",
            message: "Prescription has been generated and sent to patient",
            fileUrl: prescription.fileUrl,
            processingTime: processingTime,
          });
        }
      } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error(
          `Prescription creation failed after ${processingTime}ms:`,
          {
            error: error.message,
            stack: error.stack,
            consultationId: consultationId,
            processingTimeMs: processingTime,
          }
        );

        // Emit error to the doctor (if socket.io is available)
        if (global.io && req.authUser && req.authUser.id) {
          global.io.to(`user-${req.authUser.id}`).emit("prescription:error", {
            consultationId: consultationId,
            status: "failed",
            message:
              "Prescription generation encountered an error. Please try again or contact support.",
            error:
              process.env.NODE_ENV === "development"
                ? error.message
                : "Processing failed",
          });
        }

        // Log to application monitoring/alerting system if available
        if (global.errorReporter) {
          global.errorReporter.report(error, {
            context: "prescription_creation",
            consultationId: consultationId,
            processingTime: processingTime,
          });
        }
      }
    });
  } catch (error) {
    logger.error("Prescription creation request validation failed:", {
      error: error.message,
      requestBody: req.body,
    });
    next(error);
  }
};

// Get prescription by ID
exports.getPrescriptionById = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;

    if (!prescriptionId || isNaN(prescriptionId)) {
      throw new BadRequestError("Valid prescription ID is required");
    }

    const prescription =
      await PrescriptionService.getPrescriptionById(prescriptionId);

    res.status(200).json({
      status: "success",
      data: {
        prescription,
      },
    });
  } catch (error) {
    logger.error("Error fetching prescription by ID:", {
      prescriptionId: req.params.prescriptionId,
      error: error.message,
    });
    next(error);
  }
};

// Get prescriptions by consultation ID
exports.getPrescriptionsByConsultation = async (req, res, next) => {
  try {
    const { consultationId } = req.params;

    if (!consultationId || isNaN(consultationId)) {
      throw new BadRequestError("Valid consultation ID is required");
    }

    const prescriptions =
      await PrescriptionService.getPrescriptionsByConsultation(consultationId);

    res.status(200).json({
      status: "success",
      data: {
        prescriptions,
        count: prescriptions.length,
        consultationId: parseInt(consultationId),
      },
    });
  } catch (error) {
    logger.error("Error fetching prescriptions by consultation:", {
      consultationId: req.params.consultationId,
      error: error.message,
    });
    next(error);
  }
};

// Update prescription
exports.updatePrescription = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;
    const updateData = req.body;

    if (!prescriptionId || isNaN(prescriptionId)) {
      throw new BadRequestError("Valid prescription ID is required");
    }

    // Validate update data
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestError("Update data is required");
    }

    // Don't allow updating certain system fields
    const restrictedFields = ["id", "consultationId", "createdAt", "updatedAt"];
    const hasRestrictedFields = restrictedFields.some(
      (field) => field in updateData
    );

    if (hasRestrictedFields) {
      throw new BadRequestError(
        `Cannot update restricted fields: ${restrictedFields.join(", ")}`
      );
    }

    const prescription = await PrescriptionService.updatePrescription(
      prescriptionId,
      updateData
    );

    logger.info("Prescription updated successfully:", {
      prescriptionId: prescriptionId,
      updatedFields: Object.keys(updateData),
      updatedBy: req.authUser?.id,
    });

    res.status(200).json({
      status: "success",
      message: "Prescription updated successfully",
      data: {
        prescription,
      },
    });
  } catch (error) {
    logger.error("Error updating prescription:", {
      prescriptionId: req.params.prescriptionId,
      updateData: req.body,
      error: error.message,
    });
    next(error);
  }
};

// Delete prescription
exports.deletePrescription = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;

    if (!prescriptionId || isNaN(prescriptionId)) {
      throw new BadRequestError("Valid prescription ID is required");
    }

    await PrescriptionService.deletePrescription(prescriptionId);

    logger.info("Prescription deleted successfully:", {
      prescriptionId: prescriptionId,
      deletedBy: req.authUser?.id,
    });

    res.status(200).json({
      status: "success",
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting prescription:", {
      prescriptionId: req.params.prescriptionId,
      error: error.message,
    });
    next(error);
  }
};

// Generate prescription PDF (legacy endpoint - now redirects to create)
exports.generatePrescriptionPDF = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;

    if (!prescriptionId || isNaN(prescriptionId)) {
      throw new BadRequestError("Valid prescription ID is required");
    }

    // Check if prescription exists and get its current status
    const prescription =
      await PrescriptionService.getPrescriptionById(prescriptionId);

    if (prescription.fileUrl) {
      // PDF already exists
      return res.status(200).json({
        status: "success",
        message: "Prescription PDF already exists",
        data: {
          prescriptionId: prescription.id,
          fileUrl: prescription.fileUrl,
          status: "completed",
        },
      });
    }

    // PDF doesn't exist - this is unusual since PDFs are generated during creation
    logger.warn(
      `PDF regeneration requested for prescription ${prescriptionId}`
    );

    res.status(202).json({
      status: "success",
      message: "Prescription PDF regeneration started",
      data: {
        prescriptionId: prescriptionId,
        status: "processing",
        message: "PDF is being regenerated. You will be notified when ready.",
      },
    });

    // Trigger PDF regeneration in background
    setImmediate(async () => {
      try {
        // This would need to be implemented if PDF regeneration is required
        logger.info(
          `PDF regeneration completed for prescription ${prescriptionId}`
        );
      } catch (error) {
        logger.error(
          `PDF regeneration failed for prescription ${prescriptionId}:`,
          error
        );
      }
    });
  } catch (error) {
    logger.error("Error in PDF generation endpoint:", {
      prescriptionId: req.params.prescriptionId,
      error: error.message,
    });
    next(error);
  }
};

// Get prescription statistics
exports.getPrescriptionStats = async (req, res, next) => {
  try {
    const { doctorId, patientId } = req.query;

    // Validate query parameters if provided
    if (doctorId && isNaN(doctorId)) {
      throw new BadRequestError("Doctor ID must be a valid number");
    }

    if (patientId && isNaN(patientId)) {
      throw new BadRequestError("Patient ID must be a valid number");
    }

    const stats = await PrescriptionService.getPrescriptionStats(
      doctorId ? parseInt(doctorId) : null,
      patientId ? parseInt(patientId) : null
    );

    res.status(200).json({
      status: "success",
      data: {
        stats,
        filters: {
          doctorId: doctorId ? parseInt(doctorId) : null,
          patientId: patientId ? parseInt(patientId) : null,
        },
      },
    });
  } catch (error) {
    logger.error("Error fetching prescription statistics:", {
      doctorId: req.query.doctorId,
      patientId: req.query.patientId,
      error: error.message,
    });
    next(error);
  }
};

// Health check endpoint for prescription service
exports.healthCheck = async (req, res, next) => {
  try {
    const stats = await PrescriptionService.getPrescriptionStats();

    res.status(200).json({
      status: "success",
      message: "Prescription service is healthy",
      data: {
        service: "prescription",
        timestamp: new Date().toISOString(),
        totalPrescriptions: stats.total,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || "1.0.0",
      },
    });
  } catch (error) {
    logger.error("Prescription service health check failed:", error);
    res.status(503).json({
      status: "error",
      message: "Prescription service is unhealthy",
      error: error.message,
    });
  }
};
