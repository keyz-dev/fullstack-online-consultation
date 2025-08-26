"use strict";

/**
 * Validation utility functions
 */

/**
 * Validate consultation data
 */
function validateConsultationData(data) {
  const errors = [];

  // Required fields
  if (!data.doctorId) {
    errors.push("Doctor ID is required");
  }

  if (!data.scheduledAt) {
    errors.push("Scheduled date and time is required");
  } else {
    const scheduledDate = new Date(data.scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      errors.push("Invalid scheduled date format");
    } else if (scheduledDate <= new Date()) {
      errors.push("Scheduled time must be in the future");
    }
  }

  if (!data.type) {
    errors.push("Consultation type is required");
  } else {
    const validTypes = ["video_call", "voice_call", "chat", "in_person"];
    if (!validTypes.includes(data.type)) {
      errors.push("Invalid consultation type");
    }
  }

  // Optional validations
  if (data.symptoms && !Array.isArray(data.symptoms)) {
    errors.push("Symptoms must be an array");
  }

  if (data.notes && typeof data.notes !== "string") {
    errors.push("Notes must be a string");
  }

  if (data.notes && data.notes.length > 1000) {
    errors.push("Notes cannot exceed 1000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate availability data
 */
function validateAvailabilityData(data) {
  const errors = [];

  if (!Array.isArray(data.availabilities)) {
    errors.push("Availabilities must be an array");
    return { isValid: false, errors };
  }

  data.availabilities.forEach((availability, index) => {
    if (
      typeof availability.dayOfWeek !== "number" ||
      availability.dayOfWeek < 0 ||
      availability.dayOfWeek > 6
    ) {
      errors.push(`Invalid day of week at index ${index}`);
    }

    if (!availability.startTime || !availability.endTime) {
      errors.push(`Start time and end time are required at index ${index}`);
    }

    if (
      availability.consultationDuration &&
      (availability.consultationDuration < 15 ||
        availability.consultationDuration > 120)
    ) {
      errors.push(
        `Consultation duration must be between 15 and 120 minutes at index ${index}`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate pagination parameters
 */
function validatePaginationParams(params) {
  const errors = [];

  if (params.page && (isNaN(params.page) || params.page < 1)) {
    errors.push("Page must be a positive number");
  }

  if (
    params.limit &&
    (isNaN(params.limit) || params.limit < 1 || params.limit > 100)
  ) {
    errors.push("Limit must be between 1 and 100");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate date range
 */
function validateDateRange(startDate, endDate) {
  const errors = [];

  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      errors.push("Invalid start date format");
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      errors.push("Invalid end date format");
    }
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      errors.push("Start date must be before end date");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
function validatePhoneNumber(phone) {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate password strength
 */
function validatePassword(password) {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateConsultationData,
  validateAvailabilityData,
  validatePaginationParams,
  validateDateRange,
  validateEmail,
  validatePhoneNumber,
  validatePassword,
};
