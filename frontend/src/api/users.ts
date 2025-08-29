import api from "./index";

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  gender?: string;
  dob?: string;
  address?: any;
  phoneNumber?: string;
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;

  patient?: {
    id: number;
    phoneNumber?: string;
    emergencyContact?: string;
    medicalHistory?: string;
    allergies?: string;
    bloodType?: string;
    height?: number;
    weight?: number;
  };
  doctor?: {
    id: number;
    licenseNumber?: string;
    experience?: number;
    bio?: string;
    education?: string;
    languages?: string[];
    specialties?: string[];
    clinicAddress?: string;
    operationalHospital?: string;
    contactInfo?: any;
    consultationFee?: number;
    consultationDuration?: number;
    paymentMethods?: string[];
    documents?: any;
    isVerified?: boolean;
    isApproved?: boolean;
    averageRating?: number;
    totalReviews?: number;
  };
  pharmacy?: {
    id: number;
    name?: string;
    licenseNumber?: string;
    description?: string;
    logo?: string;
    images?: string[];
    address?: any;
    contactInfo?: any;
    deliveryInfo?: any;
    paymentMethods?: string[];
    documents?: any;
    isVerified?: boolean;
    isApproved?: boolean;
    averageRating?: number;
    totalReviews?: number;
  };
  activityLogs?: Array<{
    id: number;
    action: string;
    description: string;
    createdAt: string;
  }>;
}

export interface UserStats {
  total: number;
  active: number;
  verified: number;
  recentRegistrations: number;
  byRole: {
    [key: string]: number;
  };
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface UserStatsResponse {
  success: boolean;
  data: UserStats;
}

export interface UserActivityResponse {
  success: boolean;
  data: Array<{
    id: number;
    action: string;
    description: string;
    createdAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

// API Functions
export const usersAPI = {
  // Get all users with filters and pagination
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    verified?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<UsersResponse> => {
    const response = await api.get("/user", { params });
    return response;
  },

  // Get user statistics
  getUserStats: async (): Promise<UserStatsResponse> => {
    const response = await api.get("/user/stats");
    return response;
  },

  // Get single user by ID
  getUserById: async (id: number): Promise<UserResponse> => {
    const response = await api.get(`/user/${id}`);
    return response;
  },

  // Update user status
  updateUserStatus: async (
    id: number,
    data: UpdateUserStatusRequest
  ): Promise<UserResponse> => {
    const response = await api.patch(`/user/${id}/status`, data);
    return response;
  },

  // Get user activity logs
  getUserActivity: async (
    id: number,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<UserActivityResponse> => {
    const response = await api.get(`/user/${id}/activity`, { params });
    return response;
  },
};
