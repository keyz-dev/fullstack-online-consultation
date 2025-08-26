import api from ".";
import { Consultation, DoctorAvailability, TimeSlot } from "../types";

export interface CreateConsultationData {
  doctorId: string;
  scheduledAt: string;
  type: "video_call" | "voice_call" | "chat" | "in_person";
  symptoms?: string[];
  notes?: string;
}

export interface UpdateConsultationData {
  scheduledAt?: string;
  type?: "video_call" | "voice_call" | "chat" | "in_person";
  symptoms?: string[];
  notes?: string;
  diagnosis?: string;
  prescription?: any;
}

export interface ConsultationFilters {
  status?: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show";
  type?: "video_call" | "voice_call" | "chat" | "in_person";
  startDate?: string;
  endDate?: string;
  doctorId?: string;
  patientId?: string;
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

export interface AvailabilityData {
  availabilities: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    maxPatients?: number;
    consultationDuration: number;
  }[];
}

export const consultationsAPI = {
  // ===== CONSULTATION/APPOINTMENT MANAGEMENT =====

  /**
   * Create a new consultation/appointment
   */
  async createConsultation(
    data: CreateConsultationData
  ): Promise<Consultation> {
    const response = await api.post("/consultation", data);
    return response.data.data;
  },

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
   * Get single consultation by ID
   */
  async getConsultation(id: string): Promise<Consultation> {
    const response = await api.get(`/consultation/${id}`);
    return response.data.data;
  },

  /**
   * Update consultation
   */
  async updateConsultation(
    id: string,
    data: UpdateConsultationData
  ): Promise<Consultation> {
    const response = await api.put(`/consultation/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete consultation (soft delete)
   */
  async deleteConsultation(id: string): Promise<void> {
    await api.delete(`/consultation/${id}`);
  },

  // ===== AVAILABILITY MANAGEMENT =====

  /**
   * Get doctor availability
   */
  async getDoctorAvailability(doctorId: string): Promise<DoctorAvailability[]> {
    const response = await api.get(`/consultation/availability/${doctorId}`);
    return response.data.data;
  },

  /**
   * Set doctor availability
   */
  async setDoctorAvailability(
    data: AvailabilityData
  ): Promise<DoctorAvailability[]> {
    const response = await api.post("/consultation/availability", data);
    return response.data.data;
  },

  /**
   * Get available time slots for a doctor
   */
  async getAvailableSlots(
    doctorId: string,
    date: string,
    type?: string
  ): Promise<TimeSlot[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("date", date);
    if (type) queryParams.append("type", type);

    const response = await api.get(
      `/consultation/slots/${doctorId}?${queryParams.toString()}`
    );
    return response.data.data;
  },

  // ===== CONSULTATION ACTIONS =====

  /**
   * Start consultation
   */
  async startConsultation(id: string): Promise<Consultation> {
    const response = await api.post(`/consultation/${id}/start`);
    return response.data.data;
  },

  /**
   * End consultation
   */
  async endConsultation(
    id: string,
    data: {
      diagnosis?: string;
      notes?: string;
      prescription?: any;
    }
  ): Promise<Consultation> {
    const response = await api.post(`/consultation/${id}/end`, data);
    return response.data.data;
  },

  /**
   * Cancel consultation
   */
  async cancelConsultation(id: string, reason?: string): Promise<Consultation> {
    const response = await api.post(`/consultation/${id}/cancel`, {
      reason,
    });
    return response.data.data;
  },

  /**
   * Reschedule consultation
   */
  async rescheduleConsultation(
    id: string,
    scheduledAt: string
  ): Promise<Consultation> {
    const response = await api.post(`/consultation/${id}/reschedule`, {
      scheduledAt,
    });
    return response.data.data;
  },

  // ===== REAL-TIME FEATURES =====

  /**
   * Join video call
   */
  async joinVideoCall(id: string): Promise<any> {
    const response = await api.post(`/consultation/${id}/join`);
    return response.data;
  },

  /**
   * Leave video call
   */
  async leaveVideoCall(id: string): Promise<any> {
    const response = await api.post(`/consultation/${id}/leave`);
    return response.data;
  },

  /**
   * Handle WebRTC signaling
   */
  async handleSignal(id: string, signal: any): Promise<any> {
    const response = await api.post(`/consultation/${id}/signal`, signal);
    return response.data;
  },

  // ===== CHAT MESSAGES =====

  /**
   * Send message
   */
  async sendMessage(id: string, message: string): Promise<any> {
    const response = await api.post(`/consultation/${id}/messages`, {
      message,
    });
    return response.data;
  },

  /**
   * Get messages
   */
  async getMessages(id: string): Promise<any[]> {
    const response = await api.get(`/consultation/${id}/messages`);
    return response.data.data;
  },

  // ===== RATINGS & REVIEWS =====

  /**
   * Rate consultation
   */
  async rateConsultation(
    id: string,
    rating: number,
    review?: string
  ): Promise<any> {
    const response = await api.post(`/consultation/${id}/rate`, {
      rating,
      review,
    });
    return response.data;
  },

  /**
   * Get consultation rating
   */
  async getConsultationRating(id: string): Promise<any> {
    const response = await api.get(`/consultation/${id}/rating`);
    return response.data.data;
  },

  // ===== ADMIN ENDPOINTS =====

  /**
   * Get all consultations (admin only)
   */
  async getAllConsultations(params?: {
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

    const response = await api.get(
      `/consultation/admin/all?${queryParams.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get consultation statistics (admin only)
   */
  async getConsultationStats(): Promise<any> {
    const response = await api.get("/consultation/admin/stats");
    return response.data.data;
  },
};
