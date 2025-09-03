import api from ".";
import { Consultation } from "../types";

export interface ConsultationFilters {
  status?:
    | "not_started"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  type?: "video_call" | "in_person";
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface ConsultationListResponse {
  consultations: Consultation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ConsultationDetailsResponse {
  success: boolean;
  data: Consultation;
}

export interface InitiateCallResponse {
  success: boolean;
  data?: {
    roomId: string;
    consultationId: string;
  };
  message?: string;
}

export interface ActiveConsultationsResponse {
  success: boolean;
  data: {
    activeConsultations: Consultation[];
    count: number;
  };
}

export interface PatientPresenceResponse {
  success: boolean;
  data: {
    isOnline: boolean;
    lastSeen?: string;
    userId?: string;
  };
}

export const consultationsAPI = {
  /**
   * Get consultations with filtering and pagination (SECURE - Role-specific)
   * @param userRole - The role of the authenticated user ("doctor" or "patient")
   * @param params - Optional parameters for filtering and pagination
   */
  async getConsultations(
    userRole: "doctor" | "patient" | "admin",
    params?: {
      page?: number;
      limit?: number;
      filters?: ConsultationFilters;
    }
  ): Promise<ConsultationListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = userRole === "doctor" ? "/doctor" : "/patient";
    const response = await api.get(
      `/consultation${endpoint}?${queryParams.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get consultation details by ID (SECURE - Role-specific)
   * @param userRole - The role of the authenticated user ("doctor" or "patient")
   * @param id - The consultation ID
   */
  async getConsultation(
    userRole: "doctor" | "patient",
    id: string
  ): Promise<ConsultationDetailsResponse> {
    const response = await api.get(`/consultation/${id}`);

    console.log("Consultation details response: ", response.data);
    return response.data;
  },

  /**
   * Get consultation by appointment ID (SECURE - Role-specific)
   * @param userRole - The role of the authenticated user ("doctor" or "patient")
   * @param appointmentId - The appointment ID
   */
  async getConsultationByAppointment(
    userRole: "doctor" | "patient",
    appointmentId: string
  ): Promise<ConsultationDetailsResponse> {
    const response = await api.get(
      `/consultation/by-appointment?appointmentId=${appointmentId}`
    );
    return response.data;
  },

  /**
   * Check patient presence (SECURE - Role-specific)
   * @param patientId - The patient ID to check
   */
  async checkPatientPresence(
    patientId: string
  ): Promise<PatientPresenceResponse> {
    const response = await api.get(`/user/${patientId}/presence`);
    return response.data;
  },

  /**
   * Initiate a video call for a consultation
   * @param id - The consultation ID
   */
  async initiateCall(id: string): Promise<InitiateCallResponse> {
    const response = await api.post(`/consultation/${id}/initiate`);
    return response.data;
  },

  /**
   * Update consultation notes
   * @param id - The consultation ID
   * @param notes - The consultation notes
   * @param diagnosis - Optional diagnosis
   */
  async updateConsultationNotes(
    id: string,
    notes: string,
    diagnosis?: string
  ): Promise<{ success: boolean }> {
    const response = await api.put(`/consultation/${id}`, {
      notes,
      diagnosis,
    });
    return response.data;
  },

  /**
   * Get active consultations (SECURE - Role-specific)
   * @param userRole - The role of the authenticated user ("doctor" or "patient")
   */
  async getActiveConsultations(
    userRole: "doctor" | "patient"
  ): Promise<ActiveConsultationsResponse> {
    const endpoint = userRole === "doctor" ? "/doctor" : "/patient";
    const response = await api.get(`/consultation${endpoint}/active`);
    return response.data;
  },

  /**
   * Join consultation session
   * @param consultationId - The consultation ID
   */
  async joinConsultationSession(
    consultationId: string
  ): Promise<{ success: boolean }> {
    const response = await api.post(`/consultation/${consultationId}/join`);
    return response.data;
  },

  /**
   * Leave consultation session
   * @param consultationId - The consultation ID
   */
  async leaveConsultationSession(
    consultationId: string
  ): Promise<{ success: boolean }> {
    const response = await api.post(`/consultation/${consultationId}/leave`);
    return response.data;
  },

  /**
   * Get consultation session status
   * @param consultationId - The consultation ID
   */
  async getSessionStatus(
    consultationId: string
  ): Promise<{ success: boolean; data: any }> {
    const response = await api.get(
      `/consultation/${consultationId}/session-status`
    );
    return response.data;
  },

  /**
   * Update consultation session heartbeat
   * @param consultationId - The consultation ID
   */
  async updateHeartbeat(consultationId: string): Promise<{ success: boolean }> {
    const response = await api.post(
      `/consultation/${consultationId}/heartbeat`
    );
    return response.data;
  },

  /**
   * Start a consultation
   * @param consultationId - The consultation ID
   */
  async startConsultation(
    consultationId: string
  ): Promise<{ success: boolean }> {
    const response = await api.post(`/consultation/${consultationId}/start`);
    return response.data;
  },

  /**
   * Cancel a consultation
   * @param consultationId - The consultation ID
   */
  async cancelConsultation(
    consultationId: string
  ): Promise<{ success: boolean }> {
    const response = await api.post(`/consultation/${consultationId}/cancel`);
    return response.data;
  },
};
