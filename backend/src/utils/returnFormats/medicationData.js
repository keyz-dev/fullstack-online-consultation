const { formatImageUrl } = require("../imageUtils");

/**
 * Format medication data for API responses
 * @param {Object} medication - PharmacyDrug model instance
 * @param {Object} options - Additional options for formatting
 * @returns {Object} Formatted medication data
 */
const formatMedicationData = (medication, options = {}) => {
  if (!medication) return null;

  // Base medication data
  const formattedMedication = {
    id: medication.id,
    name: medication.name,
    genericName: medication.genericName,
    description: medication.description,
    dosageForm: medication.dosageForm,
    strength: medication.strength,
    manufacturer: medication.manufacturer,
    price: medication.price,
    currency: medication.currency,
    stockQuantity: medication.stockQuantity,
    isAvailable: medication.isAvailable,
    requiresPrescription: medication.requiresPrescription,
    category: medication.category,
    sideEffects: medication.sideEffects || [],
    contraindications: medication.contraindications || [],
    expiryDate: medication.expiryDate,
    imageUrl: formatImageUrl(medication.imageUrl), // Format image URL for serving
    createdAt: medication.createdAt,
    updatedAt: medication.updatedAt,
  };

  // Include pharmacy data if available
  if (medication.pharmacy) {
    formattedMedication.pharmacy = {
      id: medication.pharmacy.id,
      name: medication.pharmacy.name,
      address: medication.pharmacy.address,
    };
  }

  return formattedMedication;
};

/**
 * Format array of medications for API responses
 * @param {Array} medications - Array of medication model instances
 * @param {Object} options - Additional options for formatting
 * @returns {Array} Formatted medications array
 */
const formatMedicationsData = (medications, options = {}) => {
  if (!medications || !Array.isArray(medications)) return [];
  return medications.map((medication) => formatMedicationData(medication, options));
};

module.exports = {
  formatMedicationData,
  formatMedicationsData,
};
