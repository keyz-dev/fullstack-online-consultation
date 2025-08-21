import api from ".";

export interface Specialty {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
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
};
