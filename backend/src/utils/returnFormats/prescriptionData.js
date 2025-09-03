const { formatImageUrl } = require("../imageUtils");

/**
 * Format prescription data for API responses
 * @param {Object} prescription - Prescription model instance
 * @param {Object} options - Additional options for formatting
 * @returns {Object} Formatted prescription data
 */
const formatPrescriptionData = (prescription, options = {}) => {
  if (!prescription) return null;

  const {
    includeConsultation = false,
    includePatient = false,
    includeDoctor = false,
  } = options;

  // Base prescription data
  const formattedPrescription = {
    id: prescription.id,
    consultationId: prescription.consultationId,
    doctorId: prescription.doctorId,
    patientId: prescription.patientId,
    diagnosis: prescription.diagnosis,
    medications: prescription.medications || [],
    instructions: prescription.instructions,
    dosage: prescription.dosage,
    duration: prescription.duration,
    startDate: prescription.startDate,
    endDate: prescription.endDate,
    refills: prescription.refills,
    refillsRemaining: prescription.refillsRemaining,
    notes: prescription.notes,
    sideEffects: prescription.sideEffects || [],
    contraindications: prescription.contraindications || [],
    status: prescription.status,
    fileUrl: formatImageUrl(prescription.fileUrl), // Format file URL for serving
    createdAt: prescription.createdAt,
    updatedAt: prescription.updatedAt,
  };

  // Include consultation data if requested
  if (includeConsultation && prescription.consultation) {
    formattedPrescription.consultation = {
      id: prescription.consultation.id,
      appointmentId: prescription.consultation.appointmentId,
      startTime: prescription.consultation.startTime,
      endTime: prescription.consultation.endTime,
      status: prescription.consultation.status,
      consultationType: prescription.consultation.consultationType,
      notes: prescription.consultation.notes,
      rating: prescription.consultation.rating,
      review: prescription.consultation.review,
      createdAt: prescription.consultation.createdAt,
      updatedAt: prescription.consultation.updatedAt,
    };

    // Include appointment details if available
    if (prescription.consultation.appointment) {
      formattedPrescription.consultation.appointment = {
        id: prescription.consultation.appointment.id,
        appointmentDate: prescription.consultation.appointment.appointmentDate,
        appointmentTime: prescription.consultation.appointment.appointmentTime,
        consultationType:
          prescription.consultation.appointment.consultationType,
        status: prescription.consultation.appointment.status,
        createdAt: prescription.consultation.appointment.createdAt,
        updatedAt: prescription.consultation.appointment.updatedAt,
      };
    }
  }

  // Include patient data if requested
  if (includePatient && prescription.consultation?.appointment?.patient) {
    const patient = prescription.consultation.appointment.patient;
    formattedPrescription.patient = {
      id: patient.id,
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies,
      currentMedications: patient.currentMedications,
      emergencyContact: patient.emergencyContact,
      insuranceInfo: patient.insuranceInfo,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };

    if (patient.user) {
      formattedPrescription.patient.user = {
        id: patient.user.id,
        name: patient.user.name,
        email: patient.user.email,
        phoneNumber: patient.user.phoneNumber,
        gender: patient.user.gender,
        dob: patient.user.dob,
        avatar: formatImageUrl(patient.user.avatar),
        createdAt: patient.user.createdAt,
        updatedAt: patient.user.updatedAt,
      };
    }
  }

  // Include doctor data if requested
  if (includeDoctor && prescription.consultation?.appointment?.doctor) {
    const doctor = prescription.consultation.appointment.doctor;
    formattedPrescription.doctor = {
      id: doctor.id,
      licenseNumber: doctor.licenseNumber,
      specialization: doctor.specialization,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      isAvailable: doctor.isAvailable,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    };

    if (doctor.user) {
      formattedPrescription.doctor.user = {
        id: doctor.user.id,
        name: doctor.user.name,
        email: doctor.user.email,
        phoneNumber: doctor.user.phoneNumber,
        gender: doctor.user.gender,
        dob: doctor.user.dob,
        avatar: formatImageUrl(doctor.user.avatar),
        createdAt: doctor.user.createdAt,
        updatedAt: doctor.user.updatedAt,
      };
    }

    if (doctor.specialty) {
      formattedPrescription.doctor.specialty = {
        id: doctor.specialty.id,
        name: doctor.specialty.name,
        description: doctor.specialty.description,
        icon: formatImageUrl(doctor.specialty.icon),
      };
    }
  }

  return formattedPrescription;
};

/**
 * Format array of prescriptions for API responses
 * @param {Array} prescriptions - Array of prescription model instances
 * @param {Object} options - Additional options for formatting
 * @returns {Array} Array of formatted prescription data
 */
const formatPrescriptionsData = (prescriptions, options = {}) => {
  if (!prescriptions || !Array.isArray(prescriptions)) return [];
  return prescriptions.map((prescription) =>
    formatPrescriptionData(prescription, options)
  );
};

module.exports = {
  formatPrescriptionData,
  formatPrescriptionsData,
};
