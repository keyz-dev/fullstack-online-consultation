const { PharmacyDrug, Pharmacy } = require("../db/models");
const { Op } = require("sequelize");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const { BadRequestError } = require("../utils/errors");

// ==================== PHARMACY DRUG SERVICE ====================

class PharmacyDrugService {
  // Get all medications for a pharmacy with pagination and filtering
  static async getPharmacyDrugs(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add pharmacy filter
    if (filters.pharmacyId) {
      whereClause.pharmacyId = filters.pharmacyId;
    }

    // Add search filter
    if (filters.search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { genericName: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    // Add category filter
    if (filters.category) {
      whereClause.category = filters.category;
    }

    // Add availability filter
    if (filters.isAvailable !== undefined) {
      whereClause.isAvailable = filters.isAvailable;
    }

    // Add prescription requirement filter
    if (filters.requiresPrescription !== undefined) {
      whereClause.requiresPrescription = filters.requiresPrescription;
    }

    const { count, rows } = await PharmacyDrug.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      medications: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    };
  }

  // Get medication statistics for a pharmacy
  static async getPharmacyDrugStats(pharmacyId) {
    const [
      total,
      available,
      outOfStock,
      expiringSoon,
      requiresPrescription,
      overTheCounter,
    ] = await Promise.all([
      PharmacyDrug.count({ where: { pharmacyId } }),
      PharmacyDrug.count({
        where: { pharmacyId, isAvailable: true, stockQuantity: { [Op.gt]: 0 } },
      }),
      PharmacyDrug.count({
        where: { pharmacyId, stockQuantity: 0 },
      }),
      PharmacyDrug.count({
        where: {
          pharmacyId,
          expiryDate: {
            [Op.between]: [new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)],
          },
        },
      }),
      PharmacyDrug.count({
        where: { pharmacyId, requiresPrescription: true },
      }),
      PharmacyDrug.count({
        where: { pharmacyId, requiresPrescription: false },
      }),
    ]);

    return {
      total,
      available,
      outOfStock,
      expiringSoon,
      requiresPrescription,
      overTheCounter,
    };
  }

  // Get a single medication by ID
  static async getPharmacyDrug(id, pharmacyId) {
    return await PharmacyDrug.findOne({
      where: { id, pharmacyId },
    });
  }

  // Create a new medication
  static async createPharmacyDrug(medicationData) {
    // Set isAvailable based on stock quantity
    if (medicationData.stockQuantity === 0) {
      medicationData.isAvailable = false;
    }

    return await PharmacyDrug.create(medicationData);
  }

  // Update a medication
  static async updatePharmacyDrug(id, pharmacyId, updateData) {
    const medication = await PharmacyDrug.findOne({
      where: { id, pharmacyId },
    });

    if (!medication) {
      return null;
    }

    // Set isAvailable based on stock quantity
    if (updateData.stockQuantity !== undefined) {
      updateData.isAvailable = updateData.stockQuantity > 0;
    }

    await medication.update(updateData);
    return medication;
  }

  // Delete a medication
  static async deletePharmacyDrug(id, pharmacyId) {
    const medication = await PharmacyDrug.findOne({
      where: { id, pharmacyId },
    });

    if (!medication) {
      return false;
    }

    await medication.destroy();
    return true;
  }

  // Update medication stock
  static async updateMedicationStock(id, pharmacyId, stockQuantity) {
    const medication = await PharmacyDrug.findOne({
      where: { id, pharmacyId },
    });

    if (!medication) {
      return null;
    }

    await medication.updateStock(stockQuantity);
    return medication;
  }

