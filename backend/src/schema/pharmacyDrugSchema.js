const Joi = require("joi");

// ==================== PHARMACY DRUG VALIDATION SCHEMAS ====================

// Base medication schema
const baseMedicationSchema = {
  name: Joi.string().min(1).max(255).required().messages({
    "string.min": "Medication name must be at least 1 character long",
    "string.max": "Medication name cannot exceed 255 characters",
    "any.required": "Medication name is required",
  }),
  genericName: Joi.string().max(255).optional().allow(null, "").messages({
    "string.max": "Generic name cannot exceed 255 characters",
  }),
  description: Joi.string().max(2000).optional().allow(null, "").messages({
    "string.max": "Description cannot exceed 2000 characters",
  }),
  dosageForm: Joi.string().max(100).optional().allow(null, "").messages({
    "string.max": "Dosage form cannot exceed 100 characters",
  }),
  strength: Joi.string().max(100).optional().allow(null, "").messages({
    "string.max": "Strength cannot exceed 100 characters",
  }),
  manufacturer: Joi.string().max(255).optional().allow(null, "").messages({
    "string.max": "Manufacturer cannot exceed 255 characters",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a valid number",
    "number.positive": "Price must be positive",
    "any.required": "Price is required",
  }),
  currency: Joi.string().length(3).uppercase().default("USD").messages({
    "string.length": "Currency must be 3 characters long",
    "string.uppercase": "Currency must be uppercase",
  }),
  stockQuantity: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Stock quantity must be a valid number",
    "number.integer": "Stock quantity must be a whole number",
    "number.min": "Stock quantity cannot be negative",
  }),
  isAvailable: Joi.boolean().default(true).messages({
    "boolean.base": "Availability must be true or false",
  }),
  requiresPrescription: Joi.boolean().default(false).messages({
    "boolean.base": "Prescription requirement must be true or false",
  }),
  category: Joi.string().max(100).optional().allow(null, "").messages({
    "string.max": "Category cannot exceed 100 characters",
  }),
  sideEffects: Joi.array().items(Joi.string().max(500)).optional().default([]).messages({
    "array.base": "Side effects must be an array",
    "string.max": "Each side effect cannot exceed 500 characters",
  }),
  contraindications: Joi.array().items(Joi.string().max(500)).optional().default([]).messages({
    "array.base": "Contraindications must be an array",
    "string.max": "Each contraindication cannot exceed 500 characters",
  }),
  expiryDate: Joi.date().greater("now").optional().allow(null, "").messages({
    "date.base": "Expiry date must be a valid date",
    "date.greater": "Expiry date must be in the future",
  }),
};

// Create medication schema
const createMedicationSchema = Joi.object({
  ...baseMedicationSchema,
});

// Update medication schema (all fields optional)
const updateMedicationSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional().messages({
    "string.min": "Medication name must be at least 1 character long",
    "string.max": "Medication name cannot exceed 255 characters",
  }),
  genericName: Joi.string().max(255).optional().allow(null, "").messages({
    "string.max": "Generic name cannot exceed 255 characters",
  }),
  description: Joi.string().max(2000).optional().allow(null, "").messages({
    "string.max": "Description cannot exceed 2000 characters",
  }),
  dosageForm: Joi.string().max(100).optional().allow(null, "").messages({
    "string.max": "Dosage form cannot exceed 100 characters",
  }),
  strength: Joi.string().max(100).optional().allow(null, "").messages({
    "string.max": "Strength cannot exceed 100 characters",
  }),
  manufacturer: Joi.string().max(255).optional().allow(null, "").messages({
    "string.max": "Manufacturer cannot exceed 255 characters",
  }),
  price: Joi.number().positive().optional().messages({
    "number.base": "Price must be a valid number",
    "number.positive": "Price must be positive",
  }),
  currency: Joi.string().length(3).uppercase().optional().messages({
    "string.length": "Currency must be 3 characters long",
    "string.uppercase": "Currency must be uppercase",
  }),
  stockQuantity: Joi.number().integer().min(0).optional().messages({
    "number.base": "Stock quantity must be a valid number",
    "number.integer": "Stock quantity must be a whole number",
    "number.min": "Stock quantity cannot be negative",
  }),
  isAvailable: Joi.boolean().optional().messages({
    "boolean.base": "Availability must be true or false",
  }),
  requiresPrescription: Joi.boolean().optional().messages({
    "boolean.base": "Prescription requirement must be true or false",
  }),
  category: Joi.string().max(100).optional().allow(null, "").messages({
    "string.max": "Category cannot exceed 100 characters",
  }),
  sideEffects: Joi.array().items(Joi.string().max(500)).optional().messages({
    "array.base": "Side effects must be an array",
    "string.max": "Each side effect cannot exceed 500 characters",
  }),
  contraindications: Joi.array().items(Joi.string().max(500)).optional().messages({
    "array.base": "Contraindications must be an array",
    "string.max": "Each contraindication cannot exceed 500 characters",
  }),
  expiryDate: Joi.date().greater("now").optional().allow(null, "").messages({
    "date.base": "Expiry date must be a valid date",
    "date.greater": "Expiry date must be in the future",
  }),
});

