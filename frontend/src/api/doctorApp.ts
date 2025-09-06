import api, { Address } from "./index";

// Input data for creating doctor application
export interface DoctorApplicationInput {
  // Basic Information
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  experience: number;
  bio: string;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  languages?: string[];

  // Specialties
  specialties?: string[];

  // Address & Location
  clinicAddress?: Address;
  operationalHospital?: string;

  // Documents
  documents?: Array<{
    file: File;
    documentName: string;
  }>;

  // Payment Setup
  consultationFee?: number;
  consultationDuration?: number;
  paymentMethods?: string[];

  // Terms
  agreedToTerms?: boolean;
}

// Application data structure returned by backend
export interface DoctorApplicationData {
  id: number;
  userId: number;
  applicationType: "doctor";
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

// Response for getting user applications
export interface DoctorApplicationResponse {
  success: boolean;
  message: string;
  data?: DoctorApplicationData;
  error?: string;
}

// Response for create application
export interface CreateDoctorApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    applicationId: string;
    status: string;
  };
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

class DoctorAppApi {
  // Create doctor application
  async createDoctorSetup(
    formData: FormData
  ): Promise<CreateDoctorApplicationResponse> {
    try {
      const response = await api.post("/auth/register/doctor", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Get doctor application status
  async getApplicationStatus(
    applicationId: string
  ): Promise<DoctorApplicationResponse> {
    try {
      const response = await api.get(
        `/userApplications/${applicationId}/status`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Get user's doctor applications
  async getUserApplications(): Promise<DoctorApplicationResponse> {
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
  ): Promise<DoctorApplicationResponse> {
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

  // Cancel doctor application
  async cancelApplication(
    applicationId: string
  ): Promise<DoctorApplicationResponse> {
    try {
      const response = await api.delete(`/userApplications/${applicationId}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const doctorAppApi = new DoctorAppApi();
