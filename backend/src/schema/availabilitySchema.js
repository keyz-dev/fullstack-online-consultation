const Joi = require("joi");

// Single availability validation schema
const availabilitySchema = Joi.object({
  dayOfWeek: Joi.number().min(0).max(6).required().messages({
    "number.base": "Day of week must be a number",
    "number.min": "Day of week must be between 0 and 6 (0=Sunday, 6=Saturday)",
    "number.max": "Day of week must be between 0 and 6 (0=Sunday, 6=Saturday)",
    "any.required": "Day of week is required",
  }),
  startTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Start time must be in HH:MM format",
      "any.required": "Start time is required",
    }),
  endTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "End time must be in HH:MM format",
      "any.required": "End time is required",
    }),
  consultationDuration: Joi.number().min(15).max(120).default(30).messages({
    "number.base": "Consultation duration must be a number",
    "number.min": "Consultation duration must be at least 15 minutes",
    "number.max": "Consultation duration cannot exceed 120 minutes",
  }),
  consultationType: Joi.string()
    .valid("online", "physical", "both")
    .default("online")
    .messages({
      "string.base": "Consultation type must be a string",
      "any.only": "Consultation type must be 'online', 'physical', or 'both'",
    }),
  consultationFee: Joi.number().min(0).default(0).messages({
    "number.base": "Consultation fee must be a number",
    "number.min": "Consultation fee cannot be negative",
  }),
  maxPatients: Joi.number().min(1).optional().messages({
    "number.base": "Max patients must be a number",
    "number.min": "Max patients must be at least 1",
  }),
});

// Multiple availabilities validation schema
const multipleAvailabilitiesSchema = Joi.object({
  availabilities: Joi.array()
    .items(availabilitySchema)
    .min(1)
    .required()
    .messages({
      "array.base": "Availabilities must be an array",
      "array.min": "At least one availability is required",
      "any.required": "Availabilities are required",
    }),
});

// Update availability schema (all fields optional)
const updateAvailabilitySchema = Joi.object({
  dayOfWeek: Joi.number().min(0).max(6).optional().messages({
    "number.base": "Day of week must be a number",
    "number.min": "Day of week must be between 0 and 6 (0=Sunday, 6=Saturday)",
    "number.max": "Day of week must be between 0 and 6 (0=Sunday, 6=Saturday)",
  }),
  startTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      "string.pattern.base": "Start time must be in HH:MM format",
    }),
  endTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      "string.pattern.base": "End time must be in HH:MM format",
    }),
  consultationDuration: Joi.number().min(15).max(120).optional().messages({
    "number.base": "Consultation duration must be a number",
    "number.min": "Consultation duration must be at least 15 minutes",
    "number.max": "Consultation duration cannot exceed 120 minutes",
  }),
  consultationType: Joi.string()
    .valid("online", "physical", "both")
    .optional()
    .messages({
      "string.base": "Consultation type must be a string",
      "any.only": "Consultation type must be 'online', 'physical', or 'both'",
    }),
  consultationFee: Joi.number().min(0).optional().messages({
    "number.base": "Consultation fee must be a number",
    "number.min": "Consultation fee cannot be negative",
  }),
  maxPatients: Joi.number().min(1).optional().messages({
    "number.base": "Max patients must be a number",
    "number.min": "Max patients must be at least 1",
  }),
  isAvailable: Joi.boolean().optional().messages({
    "boolean.base": "Is available must be a boolean",
  }),
});

// Invalidation schema
const invalidationSchema = Joi.object({
  invalidationReason: Joi.string().min(1).max(500).required().messages({
    "string.base": "Invalidation reason must be a string",
    "string.min": "Invalidation reason must be at least 1 character",
    "string.max": "Invalidation reason cannot exceed 500 characters",
    "any.required": "Invalidation reason is required",
  }),
});

module.exports = {
  availabilitySchema,
  multipleAvailabilitiesSchema,
  updateAvailabilitySchema,
  invalidationSchema,
};
