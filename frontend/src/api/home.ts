import api from ".";

export interface Specialty {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  doctorCount?: number;
}

export interface Symptom {
  id: number;
  name: string;
  iconUrl?: string;
  specialtyId?: number;
}

export interface Testimonial {
  id: number;
  userId: number;
  doctorId?: number;
  pharmacyId?: number;
  rating: number;
  message: string;
  isApproved: boolean;
  isActive: boolean;
  user?: {
    name: string;
    role: string;
  };
}

export interface QAndA {
  id: number;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  priority: number;
}

export interface Service {
  name: string;
  image: string;
  description: string;
}

export interface Statistics {
  doctorCount: number;
  patientCount: number;
  satisfactionRate: number;
}

export interface HomeData {
  specialties: Specialty[];
  symptoms: Symptom[];
  testimonials: Testimonial[];
  qa: QAndA[];
  stats: Statistics;
  services: Service[];
}

export const homeApi = {
  // Get home page data
  getHomeData: async (): Promise<{ success: boolean; data: HomeData }> => {
    const response = await api.get("/home/data");
    return response.data;
  },

  // Get all specialties
  getSpecialties: async (): Promise<{
    success: boolean;
    data: Specialty[];
  }> => {
    const response = await api.get("/home/specialties");
    return response.data;
  },

  // Get specialty details by ID
  getSpecialtyDetails: async (
    id: number
  ): Promise<{ success: boolean; data: Specialty }> => {
    const response = await api.get(`/home/specialties/${id}`);
    return response.data;
  },

  // Get all symptoms
  getSymptoms: async (): Promise<{ success: boolean; data: Symptom[] }> => {
    const response = await api.get("/home/symptoms");
    return response.data;
  },

  // Search specialties
  searchSpecialties: async (
    query: string,
    limit?: number
  ): Promise<{
    success: boolean;
    data: Specialty[];
  }> => {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (limit) params.append("limit", limit.toString());

    const response = await api.get(`/home/specialties/search?${params}`);
    return response.data;
  },

  // Get doctors by specialty
  getDoctorsBySpecialty: async (
    specialtyId: number,
    page?: number,
    limit?: number
  ): Promise<{
    success: boolean;
    data: {
      doctors: unknown[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
      specialty: {
        id: number;
        name: string;
        description?: string;
      };
    };
  }> => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await api.get(
      `/home/doctors/by-specialty/${specialtyId}?${params}`
    );
    return response.data;
  },
};
