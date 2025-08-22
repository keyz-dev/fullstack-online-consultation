import api from "./index";

// Types
export interface Specialty {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: {
    doctorCount: number;
    symptomCount: number;
  };
  symptoms?: Array<{
    id: number;
    name: string;
    iconUrl?: string;
    specialtyId: number;
  }>;
}

export interface SpecialtyStats {
  total: number;
  active: number;
  inactive: number;
  topSpecialties: Array<{
    id: number;
    name: string;
    doctorCount: number;
  }>;
}

export interface CreateSpecialtyRequest {
  name: string;
  description?: string;
  specialtyImage?: File;
}

export interface UpdateSpecialtyRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
  specialtyImage?: File;
}

export interface SpecialtiesResponse {
  success: boolean;
  data: Specialty[];
  stats: SpecialtyStats;
  total: number;
}

export interface SpecialtyResponse {
  success: boolean;
  data: Specialty;
}

export interface SpecialtyStatsResponse {
  success: boolean;
  data: SpecialtyStats;
}

// API Functions
export const specialtiesAPI = {
  // Get all specialties with filters and pagination
  getAllSpecialties: async (params?: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<SpecialtiesResponse> => {
    const response = await api.get("/specialty", { params });
    return response.data;
  },

  // Get specialty statistics
  getSpecialtyStats: async (): Promise<SpecialtyStatsResponse> => {
    const response = await api.get("/specialty/stats");
    return response.data;
  },

  // Get single specialty by ID
  getSpecialtyById: async (id: number): Promise<SpecialtyResponse> => {
    const response = await api.get(`/specialty/${id}`);
    return response.data;
  },

  // Create new specialty
  createSpecialty: async (
    data: CreateSpecialtyRequest
  ): Promise<SpecialtyResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.specialtyImage) {
      formData.append("specialtyImage", data.specialtyImage);
    }

    const response = await api.post("/specialty", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update specialty
  updateSpecialty: async (
    id: number,
    data: UpdateSpecialtyRequest
  ): Promise<SpecialtyResponse> => {
    const formData = new FormData();
    if (data.name) {
      formData.append("name", data.name);
    }
    if (data.description !== undefined) {
      formData.append("description", data.description);
    }
    if (data.isActive !== undefined) {
      formData.append("isActive", data.isActive.toString());
    }
    if (data.specialtyImage) {
      formData.append("specialtyImage", data.specialtyImage);
    }

    const response = await api.put(`/specialty/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete specialty
  deleteSpecialty: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/specialty/${id}`);
    return response.data;
  },
};

export default specialtiesAPI;
