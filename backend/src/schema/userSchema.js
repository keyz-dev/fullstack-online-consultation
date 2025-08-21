const Joi = require("joi");

// Base user validation schema
const baseUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(255).messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 255 characters",
  }),
  gender: Joi.string().valid("male", "female", "other").optional(),
  dob: Joi.date().max("now").optional().messages({
    "date.max": "Date of birth cannot be in the future",
  }),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    postalCode: Joi.string().optional(),
  }).optional(),
});

// Admin registration schema
const adminRegisterSchema = baseUserSchema.keys({
  password: Joi.string().min(6).max(255).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 255 characters",
    "any.required": "Password is required",
  }),
});

// Patient registration schema
const patientRegisterSchema = baseUserSchema.keys({
  password: Joi.string().min(6).max(255).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 255 characters",
    "any.required": "Password is required",
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required(),
    relationship: Joi.string().required(),
  }).optional(),
});

// Doctor registration schema
const doctorRegisterSchema = baseUserSchema.keys({
  password: Joi.string().min(6).max(255).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 255 characters",
    "any.required": "Password is required",
  }),
  licenseNumber: Joi.string().min(5).max(50).required().messages({
    "string.min": "License number must be at least 5 characters long",
    "string.max": "License number cannot exceed 50 characters",
    "any.required": "License number is required",
  }),
  experience: Joi.number().integer().min(0).max(50).required().messages({
    "number.base": "Experience must be a number",
    "number.integer": "Experience must be a whole number",
    "number.min": "Experience cannot be negative",
    "number.max": "Experience cannot exceed 50 years",
    "any.required": "Experience is required",
  }),
  bio: Joi.string().max(2000).optional().messages({
    "string.max": "Bio cannot exceed 2000 characters",
  }),
  education: Joi.array().items(Joi.string()).optional(),
  languages: Joi.array().items(Joi.string()).min(1).optional().messages({
    "array.min": "At least one language must be specified",
  }),
  specialties: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "At least one specialty must be specified",
    "any.required": "Specialties are required",
  }),
  clinicAddress: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    postalCode: Joi.string().optional(),
  }).optional(),
  operationalHospital: Joi.string().max(200).optional().messages({
    "string.max": "Operational hospital name cannot exceed 200 characters",
  }),
  contactInfo: Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required(),
    whatsapp: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .optional(),
    website: Joi.string().uri().optional(),
  }).required(),
  consultationFee: Joi.number().positive().required().messages({
    "number.base": "Consultation fee must be a number",
    "number.positive": "Consultation fee must be positive",
    "any.required": "Consultation fee is required",
  }),
  consultationDuration: Joi.number()
    .integer()
    .min(15)
    .max(120)
    .default(30)
    .messages({
      "number.base": "Consultation duration must be a number",
      "number.integer": "Consultation duration must be a whole number",
      "number.min": "Consultation duration must be at least 15 minutes",
      "number.max": "Consultation duration cannot exceed 120 minutes",
    }),
  paymentMethods: Joi.object({
    mobile_money: Joi.boolean().default(false),
    card: Joi.boolean().default(false),
    bank_transfer: Joi.boolean().default(false),
    cash: Joi.boolean().default(false),
  }).optional(),
  documentNames: Joi.array().items(Joi.string()).optional(),
});

// Pharmacy registration schema
const pharmacyRegisterSchema = baseUserSchema.keys({
  password: Joi.string().min(6).max(255).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 255 characters",
    "any.required": "Password is required",
  }),
  pharmacyName: Joi.string().min(2).max(200).required().messages({
    "string.min": "Pharmacy name must be at least 2 characters long",
    "string.max": "Pharmacy name cannot exceed 200 characters",
    "any.required": "Pharmacy name is required",
  }),
  licenseNumber: Joi.string().min(5).max(50).required().messages({
    "string.min": "License number must be at least 5 characters long",
    "string.max": "License number cannot exceed 50 characters",
    "any.required": "License number is required",
  }),
  description: Joi.string().max(2000).optional().messages({
    "string.max": "Description cannot exceed 2000 characters",
  }),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    country: Joi.string().required(),
    postalCode: Joi.string().optional(),
  }).required(),
  contactInfo: Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required(),
    email: Joi.string().email().required(),
    whatsapp: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .optional(),
    website: Joi.string().uri().optional(),
  }).required(),
  deliveryInfo: Joi.object({
    deliveryRadius: Joi.number().positive().optional(),
    deliveryFee: Joi.number().min(0).optional(),
    deliveryTime: Joi.string().optional(),
    freeDeliveryThreshold: Joi.number().min(0).optional(),
  }).optional(),
  paymentMethods: Joi.array()
    .items(
      Joi.string().valid(
        "cash",
        "card",
        "mobile_money",
        "bank_transfer",
        "wallet"
      )
    )
    .default(["cash"])
    .optional(),
  documentNames: Joi.array().items(Joi.string()).optional(),
});

// Login schema
const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

// Google login schema
const googleLoginSchema = Joi.object({
  access_token: Joi.string().required().messages({
    "any.required": "Access token is required",
  }),
});

// Email verification schema
const emailVerificationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  code: Joi.string().length(6).required().messages({
    "string.length": "Verification code must be 6 characters long",
    "any.required": "Verification code is required",
  }),
});

// Resend verification email schema
const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
});

// Forgot password schema
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
});

// Reset password schema
const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).max(255).required().messages({
    "string.min": "New password must be at least 6 characters long",
    "string.max": "New password cannot exceed 255 characters",
    "any.required": "New password is required",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Password confirmation is required",
    }),
});

module.exports = {
  adminRegisterSchema,
  patientRegisterSchema,
  doctorRegisterSchema,
  pharmacyRegisterSchema,
  userLoginSchema,
  googleLoginSchema,
  emailVerificationSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