  // Bulk import medications from Excel/CSV file
  static async bulkImportPharmacyDrugs(pharmacyId, filePath) {
    try {
      // Read the file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        throw new BadRequestError("File is empty or invalid format");
      }

      const errors = [];
      const imported = [];
      let total = data.length;

      // Process each row
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const rowNumber = i + 2; // +2 because Excel is 1-indexed and we have headers

        try {
          // Validate required fields
          if (!row.name) {
            errors.push(`Row ${rowNumber}: Medication name is required`);
            continue;
          }

          if (!row.price || isNaN(parseFloat(row.price))) {
            errors.push(`Row ${rowNumber}: Valid price is required`);
            continue;
          }

          if (row.stockQuantity !== undefined && isNaN(parseInt(row.stockQuantity))) {
            errors.push(`Row ${rowNumber}: Valid stock quantity is required`);
            continue;
          }

          // Prepare medication data
          const medicationData = {
            pharmacyId,
            name: row.name.trim(),
            genericName: row.genericName?.trim() || null,
            description: row.description?.trim() || null,
            dosageForm: row.dosageForm?.trim() || null,
            strength: row.strength?.trim() || null,
            manufacturer: row.manufacturer?.trim() || null,
            price: parseFloat(row.price),
            currency: row.currency?.toUpperCase() || "USD",
            stockQuantity: parseInt(row.stockQuantity) || 0,
            isAvailable: (parseInt(row.stockQuantity) || 0) > 0,
            requiresPrescription: row.requiresPrescription === "true" || row.requiresPrescription === true,
            category: row.category?.trim() || null,
            sideEffects: row.sideEffects ? row.sideEffects.split(",").map(s => s.trim()) : [],
            contraindications: row.contraindications ? row.contraindications.split(",").map(c => c.trim()) : [],
            expiryDate: row.expiryDate ? new Date(row.expiryDate) : null,
          };

          // Validate expiry date
          if (medicationData.expiryDate && medicationData.expiryDate <= new Date()) {
            errors.push(`Row ${rowNumber}: Expiry date must be in the future`);
            continue;
          }

          // Create medication
          const medication = await PharmacyDrug.create(medicationData);
          imported.push(medication);

        } catch (error) {
          errors.push(`Row ${rowNumber}: ${error.message}`);
        }
      }

      // Clean up file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return {
        imported: imported.length,
        errors,
        total,
      };
    } catch (error) {
      // Clean up file on error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }

  // Generate Excel template for medication import
  static async generateTemplate() {
    const templateData = [
      {
        name: "Paracetamol 500mg",
        genericName: "Acetaminophen",
        description: "Pain reliever and fever reducer",
        dosageForm: "Tablet",
        strength: "500mg",
        manufacturer: "Generic Pharma",
        price: "5.99",
        currency: "USD",
        stockQuantity: "100",
        requiresPrescription: "false",
        category: "Pain Relief",
        sideEffects: "Nausea, Stomach upset",
        contraindications: "Liver disease, Alcohol use",
        expiryDate: "2025-12-31",
      },
      {
        name: "Amoxicillin 250mg",
        genericName: "Amoxicillin",
        description: "Antibiotic for bacterial infections",
        dosageForm: "Capsule",
        strength: "250mg",
        manufacturer: "MedCorp",
        price: "12.50",
        currency: "USD",
        stockQuantity: "50",
        requiresPrescription: "true",
        category: "Antibiotics",
        sideEffects: "Diarrhea, Rash",
        contraindications: "Penicillin allergy",
        expiryDate: "2025-06-30",
      },
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Medications");

    // Add headers row
    const headers = [
      "name",
      "genericName",
      "description",
      "dosageForm",
      "strength",
      "manufacturer",
      "price",
      "currency",
      "stockQuantity",
      "requiresPrescription",
      "category",
      "sideEffects",
      "contraindications",
      "expiryDate",
    ];

    // Insert headers at the beginning
    xlsx.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    const templatePath = path.join(__dirname, "../uploads/templates/medication_import_template.xlsx");
    
    // Ensure directory exists
    const dir = path.dirname(templatePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    xlsx.writeFile(workbook, templatePath);
    return templatePath;
  }

  // Get medication categories for a pharmacy
  static async getMedicationCategories(pharmacyId) {
    const categories = await PharmacyDrug.findAll({
      where: { pharmacyId },
      attributes: [[PharmacyDrug.sequelize.fn("DISTINCT", PharmacyDrug.sequelize.col("category")), "category"]],
      raw: true,
    });

    return categories
      .map(cat => cat.category)
      .filter(cat => cat && cat.trim() !== "")
      .sort();
  }

  // Get expiring medications (within 30 days)
  static async getExpiringMedications(pharmacyId) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return await PharmacyDrug.findAll({
      where: {
        pharmacyId,
        expiryDate: {
          [Op.between]: [new Date(), thirtyDaysFromNow],
        },
      },
      order: [["expiryDate", "ASC"]],
    });
  }

  // Get low stock medications (less than 10 units)
  static async getLowStockMedications(pharmacyId) {
    return await PharmacyDrug.findAll({
      where: {
        pharmacyId,
        stockQuantity: {
          [Op.lt]: 10,
        },
        stockQuantity: {
          [Op.gt]: 0,
        },
      },
      order: [["stockQuantity", "ASC"]],
    });
  }
}

module.exports = PharmacyDrugService;
