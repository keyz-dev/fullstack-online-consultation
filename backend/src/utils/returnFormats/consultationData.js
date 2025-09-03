const { formatImageUrl } = require("../imageUtils");

/**
 * Format consultation data for API responses
 * @param {Object} consultation - The consultation object
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted consultation data
 */
const formatConsultationData = (consultation, options = {}) => {
  const {
    includeAppointment = true,
    includePatient = true,
    includeDoctor = true,
    includeMessages = false,
    includePrescriptions = false,
  } = options;

  if (!consultation) return null;

  const consultationData = consultation.toJSON
    ? consultation.toJSON()
    : consultation;

  // Base consultation data
  const formattedConsultation = {
    id: consultationData.id,
    appointmentId: consultationData.appointmentId,
    roomId: consultationData.roomId,
    status: consultationData.status,
    type: consultationData.type,
    startedAt: consultationData.startedAt,
    endedAt: consultationData.endedAt,
    duration: consultationData.duration,
    diagnosis: consultationData.diagnosis,
    notes: consultationData.notes,
    followUpDate: consultationData.followUpDate,
    followUpNotes: consultationData.followUpNotes,
    rating: consultationData.rating,
    review: consultationData.review,
    declineHistory: consultationData.declineHistory || [],
    participantStatus: consultationData.participantStatus,
    lastActivity: consultationData.lastActivity,
    createdAt: consultationData.createdAt,
    updatedAt: consultationData.updatedAt,
  };

  // Include appointment information
  if (includeAppointment && consultationData.appointment) {
    formattedConsultation.appointment = {
      id: consultationData.appointment.id,
      timeSlotId: consultationData.appointment.timeSlotId,
      doctorId: consultationData.appointment.doctorId,
      patientId: consultationData.appointment.patientId,
      status: consultationData.appointment.status,
      consultationType: consultationData.appointment.consultationType,
      symptomIds: consultationData.appointment.symptomIds || [],
      notes: consultationData.appointment.notes,
      cancellationReason: consultationData.appointment.cancellationReason,
      cancelledBy: consultationData.appointment.cancelledBy,
      cancelledAt: consultationData.appointment.cancelledAt,
      paymentStatus: consultationData.appointment.paymentStatus,
      paymentAmount: consultationData.appointment.paymentAmount,
      campayTransactionId: consultationData.appointment.campayTransactionId,
      createdAt: consultationData.appointment.createdAt,
      updatedAt: consultationData.appointment.updatedAt,
    };

    // Include time slot information if available
    if (consultationData.appointment.timeSlot) {
      formattedConsultation.appointment.timeSlot = {
        id: consultationData.appointment.timeSlot.id,
        date: consultationData.appointment.timeSlot.date,
        startTime: consultationData.appointment.timeSlot.startTime,
        endTime: consultationData.appointment.timeSlot.endTime,
        isBooked: consultationData.appointment.timeSlot.isBooked,
      };
    }
  }

  // Include patient information
  if (includePatient && consultationData.appointment?.patient) {
    const patient = consultationData.appointment.patient;
    formattedConsultation.patient = {
      id: patient.id,
      userId: patient.userId,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies || [],
      emergencyContact: patient.emergencyContact,
      contactInfo: patient.contactInfo,
      medicalHistory: patient.medicalHistory,
      currentMedications: patient.currentMedications,
      insuranceInfo: patient.insuranceInfo,
      preferredLanguage: patient.preferredLanguage,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };

    if (patient.user) {
      formattedConsultation.patient.user = {
        id: patient.user.id,
        name: patient.user.name,
        email: patient.user.email,
        phoneNumber: patient.user.phoneNumber,
        gender: patient.user.gender,
        address: patient.user.address,
        age: patient.user.age,
        dob: patient.user.dob,
        avatar: patient.user.avatar
          ? formatImageUrl(patient.user.avatar)
          : null,
      };
    }
  }

  // Include doctor information
  if (includeDoctor && consultationData.appointment?.doctor) {
    const doctor = consultationData.appointment.doctor;
    formattedConsultation.doctor = {
      id: doctor.id,
      userId: doctor.userId,
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

    if (doctor.user) {
      formattedConsultation.doctor.user = {
        id: doctor.user.id,
        name: doctor.user.name,
        email: doctor.user.email,
        address: doctor.user.address,
        age: doctor.user.age,
        avatar: doctor.user.avatar ? formatImageUrl(doctor.user.avatar) : null,
      };
    }

    // Include specialties if available
    if (doctor.specialties && Array.isArray(doctor.specialties)) {
      formattedConsultation.doctor.specialties = doctor.specialties.map(
        (specialty) => ({
          id: specialty.id,
          name: specialty.name,
          description: specialty.description,
          icon: specialty.icon ? formatImageUrl(specialty.icon) : null,
        })
      );
    } else {
      formattedConsultation.doctor.specialties = [];
    }
  }

  // Include consultation messages if requested
  if (includeMessages && consultationData.messages) {
    formattedConsultation.messages = consultationData.messages.map(
      (message) => ({
        id: message.id,
        consultationId: message.consultationId,
        senderId: message.senderId,
        senderRole: message.senderRole,
        message: message.message,
        messageType: message.messageType,
        fileUrl: message.fileUrl ? formatImageUrl(message.fileUrl) : null,
        fileName: message.fileName,
        fileSize: message.fileSize,
        mimeType: message.mimeType,
        isRead: message.isRead,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      })
    );
  }

  // Include prescriptions if requested
  if (includePrescriptions && consultationData.prescriptions) {
    formattedConsultation.prescriptions = consultationData.prescriptions.map(
      (prescription) => ({
        id: prescription.id,
        consultationId: prescription.consultationId,
        patientId: prescription.patientId,
        doctorId: prescription.doctorId,
        diagnosis: prescription.diagnosis,
        notes: prescription.notes,
        status: prescription.status,
        prescribedAt: prescription.prescribedAt,
        validUntil: prescription.validUntil,
        createdAt: prescription.createdAt,
        updatedAt: prescription.updatedAt,
      })
    );
  }

  return formattedConsultation;
};

/**
 * Format multiple consultations data
 * @param {Array} consultations - Array of consultation objects
 * @param {Object} options - Formatting options
 * @returns {Array} Array of formatted consultation data
 */
const formatConsultationsData = (consultations, options = {}) => {
  if (!consultations || !Array.isArray(consultations)) return [];

  return consultations.map((consultation) =>
    formatConsultationData(consultation, options)
  );
};

/**
 * Format consultation list response with pagination
 * @param {Array} consultations - Array of consultation objects
 * @param {Object} pagination - Pagination information
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted consultation list response
 */
const formatConsultationListResponse = (
  consultations,
  pagination,
  options = {}
) => {
  return {
    consultations: formatConsultationsData(consultations, options),
    pagination: {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      itemsPerPage: pagination.itemsPerPage,
    },
  };
};

module.exports = {
  formatConsultationData,
  formatConsultationsData,
  formatConsultationListResponse,
};