// Stock update schema
const stockUpdateSchema = Joi.object({
  stockQuantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock quantity must be a valid number",
    "number.integer": "Stock quantity must be a whole number",
    "number.min": "Stock quantity cannot be negative",
    "any.required": "Stock quantity is required",
  }),
});

// Query parameters schema for filtering
const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a valid number",
    "number.integer": "Page must be a whole number",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a valid number",
    "number.integer": "Limit must be a whole number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
  search: Joi.string().max(255).optional().allow("").messages({
    "string.max": "Search term cannot exceed 255 characters",
  }),
  category: Joi.string().max(100).optional().allow("").messages({
    "string.max": "Category cannot exceed 100 characters",
  }),
  isAvailable: Joi.string().valid("true", "false").optional().messages({
    "any.only": "Availability filter must be 'true' or 'false'",
  }),
  requiresPrescription: Joi.string().valid("true", "false").optional().messages({
    "any.only": "Prescription filter must be 'true' or 'false'",
  }),
});

// Bulk import validation schema
const bulkImportSchema = Joi.object({
  medications: Joi.array().items(
    Joi.object({
      name: Joi.string().min(1).max(255).required().messages({
        "string.min": "Medication name must be at least 1 character long",
        "string.max": "Medication name cannot exceed 255 characters",
        "any.required": "Medication name is required",
      }),
      price: Joi.number().positive().required().messages({
        "number.base": "Price must be a valid number",
        "number.positive": "Price must be positive",
        "any.required": "Price is required",
      }),
      stockQuantity: Joi.number().integer().min(0).default(0).messages({
        "number.base": "Stock quantity must be a valid number",
        "number.integer": "Stock quantity must be a whole number",
        "number.min": "Stock quantity cannot be negative",
      }),
      // Other fields are optional for bulk import
      genericName: Joi.string().max(255).optional().allow(null, ""),
      description: Joi.string().max(2000).optional().allow(null, ""),
      dosageForm: Joi.string().max(100).optional().allow(null, ""),
      strength: Joi.string().max(100).optional().allow(null, ""),
      manufacturer: Joi.string().max(255).optional().allow(null, ""),
      currency: Joi.string().length(3).uppercase().default("USD"),
      requiresPrescription: Joi.boolean().default(false),
      category: Joi.string().max(100).optional().allow(null, ""),
      sideEffects: Joi.array().items(Joi.string().max(500)).optional().default([]),
      contraindications: Joi.array().items(Joi.string().max(500)).optional().default([]),
      expiryDate: Joi.date().greater("now").optional().allow(null, ""),
    })
  ).min(1).required().messages({
    "array.min": "At least one medication is required",
    "any.required": "Medications array is required",
  }),
});

// Validation functions
const validatePharmacyDrug = (data, isUpdate = false) => {
  const schema = isUpdate ? updateMedicationSchema : createMedicationSchema;
  return schema.validate(data, { abortEarly: false });
};

const validateStockUpdate = (data) => {
  return stockUpdateSchema.validate(data, { abortEarly: false });
};

const validateQueryParams = (data) => {
  return queryParamsSchema.validate(data, { abortEarly: false });
};

const validateBulkImport = (data) => {
  return bulkImportSchema.validate(data, { abortEarly: false });
};

module.exports = {
  createMedicationSchema,
  updateMedicationSchema,
  stockUpdateSchema,
  queryParamsSchema,
  bulkImportSchema,
  validatePharmacyDrug,
  validateStockUpdate,
  validateQueryParams,
  validateBulkImport,
};
