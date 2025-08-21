const { formatImageUrl } = require("../imageUtils");

/**
 * Format document URLs in documents object
 * @param {Object|Array} documents - Documents object or array
 * @returns {Object|Array} Formatted documents
 */
const formatDocuments = (documents) => {
  if (!documents) return documents;

  // Handle array of documents
  if (Array.isArray(documents)) {
    return documents.map((doc) => ({
      ...doc,
      url: formatImageUrl(doc.url),
    }));
  }

  // Handle object with document properties
  if (typeof documents === "object") {
    const formattedDocs = {};
    Object.keys(documents).forEach((key) => {
      const doc = documents[key];
      if (doc && typeof doc === "object" && doc.url) {
        formattedDocs[key] = {
          ...doc,
          url: formatImageUrl(doc.url),
        };
      } else {
        formattedDocs[key] = doc;
      }
    });
    return formattedDocs;
  }

  return documents;
};

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
    role: user.role,
    avatar: formatImageUrl(user.avatar),
    gender: user.gender,
    dob: user.dob,
    address: user.address,
    authProvider: user.authProvider,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    isApproved: user.isApproved,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  // Add role-specific data
  if (user.patient) {
    formattedUser.patient = {
      id: user.patient.id,
      phoneNumber: user.patient.phoneNumber,
      emergencyContact: user.patient.emergencyContact,
      medicalHistory: user.patient.medicalHistory,
      allergies: user.patient.allergies,
      bloodType: user.patient.bloodType,
      height: user.patient.height,
      weight: user.patient.weight,
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
      specialties: user.doctor.specialties,
      clinicAddress: user.doctor.clinicAddress,
      operationalHospital: user.doctor.operationalHospital,
      contactInfo: user.doctor.contactInfo,
      consultationFee: user.doctor.consultationFee,
      consultationDuration: user.doctor.consultationDuration,
      paymentMethods: user.doctor.paymentMethods,
      documents: formatDocuments(user.doctor.documents),
      isVerified: user.doctor.isVerified,
      isApproved: user.doctor.isApproved,
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
      documents: formatDocuments(user.pharmacy.documents),
      isVerified: user.pharmacy.isVerified,
      isApproved: user.pharmacy.isApproved,
      averageRating: user.pharmacy.averageRating,
      totalReviews: user.pharmacy.totalReviews,
    };
  }

  return formattedUser;
};

module.exports = formatUserData;
