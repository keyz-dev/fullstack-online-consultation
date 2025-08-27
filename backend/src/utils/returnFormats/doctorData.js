const { formatImageUrl } = require("../imageUtils");

/**
 * Format doctor user data for API responses
 * @param {Object} user - User model instance
 * @returns {Object} Formatted user data
 */
const formatDoctorUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: formatImageUrl(user.avatar),
    phoneNumber: user.phoneNumber,
    gender: user.gender,
    dob: user.dob,
    age: user.age,
  };
};

/**
 * Format doctor specialty data for API responses
 * @param {Object} specialty - Specialty model instance
 * @returns {Object} Formatted specialty data
 */
const formatDoctorSpecialty = (specialty) => {
  if (!specialty) return null;

  return {
    id: specialty.id,
    name: specialty.name,
    description: specialty.description,
    icon: formatImageUrl(specialty.icon),
  };
};

/**
 * Format doctor availability data for API responses
 * @param {Object} availability - DoctorAvailability model instance
 * @returns {Object} Formatted availability data
 */
const formatDoctorAvailability = (availability) => {
  if (!availability) return null;

  return {
    id: availability.id,
    dayOfWeek: availability.dayOfWeek,
    startTime: availability.startTime,
    endTime: availability.endTime,
    consultationType: availability.consultationType,
    consultationFee: availability.consultationFee,
    isAvailable: availability.isAvailable,
  };
};

/**
 * Format doctor data for API responses
 * @param {Object} doctor - Doctor model instance
 * @param {Object} options - Additional options for formatting
 * @returns {Object} Formatted doctor data
 */
const formatDoctorData = (doctor, options = {}) => {
  if (!doctor) return null;

  const { includeAvailabilities = false } = options;

  // Base doctor data
  const formattedDoctor = {
    id: doctor.id,
    licenseNumber: doctor.licenseNumber,
    experience: doctor.experience,
    bio: doctor.bio,
    education: doctor.education,
    languages: doctor.languages,
    clinicAddress: doctor.clinicAddress,
    operationalHospital: doctor.operationalHospital,
    contactInfo: doctor.contactInfo,
    consultationFee: doctor.consultationFee,
    consultationDuration: doctor.consultationDuration,
    paymentMethods: doctor.paymentMethods,
    isVerified: doctor.isVerified,
    isActive: doctor.isActive,
    averageRating: doctor.averageRating,
    totalReviews: doctor.totalReviews,
    createdAt: doctor.createdAt,
    updatedAt: doctor.updatedAt,
  };

  // Include user data if available
  if (doctor.user) {
    formattedDoctor.user = formatDoctorUser(doctor.user);
  }

  // Include specialties if available
  if (doctor.specialties && Array.isArray(doctor.specialties)) {
    formattedDoctor.specialties = doctor.specialties.map((specialty) =>
      formatDoctorSpecialty(specialty)
    );
  }

  // Include availabilities if requested and available
  if (
    includeAvailabilities &&
    doctor.availabilities &&
    Array.isArray(doctor.availabilities)
  ) {
    formattedDoctor.availabilities = doctor.availabilities.map((availability) =>
      formatDoctorAvailability(availability)
    );
  }

  return formattedDoctor;
};

/**
 * Format array of doctors for API responses
 * @param {Array} doctors - Array of Doctor model instances
 * @param {Object} options - Additional options for formatting
 * @returns {Array} Formatted doctors array
 */
const formatDoctorsData = (doctors, options = {}) => {
  if (!doctors || !Array.isArray(doctors)) return [];

  return doctors.map((doctor) => formatDoctorData(doctor, options));
};

/**
 * Format doctor statistics
 * @param {Object} stats - Statistics object
 * @returns {Object} Formatted statistics
 */
const formatDoctorStats = (stats) => {
  if (!stats) return null;

  return {
    totalDoctors: stats.totalDoctors || 0,
    verifiedDoctors: stats.verifiedDoctors || 0,
    activeDoctors: stats.activeDoctors || 0,
    averageRating: stats.averageRating || 0,
    totalReviews: stats.totalReviews || 0,
  };
};

module.exports = {
  formatDoctorData,
  formatDoctorsData,
  formatDoctorStats,
  formatDoctorUser,
  formatDoctorSpecialty,
  formatDoctorAvailability,
};
