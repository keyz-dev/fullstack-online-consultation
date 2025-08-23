import api from "./index";

// Types
export interface Symptom {
  id: number;
  name: string;
  iconUrl?: string;
  specialtyId?: number;
  specialty?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SymptomStats {
  total: number;
  bySpecialty: Array<{
    specialtyId: number;
    specialtyName: string;
    count: number;
  }>;
  topSymptoms: Array<{
    id: number;
    name: string;
    specialtyName: string;
  }>;
}

export interface CreateSymptomRequest {
  name: string;
  specialtyId: number;
  symptomImage?: File;
}

export interface UpdateSymptomRequest {
  name?: string;
  specialtyId: number;
  symptomImage?: File;
}

export interface SymptomsResponse {
  success: boolean;
  data: Symptom[];
  stats: SymptomStats;
  total: number;
}

export interface SymptomResponse {
  success: boolean;
  data: Symptom;
}

export interface SymptomStatsResponse {
  success: boolean;
  data: SymptomStats;
}

// API Functions
export const symptomsAPI = {
  // Get all symptoms with filters and pagination
  getAllSymptoms: async (params?: {
    search?: string;
    specialtyId?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<SymptomsResponse> => {
    const response = await api.get("/symptom", { params });
    return response.data;
  },

  // Get symptom statistics
  getSymptomStats: async (): Promise<SymptomStatsResponse> => {
    const response = await api.get("/symptom/stats");
    return response.data;
  },

  // Get single symptom by ID
  getSymptomById: async (id: number): Promise<SymptomResponse> => {
    const response = await api.get(`/symptom/${id}`);
    return response.data;
  },

  // Create new symptom
  createSymptom: async (
    data: CreateSymptomRequest
  ): Promise<SymptomResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.specialtyId) {
      formData.append("specialtyId", data.specialtyId.toString());
    }
    if (data.symptomImage) {
      formData.append("symptomImage", data.symptomImage);
    }

    const response = await api.post("/symptom", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update symptom
  updateSymptom: async (
    id: number,
    data: UpdateSymptomRequest
  ): Promise<SymptomResponse> => {
    const formData = new FormData();
    if (data.name) {
      formData.append("name", data.name);
    }
    if (data.specialtyId !== undefined) {
      formData.append("specialtyId", data.specialtyId.toString());
    }
    if (data.symptomImage) {
      formData.append("symptomImage", data.symptomImage);
    }

    const response = await api.put(`/symptom/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete symptom
  deleteSymptom: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/symptom/${id}`);
    return response.data;
  },
};

export default symptomsAPI;
