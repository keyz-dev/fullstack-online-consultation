const { formatImageUrl } = require("../imageUtils");

/**
 * Format application document data for API responses
 * @param {Object} document - ApplicationDocument model instance
 * @returns {Object} Formatted document data
 */
const formatApplicationDocument = (document) => {
  if (!document) return null;

  return {
    id: document.id,
    documentType: document.documentType,
    fileName: document.fileName,
    fileUrl: formatImageUrl(document.fileUrl), // Format file URL for serving
    fileSize: document.fileSize,
    mimeType: document.mimeType,
    expiryDate: document.expiryDate,
    verifiedAt: document.verifiedAt,
    verificationNotes: document.verificationNotes,
    uploadedAt: document.uploadedAt,
  };
};

/**
 * Format application user data for API responses
 * @param {Object} user - User model instance
 * @returns {Object} Formatted user data
 */
const formatApplicationUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    avatar: formatImageUrl(user.avatar), // Format avatar URL
  };
};

/**
 * Format doctor data for application responses
 * @param {Object} doctor - Doctor model instance
 * @returns {Object} Formatted doctor data
 */
const formatApplicationDoctor = (doctor) => {
  if (!doctor) return null;

  return {
    id: doctor.id,
    licenseNumber: doctor.licenseNumber,
    experience: doctor.experience,
    bio: doctor.bio,
    clinicAddress: doctor.clinicAddress,
  };
};

/**
 * Format pharmacy data for application responses
 * @param {Object} pharmacy - Pharmacy model instance
 * @returns {Object} Formatted pharmacy data
 */
const formatApplicationPharmacy = (pharmacy) => {
  if (!pharmacy) return null;

  return {
    id: pharmacy.id,
    name: pharmacy.name,
    licenseNumber: pharmacy.licenseNumber,
    description: pharmacy.description,
    address: pharmacy.address,
  };
};

/**
 * Format application data for API responses
 * @param {Object} application - UserApplication model instance
 * @returns {Object} Formatted application data
 */
const formatApplicationData = (application) => {
  if (!application) return null;

  const formattedApplication = {
    id: application.id,
    userId: application.userId,
    applicationType: application.applicationType,
    typeId: application.typeId,
    status: application.status,
    applicationVersion: application.applicationVersion,
    adminReview: application.adminReview,
    adminNotes: application.adminNotes,
    submittedAt: application.submittedAt,
    reviewedAt: application.reviewedAt,
    approvedAt: application.approvedAt,
    rejectedAt: application.rejectedAt,
    suspendedAt: application.suspendedAt,
    rejectionReason: application.rejectionReason,
    suspensionReason: application.suspensionReason,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
  };

  // Include user data if available
  if (application.user) {
    formattedApplication.user = formatApplicationUser(application.user);
  }

  // Include doctor data if available
  if (application.doctor) {
    formattedApplication.doctor = formatApplicationDoctor(application.doctor);
  }

  // Include pharmacy data if available
  if (application.pharmacy) {
    formattedApplication.pharmacy = formatApplicationPharmacy(
      application.pharmacy
    );
  }

  // Include documents if available
  if (application.documents && Array.isArray(application.documents)) {
    formattedApplication.documents = application.documents.map((document) =>
      formatApplicationDocument(document)
    );
  }

  return formattedApplication;
};

/**
 * Format array of applications for API responses
 * @param {Array} applications - Array of UserApplication model instances
 * @returns {Array} Formatted applications array
 */
const formatApplicationsData = (applications) => {
  if (!applications || !Array.isArray(applications)) return [];

  return applications.map((application) => formatApplicationData(application));
};

/**
 * Format application statistics
 * @param {Object} stats - Statistics object
 * @returns {Object} Formatted statistics
 */
const formatApplicationStats = (stats) => {
  return {
    total: stats.total || 0,
    pending: stats.pending || 0,
    approved: stats.approved || 0,
    rejected: stats.rejected || 0,
  };
};

module.exports = {
  formatApplicationData,
  formatApplicationsData,
  formatApplicationStats,
  formatApplicationDocument,
  formatApplicationUser,
  formatApplicationDoctor,
  formatApplicationPharmacy,
};
