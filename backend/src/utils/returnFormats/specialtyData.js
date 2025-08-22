const { formatImageUrl } = require("../imageUtils");

/**
 * Format specialty data for API responses
 * @param {Object} specialty - Specialty model instance
 * @param {Object} options - Additional options for formatting
 * @returns {Object} Formatted specialty data
 */
const formatSpecialtyData = (specialty, options = {}) => {
  if (!specialty) return null;

  const {
    includeStats = false,
    doctorCount = 0,
    consultationCount = 0,
    symptomCount = 0,
  } = options;

  // Base specialty data
  const formattedSpecialty = {
    id: specialty.id,
    name: specialty.name,
    description: specialty.description,
    icon: formatImageUrl(specialty.icon),
    isActive: specialty.isActive,
    createdAt: specialty.createdAt,
    updatedAt: specialty.updatedAt,
  };

  // Include statistics if requested
  if (includeStats) {
    formattedSpecialty.stats = {
      doctorCount,
      consultationCount,
      symptomCount,
    };
  }

  // Include related data if available
  if (specialty.symptoms && Array.isArray(specialty.symptoms)) {
    formattedSpecialty.symptoms = specialty.symptoms.map((symptom) => ({
      id: symptom.id,
      name: symptom.name,
      description: symptom.description,
      severity: symptom.severity,
      isActive: symptom.isActive,
    }));
  }

  return formattedSpecialty;
};

/**
 * Format array of specialties for API responses
 * @param {Array} specialties - Array of specialty model instances
 * @param {Object} options - Additional options for formatting
 * @returns {Array} Formatted specialties array
 */
const formatSpecialtiesData = (specialties, options = {}) => {
  if (!specialties || !Array.isArray(specialties)) return [];

  return specialties.map((specialty) =>
    formatSpecialtyData(specialty, options)
  );
};

/**
 * Format specialty statistics
 * @param {Array} specialties - Array of specialty model instances
 * @param {Object} stats - Statistics object with counts
 * @returns {Object} Formatted statistics
 */
const formatSpecialtyStats = (specialties, stats = {}) => {
  const total = specialties.length;
  const active = specialties.filter((s) => s.isActive).length;
  const inactive = total - active;

  return {
    total,
    active,
    inactive,
    ...stats, // Include any additional stats passed
  };
};

module.exports = {
  formatSpecialtyData,
  formatSpecialtiesData,
  formatSpecialtyStats,
};
