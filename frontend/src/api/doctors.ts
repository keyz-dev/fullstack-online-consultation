import api from ".";

// ==================== TYPES ====================

export interface DoctorUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  age?: number;
}

export interface DoctorSpecialty {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

export interface DoctorAvailability {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  consultationType: "online" | "physical" | "both";
  consultationFee: number;
  isActive: boolean;
}

export interface Doctor {
  id: number;
  licenseNumber: string;
  experience: number;
  bio?: string;
  education?: string[];
  languages?: string[];
  clinicAddress?: any;
  operationalHospital?: string;
  contactInfo?: any;
  consultationFee: number;
  consultationDuration: number;
  paymentMethods?: any;
  isVerified: boolean;
  isActive: boolean;
  averageRating?: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  user: DoctorUser;
  specialties: DoctorSpecialty[];
  availabilities?: DoctorAvailability[];
}

export interface DoctorFilters {
  search?: string;
  specialtyId?: number;
  symptomId?: number;
  experience?: string;
  consultationFeeMin?: number;
  consultationFeeMax?: number;
  rating?: number;
  availability?: "online" | "physical" | "both";
  sortBy?: "name" | "experience" | "rating" | "fee";
  sortOrder?: "ASC" | "DESC";
}

export interface DoctorSearchParams extends DoctorFilters {
  page?: number;
  limit?: number;
}

export interface DoctorsResponse {
  success: boolean;
  data: {
    doctors: Doctor[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface DoctorResponse {
  success: boolean;
  data: Doctor;
}

export interface DoctorSearchResponse {
  success: boolean;
  data: {
    doctors: Doctor[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// ==================== API CLASS ====================

class DoctorsApi {
  // Get all doctors with filters and pagination
  async getAllDoctors(
    params: DoctorSearchParams = {}
  ): Promise<DoctorsResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get(`/doctor?${queryParams}`);
    return response.data;
  }

  // Get doctor by ID with full details
  async getDoctorById(id: number): Promise<DoctorResponse> {
    const response = await api.get(`/doctor/${id}`);
    return response.data;
  }

  // Search doctors by name
  async searchDoctors(
    query: string,
    page?: number,
    limit?: number
  ): Promise<DoctorSearchResponse> {
    const params = new URLSearchParams();
    params.append("q", query);

    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await api.get(`/doctor/search?${params}`);
    return response.data;
  }
}

export const doctorsApi = new DoctorsApi();
