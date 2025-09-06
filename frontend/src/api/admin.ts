import api from ".";

export interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ApplicationDocument {
  id: number;
  documentType: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  expiryDate?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  uploadedAt: string;
}

export interface ApplicationUser {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface ApplicationDoctor {
  id: number;
  licenseNumber: string;
  experience: number;
  bio?: string;
  education?: unknown[];
  languages?: string[];
  specialties?: unknown[];
  clinicAddress?: unknown;
  operationalHospital?: string;
  contactInfo?: unknown;
  consultationFee?: unknown;
  consultationDuration?: number;
  paymentMethods?: unknown[];
}

export interface ApplicationPharmacy {
  id: number;
  name: string;
  licenseNumber: string;
  description?: string;
  logo?: string;
  images?: string[];
  address?: unknown;
  contactInfo?: unknown;
  operatingHours?: unknown;
  paymentMethods?: unknown[];
}

export interface Application {
  id: number;
  userId: number;
  applicationType: "doctor" | "pharmacy";
  typeId: number;
  status: "pending" | "under_review" | "approved" | "rejected" | "suspended";
  applicationVersion: number;
  adminReview?: unknown;
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  suspendedAt?: string;
  rejectionReason?: string;
  suspensionReason?: string;
  user: ApplicationUser;
  doctor?: ApplicationDoctor;
  pharmacy?: ApplicationPharmacy;
  documents: ApplicationDocument[];
}

export interface ApplicationsResponse {
  applications: Application[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalApplications: number;
    limit: number;
  };
}

export interface StatsResponse {
  stats: ApplicationStats;
}

export interface DocumentReview {
  documentId: number;
  isApproved: boolean;
  remarks?: string;
}

export interface ReviewApplicationData {
  status: "approved" | "rejected";
  remarks?: string;
  rejectionReason?: string;
  documentReviews?: DocumentReview[];
}

class AdminAPI {
  // Get all applications with filtering and pagination
  async getApplications(params?: {
    page?: number;
    limit?: number;
    status?: string;
    applicationType?: string;
    search?: string;
  }): Promise<ApplicationsResponse> {
    const response = await api.get("/admin/applications", { params });
    return response.data.data; // Access the nested data property
  }

  // Get application statistics
  async getApplicationStats(): Promise<StatsResponse> {
    const response = await api.get("/admin/applications/stats");
    return response.data.data; // Access the nested data property
  }

  // Get single application with details
  async getApplication(id: number): Promise<{ data: Application }> {
    const response = await api.get(`/admin/applications/${id}`);
    return response.data.data; // Access the nested data property
  }

  // Review application (approve/reject)
  async reviewApplication(
    id: number,
    reviewData: ReviewApplicationData
  ): Promise<{ data: Application }> {
    const response = await api.put(
      `/admin/applications/${id}/review`,
      reviewData
    );
    return response.data;
  }
}

export const adminApi = new AdminAPI();
