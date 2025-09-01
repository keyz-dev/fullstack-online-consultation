import api from "./index";

export interface Medication {
  id: number;
  name: string;
  genericName?: string;
  description?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
  price: number;
  currency: string;
  stockQuantity: number;
  isAvailable: boolean;
  requiresPrescription: boolean;
  category?: string;
  sideEffects: string[];
  contraindications: string[];
  expiryDate?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationStats {
  total: number;
  available: number;
  outOfStock: number;
  expiringSoon: number;
  requiresPrescription: number;
  overTheCounter: number;
}

export interface MedicationFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isAvailable?: boolean;
  requiresPrescription?: boolean;
}

export interface MedicationResponse {
  status: string;
  message: string;
  data: {
    medications: Medication[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface MedicationStatsResponse {
  status: string;
  message: string;
  data: MedicationStats;
}

export interface SingleMedicationResponse {
  status: string;
  message: string;
  data: Medication;
}

export interface BulkImportResponse {
  status: string;
  message: string;
  data: {
    imported: number;
    errors: string[];
    total: number;
  };
}

class PharmacyMedicationsApi {
  // Get all medications with pagination and filtering
  async getMedications(filters: MedicationFilters = {}): Promise<MedicationResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.isAvailable !== undefined) params.append('isAvailable', filters.isAvailable.toString());
      if (filters.requiresPrescription !== undefined) params.append('requiresPrescription', filters.requiresPrescription.toString());

      const response = await api.get(`/pharmacyDrugs?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Get medication statistics
  async getMedicationStats(): Promise<MedicationStatsResponse> {
    try {
      const response = await api.get('/pharmacyDrugs/stats');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Get single medication by ID
  async getMedication(id: number): Promise<SingleMedicationResponse> {
    try {
      const response = await api.get(`/pharmacyDrugs/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Create new medication
  async createMedication(medicationData: FormData): Promise<SingleMedicationResponse> {
    try {
      const response = await api.post('/pharmacyDrugs', medicationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Update medication
  async updateMedication(id: number, medicationData: FormData): Promise<SingleMedicationResponse> {
    try {
      const response = await api.put(`/pharmacyDrugs/${id}`, medicationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Delete medication
  async deleteMedication(id: number): Promise<{ status: string; message: string }> {
    try {
      const response = await api.delete(`/pharmacyDrugs/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Update medication stock
  async updateMedicationStock(id: number, stockQuantity: number): Promise<SingleMedicationResponse> {
    try {
      const response = await api.patch(`/pharmacyDrugs/${id}/stock`, {
        stockQuantity,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Bulk import medications (file-based)
  async bulkImportMedications(file: File): Promise<BulkImportResponse> {
    try {
      const formData = new FormData();
      formData.append('medicationFile', file);

      const response = await api.post('/pharmacyDrugs/bulk-import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Bulk create medications from processed data
  async bulkCreateMedications(medications: any[]): Promise<BulkImportResponse> {
    try {
      const response = await api.post('/pharmacyDrugs/bulk-create', {
        medications: medications
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Download medication import template
  async downloadTemplate(): Promise<Blob> {
    try {
      const response = await api.get('/pharmacyDrugs/template/download', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export const pharmacyMedicationsApi = new PharmacyMedicationsApi();
