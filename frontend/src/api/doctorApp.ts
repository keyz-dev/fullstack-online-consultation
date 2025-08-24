import api, { Address } from "./index";

export interface DoctorApplicationData {
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

export interface DoctorApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    applicationId: string;
    status: string;
  };
  error?: string;
}

class DoctorAppApi {
  // Create doctor application
  async createDoctorSetup(
    formData: FormData
  ): Promise<DoctorApplicationResponse> {
    try {
      const response = await api.post("/auth/register/doctor", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Get doctor application status
  async getApplicationStatus(
    applicationId: string
  ): Promise<DoctorApplicationResponse> {
    try {
      const response = await api.get(
        `/doctor-applications/${applicationId}/status`
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Get user's doctor applications
  async getUserApplications(): Promise<DoctorApplicationResponse> {
    try {
      const response = await api.get("/doctor-applications/user");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Update doctor application
  async updateApplication(
    applicationId: string,
    formData: FormData
  ): Promise<DoctorApplicationResponse> {
    try {
      const response = await api.put(
        `/doctor-applications/${applicationId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Cancel doctor application
  async cancelApplication(
    applicationId: string
  ): Promise<DoctorApplicationResponse> {
    try {
      const response = await api.delete(
        `/doctor-applications/${applicationId}`
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export const doctorAppApi = new DoctorAppApi();
