const { formatImageUrl } = require("../imageUtils");

/**
 * Format symptom data for API responses
 * @param {Object} symptom - Symptom model instance
 * @param {Object} options - Additional options for formatting
 * @returns {Object} Formatted symptom data
 */
const formatSymptomData = (symptom, options = {}) => {
  if (!symptom) return null;

  // Base symptom data
  const formattedSymptom = {
    id: symptom.id,
    name: symptom.name,
    iconUrl: formatImageUrl(symptom.iconUrl),
    specialtyId: symptom.specialtyId,
    createdAt: symptom.createdAt,
    updatedAt: symptom.updatedAt,
  };

  // Include specialty data if available
  if (symptom.specialty) {
    formattedSymptom.specialty = {
      id: symptom.specialty.id,
      name: symptom.specialty.name,
    };
  }

  return formattedSymptom;
};

/**
 * Format array of symptoms for API responses
 * @param {Array} symptoms - Array of symptom model instances
 * @param {Object} options - Additional options for formatting
 * @returns {Array} Formatted symptoms array
 */
const formatSymptomsData = (symptoms, options = {}) => {
  if (!symptoms || !Array.isArray(symptoms)) return [];

  return symptoms.map((symptom) => formatSymptomData(symptom, options));
};

/**
 * Format symptom statistics
 * @param {Object} stats - Statistics object
 * @returns {Object} Formatted statistics
 */
const formatSymptomStats = (stats) => {
  return {
    total: stats.total || 0,
    bySpecialty: stats.bySpecialty || [],
    topSymptoms: stats.topSymptoms || [],
  };
};

module.exports = {
  formatSymptomData,
  formatSymptomsData,
  formatSymptomStats,
};
