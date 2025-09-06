import api from '.';

export interface Prescription {
  id: number;
  consultationId: number;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  diagnosis?: string;
  medications: unknown[];
  instructions?: string;
  dosage?: unknown;
  duration?: number;
  startDate: string;
  endDate?: string;
  refills: number;
  refillsRemaining: number;
  notes?: string;
  sideEffects?: string[];
  contraindications?: string[];
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrescriptionData {
  consultationId: number;
  diagnosis?: string;
  medications: unknown[];
  instructions?: string;
  dosage?: unknown;
  duration?: number;
  refills?: number;
  notes?: string;
  sideEffects?: string[];
  contraindications?: string[];
}

export interface PrescriptionResponse {
  status: string;
  message: string;
  data: {
    prescription: Prescription;
  };
}

export interface PrescriptionsResponse {
  status: string;
  data: {
    prescriptions: Prescription[];
    count: number;
  };
}

export interface PrescriptionStatsResponse {
  status: string;
  data: {
    stats: {
      total: number;
      active: number;
      completed: number;
    };
  };
}

class PrescriptionsApi {
  // Create a new prescription
  async createPrescription(data: CreatePrescriptionData): Promise<PrescriptionResponse> {
    try {
      const response = await api.post('/prescriptions', data);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Get prescription by ID
  async getPrescriptionById(prescriptionId: number): Promise<PrescriptionResponse> {
    try {
      const response = await api.get(`/prescriptions/${prescriptionId}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Get prescriptions by consultation ID
  async getPrescriptionsByConsultation(consultationId: number): Promise<PrescriptionsResponse> {
    try {
      const response = await api.get(`/prescriptions/consultation/${consultationId}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Update prescription
  async updatePrescription(prescriptionId: number, data: Partial<CreatePrescriptionData>): Promise<PrescriptionResponse> {
    try {
      const response = await api.put(`/prescriptions/${prescriptionId}`, data);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Delete prescription
  async deletePrescription(prescriptionId: number): Promise<{ status: string; message: string }> {
    try {
      const response = await api.delete(`/prescriptions/${prescriptionId}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Generate prescription PDF
  async generatePrescriptionPDF(prescriptionId: number): Promise<{ status: string; message: string; data: { prescriptionId: number; status: string } }> {
    try {
      const response = await api.post(`/prescriptions/${prescriptionId}/generate-pdf`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Get prescription statistics
  async getPrescriptionStats(doctorId?: number, patientId?: number): Promise<PrescriptionStatsResponse> {
    try {
      const params = new URLSearchParams();
      if (doctorId) params.append('doctorId', doctorId.toString());
      if (patientId) params.append('patientId', patientId.toString());

      const response = await api.get(`/prescriptions/stats?${params.toString()}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export default new PrescriptionsApi();
