const { PharmacyDrug, Pharmacy } = require("../db/models");
const PharmacyDrugService = require("../services/pharmacyDrugService");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const { validatePharmacyDrug, validateBulkImport } = require("../schema/pharmacyDrugSchema");
const { handleFileUploads } = require("../utils/documentUtil");
const { cleanUpFileImages, cleanUpInstanceImages } = require("../utils/imageCleanup");

// ==================== PHARMACY DRUG CONTROLLER ====================

// Get all medications for a pharmacy with pagination and filtering
exports.getPharmacyDrugs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, isAvailable, requiresPrescription } = req.query;
    const pharmacyId = req.authUser.pharmacy?.id;

    if (!pharmacyId) {
      throw new BadRequestError("Pharmacy not found");
    }

    const filters = {
      pharmacyId,
      search,
      category,
      isAvailable: isAvailable === 'true' ? true : isAvailable === 'false' ? false : undefined,
      requiresPrescription: requiresPrescription === 'true' ? true : requiresPrescription === 'false' ? false : undefined,
    };

    const result = await PharmacyDrugService.getPharmacyDrugs(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.status(200).json({
      status: "success",
      message: "Medications retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get medication statistics for a pharmacy
exports.getPharmacyDrugStats = async (req, res, next) => {
  try {
    const pharmacyId = req.authUser.pharmacy?.id;

    if (!pharmacyId) {
      throw new BadRequestError("Pharmacy not found");
    }

    const stats = await PharmacyDrugService.getPharmacyDrugStats(pharmacyId);

    res.status(200).json({
      status: "success",
      message: "Medication statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single medication by ID
exports.getPharmacyDrug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pharmacyId = req.authUser.pharmacy?.id;

    if (!pharmacyId) {
      throw new BadRequestError("Pharmacy not found");
    }

    const medication = await PharmacyDrugService.getPharmacyDrug(id, pharmacyId);

    if (!medication) {
      throw new NotFoundError("Medication not found");
    }

    res.status(200).json({
      status: "success",
      message: "Medication retrieved successfully",
      data: medication,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new medication
exports.createPharmacyDrug = async (req, res, next) => {
  try {
    const pharmacyId = req.authUser.pharmacy?.id;

    if (!pharmacyId) {
      throw new BadRequestError("Pharmacy not found");
    }

    // Validate request body
    const { error } = validatePharmacyDrug(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // Handle file uploads if any
    let imageUrl = null;
    if (req.files && req.files.medicationImage) {
      const uploadedFiles = await handleFileUploads(req.files);
      imageUrl = uploadedFiles.medicationImage;
    }

    const medicationData = {
      ...req.body,
      pharmacyId,
      imageUrl,
    };

    const medication = await PharmacyDrugService.createPharmacyDrug(medicationData);

    res.status(201).json({
      status: "success",
      message: "Medication created successfully",
      data: medication,
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
};

// Update a medication
exports.updatePharmacyDrug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pharmacyId = req.authUser.pharmacy?.id;

    if (!pharmacyId) {
      throw new BadRequestError("Pharmacy not found");
    }

    // Validate request body
    const { error } = validatePharmacyDrug(req.body, true);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // Handle file uploads if any
    let imageUrl = null;
    if (req.files && req.files.medicationImage) {
      const uploadedFiles = await handleFileUploads(req.files);
      imageUrl = uploadedFiles.medicationImage;
    }

    // Get the medication first to clean up old image if needed
    const existingMedication = await PharmacyDrugService.getPharmacyDrug(id, pharmacyId);
    if (!existingMedication) {
      throw new NotFoundError("Medication not found");
    }

    const updateData = {
      ...req.body,
      ...(imageUrl && { imageUrl }),
    };

    const medication = await PharmacyDrugService.updatePharmacyDrug(id, pharmacyId, updateData);

    // Clean up old image if a new one was uploaded
    if (imageUrl && existingMedication.imageUrl && existingMedication.imageUrl !== imageUrl) {
      await cleanUpInstanceImages([existingMedication.imageUrl]);
    }

    if (!medication) {
      throw new NotFoundError("Medication not found");
    }

    res.status(200).json({
      status: "success",
      message: "Medication updated successfully",
      data: medication,
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
};

// Delete a medication
exports.deletePharmacyDrug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pharmacyId = req.authUser.pharmacy?.id;

    if (!pharmacyId) {
      throw new BadRequestError("Pharmacy not found");
    }

    // Get the medication first to clean up its image
    const medication = await PharmacyDrugService.getPharmacyDrug(id, pharmacyId);
    if (!medication) {
      throw new NotFoundError("Medication not found");
    }

    const result = await PharmacyDrugService.deletePharmacyDrug(id, pharmacyId);

    if (!result) {
      throw new NotFoundError("Medication not found");
    }

    // Clean up associated image
    if (medication.imageUrl) {
      await cleanUpInstanceImages([medication.imageUrl]);
    }

    res.status(200).json({
      status: "success",
      message: "Medication deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Bulk import medications
exports.bulkImportPharmacyDrugs = async (req, res, next) => {
  try {
    const pharmacyId = req.authUser.pharmacy?.id;

    if (!pharmacyId) {
      throw new BadRequestError("Pharmacy not found");
    }

    // Handle file upload
    if (!req.files || !req.files.medicationFile) {
      throw new BadRequestError("Please upload a file");
    }

    const uploadedFiles = await handleFileUploads(req.files);
    const filePath = uploadedFiles.medicationFile;

    // Process bulk import
    const result = await PharmacyDrugService.bulkImportPharmacyDrugs(pharmacyId, filePath);

    res.status(200).json({
      status: "success",
      message: `Successfully imported ${result.imported} medications. ${result.errors.length} errors found.`,
      data: {
        imported: result.imported,
        errors: result.errors,
        total: result.total,
      },
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
};

// Download medication import template
exports.downloadTemplate = async (req, res, next) => {
  try {
    const templatePath = await PharmacyDrugService.generateTemplate();
    
    res.download(templatePath, "medication_import_template.xlsx", (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update medication stock
exports.updateMedicationStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stockQuantity } = req.body;
    const pharmacyId = req.authUser.pharmacy?.id;

    if (!pharmacyId) {
      throw new BadRequestError("Pharmacy not found");
    }

    if (stockQuantity === undefined || stockQuantity < 0) {
      throw new BadRequestError("Valid stock quantity is required");
    }

    const medication = await PharmacyDrugService.updateMedicationStock(id, pharmacyId, stockQuantity);

    if (!medication) {
      throw new NotFoundError("Medication not found");
    }

    res.status(200).json({
      status: "success",
      message: "Medication stock updated successfully",
      data: medication,
    });
  } catch (error) {
    next(error);
  }
};
