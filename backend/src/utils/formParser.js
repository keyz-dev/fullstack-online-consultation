const { BadRequestError } = require("./errors");

/**
 * Parse form data fields that come as strings but represent objects/arrays
 * @param {Object} body - The request body
 * @param {Array} fieldsToParse - Array of field names to parse
 * @returns {Object} - Parsed body with objects/arrays
 */
const parseFormData = (body, fieldsToParse) => {
  const parsedBody = { ...body };

  fieldsToParse.forEach((field) => {
    if (parsedBody[field]) {
      try {
        parsedBody[field] = JSON.parse(parsedBody[field]);
      } catch (error) {
        throw new BadRequestError(`Invalid ${field} format`);
      }
    }
  });

  return parsedBody;
};


/**
 * Parse patient registration form data
 * @param {Object} body - The request body
 * @returns {Object} - Parsed body
 */
const parsePatientRegistration = (body) => {
  return parseFormData(body, ["emergencyContact"]);
};

/**
 * Parse doctor registration form data
 * @param {Object} body - The request body
 * @returns {Object} - Parsed body
 */
const parseDoctorRegistration = (body) => {
  return parseFormData(body, [
    "education",
    "languages",
    "specialties",
    "clinicAddress",
    "contactInfo",
    "paymentMethods",
  ]);
};

/**
 * Parse pharmacy registration form data
 * @param {Object} body - The request body
 * @returns {Object} - Parsed body
 */
const parsePharmacyRegistration = (body) => {
  return parseFormData(body, [
    "address",
    "contactInfo",
    "deliveryInfo",
    "paymentMethods",
  ]);
};

/**
 * Parse document names from request body
 * @param {Object} body - The request body
 * @returns {Array} - Array of document names
 */
const parseDocumentNames = (body) => {
  if (!body.documentNames) return [];

  try {
    return JSON.parse(body.documentNames);
  } catch (error) {
    throw new BadRequestError(
      "Invalid documentNames format. Must be a valid JSON array."
    );
  }
};

module.exports = {
  parseFormData,
  parsePatientRegistration,
  parseDoctorRegistration,
  parsePharmacyRegistration,
  parseDocumentNames,
};
