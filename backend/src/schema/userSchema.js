const Joi = require("joi");

const addressSchema = Joi.object({
  street: Joi.string().optional().allow(null, ""),
  city: Joi.string().optional().allow(null, ""),
  state: Joi.string().optional().allow(null, ""),
  country: Joi.string().optional().allow(null, ""),
  postalCode: Joi.string().optional().allow(null, ""),
  fullAddress: Joi.string().optional().allow(null, ""),
  coordinates: Joi.object({
    lat: Joi.number().optional().allow(null, ""),
    lng: Joi.number().optional().allow(null, ""),
  }).optional(),
});

const contactInfoSchema = Joi.object({
  type: Joi.string()
    .valid(
      "phone",
      "whatsapp",
      "email",
      "facebook",
      "twitter",
      "linkedin",
      "tiktok",
      "telegram",
      "instagram",
      "website",
      "business_email",
      "youtube",
      "pinterest",
      "snapchat",
      "reddit",
      "discord",
      "twitch",
      "github",
      "gitlab",
      "bitbucket",
      "stackoverflow",
      "medium",
      "devto"
    )
    .required(),
  value: Joi.string().required(),
});

const paymentMethodSchema = Joi.object({
  method: Joi.string()
    .valid(
      "MoMo",
      "OrangeMoney",
      "OM",
      "MTN",
      "bank_transfer",
      "cash_on_delivery"
    )
    .required(),
  value: Joi.object({
    accountNumber: Joi.string().required(),
    accountName: Joi.string().required(),
    bankName: Joi.string().optional(),
    accountType: Joi.string().optional(),
  }).required(),
});

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
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  password: Joi.string().min(6).max(255).messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 255 characters",
  }),
  gender: Joi.string().valid("male", "female", "other").optional(),
  dob: Joi.date().max("now").optional().messages({
    "date.max": "Date of birth cannot be in the future",
  }),
  address: addressSchema.optional(),
});

// Initiate registration schema (for basic user info only)
const initiateRegistrationSchema = baseUserSchema.keys({
  password: Joi.string().min(6).max(255).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 255 characters",
    "any.required": "Password is required",
  }),
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
const doctorRegisterSchema = Joi.object({
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
  specialties: Joi.array().items(Joi.number()).min(1).required().messages({
    "array.min": "At least one specialty must be specified",
    "any.required": "Specialties are required",
  }),
  clinicAddress: addressSchema.optional(),
  operationalHospital: Joi.string().max(200).optional().messages({
    "string.max": "Operational hospital name cannot exceed 200 characters",
  }),
  contactInfo: Joi.array().items(contactInfoSchema).optional().allow(null, ""),
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
  paymentMethods: Joi.array()
    .items(paymentMethodSchema)
    .optional()
    .allow(null, ""),
  documentNames: Joi.array().items(Joi.string()).optional(),
});

// Pharmacy registration schema
const pharmacyRegisterSchema = Joi.object({
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
  address: addressSchema.required(),
  languages: Joi.array().items(Joi.string()).optional().allow(null, ""),
  contactInfo: Joi.array().items(contactInfoSchema).optional().allow(null, ""),
  shipping: Joi.object({
    // Zone-based rates
    sameCityRate: Joi.number().min(0).default(1000),
    sameRegionRate: Joi.number().min(0).default(2000),
    sameCountryRate: Joi.number().min(0).default(5000),
    othersRate: Joi.number().min(0).default(15000),
    freeShippingThreshold: Joi.number().min(0).default(50000),

    // Processing days
    sameCityDays: Joi.string().default("1-2"),
    sameRegionDays: Joi.string().default("2-3"),
    sameCountryDays: Joi.string().default("3-5"),
    othersDays: Joi.string().default("5-10"),

    // Delivery areas
    deliverLocally: Joi.boolean().default(true),
    deliverNationally: Joi.boolean().default(true),
    deliverInternationally: Joi.boolean().default(false),

    // Cash on delivery
    allowCashOnDelivery: Joi.boolean().default(false),
    codConditions: Joi.string().allow("", null).default(""),

    // Processing time
    processingTime: Joi.string().default("1-2 business days"),
  }).optional(),
  paymentMethods: Joi.array()
    .items(paymentMethodSchema)
    .optional()
    .allow(null, ""),
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

// Google sign up schema
const googleSignUpSchema = Joi.object({
  access_token: Joi.string().required().messages({
    "any.required": "Access token is required",
  }),
  role: Joi.string()
    .valid(
      "doctor",
      "pharmacy",
      "patient",
      "admin",
      "incomplete_doctor",
      "incomplete_pharmacy"
    )
    .required()
    .messages({
      "any.required": "Role is required",
      "any.invalid": "Invalid role",
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

// User update schema (for profile updates)
const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
  gender: Joi.string().valid("male", "female", "other").optional(),
  dob: Joi.date().max("now").optional().messages({
    "date.max": "Date of birth cannot be in the future",
  }),
  address: addressSchema.optional(),
  bio: Joi.string().max(2000).optional().messages({
    "string.max": "Bio cannot exceed 2000 characters",
  }),
});

// User password update schema
const userPasswordUpdateSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string().min(6).max(255).required().messages({
    "string.min": "New password must be at least 6 characters long",
    "string.max": "New password cannot exceed 255 characters",
    "any.required": "New password is required",
  }),
});

module.exports = {
  initiateRegistrationSchema,
  adminRegisterSchema,
  patientRegisterSchema,
  doctorRegisterSchema,
  pharmacyRegisterSchema,
  userLoginSchema,
  googleLoginSchema,
  googleSignUpSchema,
  emailVerificationSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  userUpdateSchema,
  userPasswordUpdateSchema,
};
