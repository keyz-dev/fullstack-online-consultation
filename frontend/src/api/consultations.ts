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

export interface InitiateCallResponse {
  success: boolean;
  message: string;
  data?: {
    roomId: string;
    consultationId: string;
    patientId: string;
    patientName: string;
    patientAvatar?: string;
    patientEmail: string;
  };
}

export interface ConsultationDetailsResponse {
  success: boolean;
  data: {
    consultations: Consultation[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
    success: boolean;
  };
}

export interface PatientPresenceResponse {
  success: boolean;
  data: {
    isOnline: boolean;
    lastSeen?: string;
    userId: string;
  };
}

export const consultationsAPI = {
  /**
   * Get consultations with filtering and pagination
   */
  async getConsultations(params?: {
    page?: number;
    limit?: number;
    filters?: ConsultationFilters;
  }): Promise<ConsultationListResponse> {
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

    const response = await api.get(`/consultation?${queryParams.toString()}`);
    return response.data.data;
  },

  /**
   * Get consultation details by ID
   */
  async getConsultation(id: string): Promise<ConsultationDetailsResponse> {
    const response = await api.get(`/consultation/${id}`);
    return response.data;
  },

  /**
   * Get consultation by appointment ID
   */
  async getConsultationByAppointment(
    appointmentId: string
  ): Promise<ConsultationDetailsResponse> {
    const response = await api.get(
      `/consultation?appointmentId=${appointmentId}`
    );
    return response.data;
  },

  /**
   * Check if patient is online
   */
  async checkPatientPresence(
    patientId: string
  ): Promise<PatientPresenceResponse> {
    const response = await api.get(`/user/${patientId}/presence`);
    return response.data;
  },

  /**
   * Initiate a video call for a consultation
   */
  async initiateCall(id: string): Promise<InitiateCallResponse> {
    const response = await api.post(`/consultation/${id}/initiate`);
    return response.data;
  },

  /**
   * Update consultation notes
   */
  async updateConsultationNotes(
    id: string,
    notes: string,
    diagnosis?: string
  ): Promise<{ success: boolean }> {
    const response = await api.put(`/consultation/${id}`, {
      notes,
      ...(diagnosis && { diagnosis }),
    });
    return response.data;
  },
};
