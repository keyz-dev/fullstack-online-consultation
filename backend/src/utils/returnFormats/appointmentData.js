const { formatImageUrl } = require("../imageUtils");

/**
 * Format appointment data for API responses
 * @param {Object} appointment - The appointment object
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted appointment data
 */
const formatAppointmentData = async (appointment, options = {}) => {
  const {
    includePayment = false,
    includeDoctor = false,
    includePatient = false,
  } = options;

  const formattedAppointment = {
    id: appointment.id,
    status: appointment.status,
    consultationType: appointment.consultationType,
    symptomIds: appointment.symptomIds || [],
    notes: appointment.notes,
    cancellationReason: appointment.cancellationReason,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };

  // Include time slot information
  if (appointment.timeSlot) {
    formattedAppointment.timeSlot = {
      id: appointment.timeSlot.id,
      date: appointment.timeSlot.date,
      startTime: appointment.timeSlot.startTime,
      endTime: appointment.timeSlot.endTime,
      isBooked: appointment.timeSlot.isBooked,
    };
  }

  // Include doctor information directly
  if (includeDoctor && appointment.doctor) {
    const doctor = appointment.doctor;
    formattedAppointment.doctor = {
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
    };

    if (doctor.user) {
      formattedAppointment.doctor.user = {
        id: doctor.user.id,
        name: doctor.user.name,
        email: doctor.user.email,
        avatar: doctor.user.avatar ? formatImageUrl(doctor.user.avatar) : null,
      };
    }

    // Include specialties if available
    if (doctor.specialties) {
      formattedAppointment.doctor.specialties = doctor.specialties.map(
        (specialty) => ({
          id: specialty.id,
          name: specialty.name,
          description: specialty.description,
          icon: specialty.icon ? formatImageUrl(specialty.icon) : null,
        })
      );
    }
  }

  // Include patient information
  if (includePatient && appointment.patient) {
    formattedAppointment.patient = {
      id: appointment.patient.id,
      medicalHistory: appointment.patient.medicalHistory,
      allergies: appointment.patient.allergies,
      currentMedications: appointment.patient.currentMedications,
      emergencyContact: appointment.patient.emergencyContact,
      insuranceInfo: appointment.patient.insuranceInfo,
    };

    if (appointment.patient.user) {
      formattedAppointment.patient.user = {
        id: appointment.patient.user.id,
        name: appointment.patient.user.name,
        email: appointment.patient.user.email,
        phoneNumber: appointment.patient.user.phoneNumber,
        gender: appointment.patient.user.gender,
        dob: appointment.patient.user.dob,
        avatar: appointment.patient.user.avatar
          ? formatImageUrl(appointment.patient.user.avatar)
          : null,
      };
    }
    if (appointment.patient.documents) {
      formattedAppointment.patient.documents =
        appointment.patient.documents.map((doc) => ({
          id: doc.id,
          documentType: doc.documentType,
          fileName: doc.fileName,
          fileUrl: formatImageUrl(doc.fileUrl),
          fileSize: doc.fileSize,
          mimeType: doc.mimeType,
        }));
    }
  }

  // Include payment information
  if (
    includePayment &&
    appointment.payments &&
    appointment.payments.length > 0
  ) {
    const latestPayment = appointment.payments[0];
    if (latestPayment) {
      formattedAppointment.payment = {
        id: latestPayment.id,
        type: latestPayment.type,
        amount: latestPayment.amount,
        currency: latestPayment.currency,
        status: latestPayment.status,
        paymentMethod: latestPayment.paymentMethod,
        transactionId: latestPayment.transactionId,
        gatewayResponse: latestPayment.gatewayResponse,
        description: latestPayment.description,
        metadata: latestPayment.metadata,
        createdAt: latestPayment.createdAt,
        updatedAt: latestPayment.updatedAt,
      };
    }
  }

  return formattedAppointment;
};

/**
 * Format multiple appointments data
 * @param {Array} appointments - Array of appointment objects
 * @param {Object} options - Formatting options
 * @returns {Array} Array of formatted appointment data
 */
const formatAppointmentsData = async (appointments, options = {}) => {
  const formattedAppointments = [];

  for (const appointment of appointments) {
    const formattedAppointment = await formatAppointmentData(
      appointment,
      options
    );
    formattedAppointments.push(formattedAppointment);
  }

  return formattedAppointments;
};

module.exports = {
  formatAppointmentData,
  formatAppointmentsData,
};
