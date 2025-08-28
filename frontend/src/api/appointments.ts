import api from "./index";

// Types
export interface PatientAppointment {
  id: number;
  doctor: {
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
      avatar?: string;
    };
    specialties: {
      id: number;
      name: string;
    }[];
  };
  timeSlot: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
  };
  consultationType: "online" | "physical";
  status:
    | "pending_payment"
    | "paid"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientAppointmentStats {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  thisMonth: number;
  pendingPayment: number;
}

export interface PatientAppointmentFilters {
  status?: string;
  consultationType?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
}

export interface PatientAppointmentResponse {
  success: boolean;
  data: {
    appointments: PatientAppointment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PatientAppointmentStatsResponse {
  success: boolean;
  data: PatientAppointmentStats;
}

export interface Appointment {
  id: number;
  status:
    | "pending_payment"
    | "paid"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  consultationType: "online" | "physical";
  symptomIds: number[];
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  timeSlot?: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  };
  doctor?: {
    id: number;
    licenseNumber: string;
    experience: number;
    bio: string;
    education: string;
    languages: string[];
    clinicAddress: string;
    operationalHospital: string;
    contactInfo: string;
    consultationFee: number;
    consultationDuration: number;
    paymentMethods: string[];
    isVerified: boolean;
    isActive: boolean;
    averageRating: number;
    totalReviews: number;
    user: {
      id: number;
      name: string;
      email: string;
      avatar?: string;
    };
  };
  patient?: {
    id: number;
    medicalHistory: string;
    allergies: string[];
    currentMedications: string[];
    emergencyContact: string;
    insuranceInfo: string;
    medicalDocuments: string[];
    user: {
      id: number;
      name: string;
      email: string;
      phoneNumber: string;
      gender: string;
      dob: string;
      avatar?: string;
    };
  };
  payment?: {
    id: number;
    type: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    transactionId?: string;
    gatewayResponse?: any;
    description?: string;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CreateAppointmentData {
  doctorId?: string;
  timeSlotId: string;
  consultationType: "online" | "physical";
  symptomIds?: number[];
  notes?: string;
  documents?: File[] | any[];
  documentNames?: string[];
}

export interface InitiatePaymentData {
  appointmentId: string;
  phoneNumber: string;
}

export interface AppointmentResponse {
  success: boolean;
  message: string;
  data: {
    appointment: Appointment;
    payment?: {
      id: string;
      amount: number;
      currency: string;
      status: string;
    };
  };
}

export interface PaymentInitiationResponse {
  success: boolean;
  message: string;
  paymentReference: string;
  appointment: {
    id: string;
    status: string;
    consultationType: string;
    appointmentTime: string;
    doctorName: string;
    amount: number;
  };
}

export interface AppointmentsListResponse {
  success: boolean;
  data: {
    appointments: Appointment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Doctor appointment types
export interface DoctorAppointment {
  id: number;
  patient: {
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
      avatar?: string;
    };
  };
  timeSlot: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
  };
  consultationType: "online" | "physical";
  status:
    | "pending_payment"
    | "paid"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  notes?: string;
  symptomIds?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface DoctorAppointmentStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  completed: number;
  cancelled: number;
  successRate: number;
}

export interface DoctorAppointmentFilters {
  page?: number;
  limit?: number;
  status?: string;
  consultationType?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
}

export interface DoctorAppointmentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DoctorAppointmentResponse {
  success: boolean;
  data: {
    appointments: DoctorAppointment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface DoctorAppointmentStatsResponse {
  success: boolean;
  data: DoctorAppointmentStats;
}

// API Functions
export const appointmentsAPI = {
  // Get patient appointments with filters
  getPatientAppointments: async (
    filters: PatientAppointmentFilters & {
      page?: number;
      limit?: number;
    }
  ): Promise<PatientAppointmentResponse> => {
    const response = await api.get("/appointment/patient", { params: filters });
    return response.data;
  },

  // Get patient appointment statistics
  getPatientAppointmentStats:
    async (): Promise<PatientAppointmentStatsResponse> => {
      const response = await api.get("/appointment/patient/stats");
      return response.data;
    },

  // Get user's appointments
  getUserAppointments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<AppointmentsListResponse> => {
    const response = await api.get("/appointment", { params });
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (
    id: number
  ): Promise<{ success: boolean; data: Appointment }> => {
    const response = await api.get(`/appointment/${id}`);
    return response.data;
  },

  // Create appointment
  createAppointment: async (
    data: CreateAppointmentData
  ): Promise<AppointmentResponse> => {
    const formData = new FormData();

    // Basic fields
    if (data.doctorId) {
      formData.append("doctorId", data.doctorId);
    }
    formData.append("timeSlotId", data.timeSlotId);
    formData.append("consultationType", data.consultationType);

    // Optional fields
    if (data.symptomIds && data.symptomIds.length > 0) {
      data.symptomIds.forEach((id) => {
        formData.append("symptomIds", id.toString());
      });
    }
    if (data.notes) {
      formData.append("notes", data.notes);
    }

    // Documents
    if (data.documents && data.documents.length > 0) {
      data.documents.forEach((doc) => {
        formData.append("patientDocument", doc);
      });
    }
    if (data.documentNames && data.documentNames.length > 0) {
      data.documentNames.forEach((name) => {
        formData.append("documentNames", name);
      });
    }

    const response = await api.post("/appointment/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Initiate payment for appointment
  initiatePayment: async (
    data: InitiatePaymentData
  ): Promise<PaymentInitiationResponse> => {
    const response = await api.post("/appointment/initiate-payment", data);
    return response.data;
  },

  // Check payment status (for polling fallback)
  checkPaymentStatus: async (appointmentId: number): Promise<unknown> => {
    const response = await api.get(
      `/appointment/${appointmentId}/payment-status`
    );
    return response.data;
  },

  // Get doctor appointments with filters
  getDoctorAppointments: async (
    filters: DoctorAppointmentFilters
  ): Promise<DoctorAppointmentResponse> => {
    const response = await api.get("/appointment/doctor", { params: filters });
    return response.data;
  },

  // Get doctor appointment statistics
  getDoctorAppointmentStats:
    async (): Promise<DoctorAppointmentStatsResponse> => {
      const response = await api.get("/appointment/doctor/stats");
      return response.data;
    },
};
