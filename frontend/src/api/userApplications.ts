import api from ".";

// Types for user application tracking
export interface UserApplicationData {
  id: number;
  userId: number;
  applicationType: "doctor" | "pharmacy";
  typeId: number;
  status: "pending" | "under_review" | "approved" | "rejected" | "suspended";
  applicationVersion: number;
  adminReview?: {
    reviewedBy: number;
    reviewedAt: string;
    remarks?: string;
    rejectionReason?: string;
  };
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  suspendedAt?: string;
  rejectionReason?: string;
  suspensionReason?: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  doctor?: {
    id: number;
    licenseNumber: string;
    experience: number;
    bio: string;
    education?: string;
    languages?: string[];
    specialties?: string[];
    clinicAddress?: string;
    operationalHospital?: string;
    contactInfo?: any;
    consultationFee?: number;
    consultationDuration?: number;
    paymentMethods?: string[];
  };
  pharmacy?: {
    id: number;
    name: string;
    licenseNumber: string;
    description: string;
    logo?: string;
    images?: string[];
    address?: string;
    contactInfo?: any;
    operatingHours?: any;
    paymentMethods?: string[];
  };
  documents: Array<{
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
  }>;
}

// Response for getting user applications
export interface UserApplicationResponse {
  success: boolean;
  message: string;
  data?: UserApplicationData;
  error?: string;
}

// Response for refreshing application status
export interface RefreshApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    status: string;
    lastChecked: string;
  };
  error?: string;
}

// Response for activating account
export interface ActivateAccountResponse {
  success: boolean;
  message: string;
  data?: {
    role: string;
    applicationId: number;
    redirectUrl: string;
  };
  error?: string;
}

// Response for reapplying
export interface ReapplyResponse {
  success: boolean;
  message: string;
  data?: {
    applicationId: number;
    newVersion: number;
    status: string;
  };
  error?: string;
}

class UserApplicationsAPI {
  // Get current user's application
  async getMyApplication(): Promise<UserApplicationResponse> {
    try {
      const response = await api.get("/userApplications/me");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to fetch application",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Refresh application status
  async refreshApplicationStatus(): Promise<RefreshApplicationResponse> {
    try {
      const response = await api.post("/userApplications/me/refresh");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to refresh application status",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Activate account (when approved)
  async activateAccount(): Promise<ActivateAccountResponse> {
    try {
      const response = await api.post("/userApplications/me/activate");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to activate account",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Reapply for application (when rejected)
  async reapplyApplication(): Promise<ReapplyResponse> {
    try {
      const response = await api.post("/userApplications/me/reapply");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to reapply for application",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Get application timeline/history
  async getApplicationTimeline(): Promise<{
    success: boolean;
    message: string;
    data?: Array<{
      id: number;
      action: string;
      description: string;
      timestamp: string;
      status: string;
    }>;
    error?: string;
  }> {
    try {
      const response = await api.get("/userApplications/me/timeline");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to fetch application timeline",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Download application documents
  async downloadDocument(documentId: number): Promise<Blob> {
    try {
      const response = await api.get(
        `/userApplications/me/documents/${documentId}/download`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to download document"
      );
    }
  }

  // Get application statistics
  async getApplicationStats(): Promise<{
    success: boolean;
    message: string;
    data?: {
      totalApplications: number;
      currentStatus: string;
      daysSinceSubmission: number;
      estimatedReviewTime: string;
      lastUpdated: string;
    };
    error?: string;
  }> {
    try {
      const response = await api.get("/userApplications/me/stats");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to fetch application statistics",
        error: error.response?.data?.message || error.message,
      };
    }
  }
}

export const userApplicationsAPI = new UserApplicationsAPI();
