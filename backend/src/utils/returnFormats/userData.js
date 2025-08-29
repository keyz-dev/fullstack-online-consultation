const { formatImageUrl } = require("../imageUtils");

/**
 * Format array of image URLs
 * @param {Array} images - Array of image URLs
 * @returns {Array} Formatted image URLs
 */
const formatImages = (images) => {
  if (!images || !Array.isArray(images)) return images;
  return images.map((image) => formatImageUrl(image));
};

/**
 * Format user data for API responses
 * @param {Object} user - User model instance
 * @returns {Object} Formatted user data
 */
const formatUserData = (user) => {
  if (!user) return null;

  // Base user data
  const formattedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    avatar: formatImageUrl(user.avatar),
    gender: user.gender,
    dob: user.dob,
    address: user.address,
    authProvider: user.authProvider,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    hasPaidApplicationFee: user.hasPaidApplicationFee,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  // Add role-specific data
  if (user.patient) {
    formattedUser.patient = {
      id: user.patient.id,
      bloodGroup: user.patient.bloodGroup,
      allergies: user.patient.allergies,
      emergencyContact: user.patient.emergencyContact,
      contactInfo: user.patient.contactInfo,
      medicalDocuments: user.patient.medicalDocuments,
      insuranceInfo: user.patient.insuranceInfo,
      preferredLanguage: user.patient.preferredLanguage,
    };
  }

  if (user.doctor) {
    formattedUser.doctor = {
      id: user.doctor.id,
      licenseNumber: user.doctor.licenseNumber,
      experience: user.doctor.experience,
      bio: user.doctor.bio,
      education: user.doctor.education,
      languages: user.doctor.languages,
      specialties: user.doctor.specialties, // This will be populated through include
      clinicAddress: user.doctor.clinicAddress,
      operationalHospital: user.doctor.operationalHospital,
      contactInfo: user.doctor.contactInfo,
      consultationFee: user.doctor.consultationFee,
      consultationDuration: user.doctor.consultationDuration,
      paymentMethods: user.doctor.paymentMethods,
      isVerified: user.doctor.isVerified,
      isActive: user.doctor.isActive,
      averageRating: user.doctor.averageRating,
      totalReviews: user.doctor.totalReviews,
    };
  }

  if (user.pharmacy) {
    formattedUser.pharmacy = {
      id: user.pharmacy.id,
      name: user.pharmacy.name,
      licenseNumber: user.pharmacy.licenseNumber,
      description: user.pharmacy.description,
      logo: formatImageUrl(user.pharmacy.logo),
      images: formatImages(user.pharmacy.images),
      address: user.pharmacy.address,
      contactInfo: user.pharmacy.contactInfo,
      deliveryInfo: user.pharmacy.deliveryInfo,
      paymentMethods: user.pharmacy.paymentMethods,
      isVerified: user.pharmacy.isVerified,
      isActive: user.pharmacy.isActive,
      averageRating: user.pharmacy.averageRating,
      totalReviews: user.pharmacy.totalReviews,
    };
  }

  return formattedUser;
};

module.exports = formatUserData;
