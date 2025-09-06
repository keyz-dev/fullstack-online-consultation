import api from "./index";

export interface PharmacyApplicationData {
  id: number;
  userId: number;
  applicationType: "pharmacy";
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
  pharmacy?: {
    id: number;
    name: string;
    licenseNumber: string;
    description: string;
  };
  documents: Array<{
    id: number;
    documentType: string;
    fileName: string;
    fileUrl: string;
    verifiedAt?: string;
    verificationNotes?: string;
  }>;
}

export interface PharmacyApplicationResponse {
  success: boolean;
  message: string;
  data?: PharmacyApplicationData;
  error?: string;
}

// Response for activate account
export interface ActivateAccountResponse {
  success: boolean;
  message: string;
  data?: {
    role: string;
    applicationId: number;
  };
  error?: string;
}

class PharmacyAppApi {
  // Create pharmacy application
  async createPharmacySetup(
    formData: FormData
  ): Promise<PharmacyApplicationResponse> {
    try {
      const response = await api.post("/auth/register/pharmacy", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Get pharmacy application status
  async getApplicationStatus(
    applicationId: string
  ): Promise<PharmacyApplicationResponse> {
    try {
      const response = await api.get(
        `/userApplications/${applicationId}/status`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Get user's pharmacy applications
  async getUserApplications(): Promise<PharmacyApplicationResponse> {
    try {
      const response = await api.get("/userApplications/user");
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Reapply for rejected application
  async reapplyApplication(
    applicationId: string
  ): Promise<PharmacyApplicationResponse> {
    try {
      const response = await api.put(
        `/userApplications/${applicationId}/reapply`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Activate account after approval
  async activateAccount(
    applicationId: string
  ): Promise<ActivateAccountResponse> {
    try {
      const response = await api.post(
        `/userApplications/${applicationId}/activate`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Cancel pharmacy application
  async cancelApplication(
    applicationId: string
  ): Promise<PharmacyApplicationResponse> {
    try {
      const response = await api.delete(`/userApplications/${applicationId}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const pharmacyAppApi = new PharmacyAppApi();
