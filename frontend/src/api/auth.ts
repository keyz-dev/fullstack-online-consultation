import api, { API_BASE_URL } from "./index";

export interface Address {
  street?: string;
  fullAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ContactInfo {
  type: string;
  value: string;
}

export interface PaymentMethod {
  method: string;
  value: {
    accountNumber: string;
    accountName: string;
    bankName?: string;
    accountType?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  dob?: string;
  phoneNumber?: string;
  gender?: string;
  licenseNumber?: string;
  experience?: number;
  bio?: string;
  role: "admin" | "doctor" | "patient" | "pharmacy";
  avatar?: string;
  emailVerified: boolean;
  isApproved: boolean;
  isActive: boolean;
  contactInfo?: ContactInfo[];
  paymentMethods?: PaymentMethod[];
  address?: Address;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  languages?: string[];
  specialties?: string[];
  clinicAddress?: Address;
  operationalHospital?: string;
  consultationFee?: number;
  consultationDuration?: number;
  doctorDocument?: File[];
  pharmacyDocument?: File[];
  pharmacyImage?: File[];
  pharmacyLogo?: File;
}

// ==================== LOGIN INTERFACES ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  access_token: string;
}

// ==================== REGISTRATION INTERFACES ====================
export interface BaseUserData {
  name: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  password: string;
  address?: Address;
  avatar?: File;
}

export interface AdminRegisterRequest extends BaseUserData {
  // Admin has minimal requirements - no additional fields needed
  _type?: "admin"; // Type discriminator to avoid empty interface warning
}

export interface PatientRegisterRequest extends BaseUserData {
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  address?: Address;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
  contactInfo?: ContactInfo[];
}

export interface DoctorRegisterRequest extends BaseUserData {
  licenseNumber: string;
  experience: number;
  bio?: string;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  languages?: string[];
  specialties: string[];
  clinicAddress: Address;
  operationalHospital?: string;
  contactInfo?: ContactInfo[];
  consultationFee: number;
  consultationDuration?: number;
  paymentMethods?: PaymentMethod[];
  doctorDocument?: File[]; // Multiple documents
}

export interface PharmacyRegisterRequest extends BaseUserData {
  pharmacyName: string;
  licenseNumber: string;
  description?: string;
  address: Address;
  contactInfo?: ContactInfo[];
  deliveryInfo?: {
    deliveryRadius?: number;
    deliveryFee?: number;
    deliveryTime?: string;
  };
  paymentMethods?: PaymentMethod[];
  pharmacyLogo?: File;
  pharmacyImage?: File[]; // Multiple images
  pharmacyDocument?: File[]; // Multiple documents
}

// ==================== OTHER INTERFACES ====================
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token?: string;
  };
}

export interface VerifyTokenResponse {
  status: string;
  message: string;
  data: {
    user: User;
  };
}

class AuthAPI {
  // ==================== LOGIN METHODS ====================

  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  }

  // Google OAuth login
  async googleLogin(googleData: GoogleLoginRequest): Promise<AuthResponse> {
    const response = await api.post("/auth/google-login", googleData);
    return response.data;
  }

  // ==================== REGISTRATION METHODS ====================

  // Admin registration
  async registerAdmin(userData: AdminRegisterRequest): Promise<AuthResponse> {
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (key === "address") {
        formData.append(key, JSON.stringify(value));
      } else if (value) {
        formData.append(key, value);
      }
    });

    const response = await api.post("/auth/register/admin", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  // Patient registration
  async registerPatient(
    userData: PatientRegisterRequest
  ): Promise<AuthResponse> {
    const formData = new FormData();

    // Basic fields
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    // Optional fields
    if (userData.phoneNumber) {
      formData.append("phoneNumber", userData.phoneNumber);
    }
    if (userData.gender) {
      formData.append("gender", userData.gender);
    }
    if (userData.dob) {
      formData.append("dob", userData.dob);
    }

    // Address
    if (userData.address) {
      formData.append("address", JSON.stringify(userData.address));
    }

    // Emergency contact
    if (userData.emergencyContact) {
      formData.append("emergencyContact[name]", userData.emergencyContact.name);
      formData.append(
        "emergencyContact[phoneNumber]",
        userData.emergencyContact.phoneNumber
      );
      formData.append(
        "emergencyContact[relationship]",
        userData.emergencyContact.relationship
      );
    }

    // Avatar
    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }

    const response = await api.post("/auth/register/patient", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  // Doctor registration
  async registerDoctor(userData: DoctorRegisterRequest): Promise<AuthResponse> {
    const formData = new FormData();

    // Basic fields
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    // Doctor specific fields
    formData.append("licenseNumber", userData.licenseNumber);
    formData.append("experience", userData.experience.toString());
    formData.append("consultationFee", userData.consultationFee.toString());

    if (userData.bio) {
      formData.append("bio", userData.bio);
    }
    if (userData.consultationDuration) {
      formData.append(
        "consultationDuration",
        userData.consultationDuration.toString()
      );
    }
    if (userData.operationalHospital) {
      formData.append("operationalHospital", userData.operationalHospital);
    }

    // Arrays and objects
    if (userData.education) {
      userData.education.forEach((edu, index) => {
        formData.append(`education[${index}][degree]`, edu.degree);
        formData.append(`education[${index}][institution]`, edu.institution);
        formData.append(`education[${index}][year]`, edu.year);
      });
    }

    if (userData.languages) {
      userData.languages.forEach((lang, index) => {
        formData.append(`languages[${index}]`, lang);
      });
    }

    userData.specialties.forEach((specialty, index) => {
      formData.append(`specialties[${index}]`, specialty);
    });

    // Address
    if (userData.clinicAddress) {
      formData.append("clinicAddress", JSON.stringify(userData.clinicAddress));
    }

    // Contact info
    if (userData.contactInfo) {
      formData.append("contactInfo", JSON.stringify(userData.contactInfo));
    }

    // Payment methods
    if (userData.paymentMethods) {
      formData.append(
        "paymentMethods",
        JSON.stringify(userData.paymentMethods)
      );
    }

    // Files
    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }

    if (userData.doctorDocument) {
      userData.doctorDocument.forEach((file, index) => {
        formData.append(`doctorDocument`, file);
      });
    }

    const response = await api.post("/auth/register/doctor", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  // Pharmacy registration
  async registerPharmacy(
    userData: PharmacyRegisterRequest
  ): Promise<AuthResponse> {
    const formData = new FormData();

    // Basic fields
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    // Pharmacy specific fields
    formData.append("pharmacyName", userData.pharmacyName);
    formData.append("licenseNumber", userData.licenseNumber);

    if (userData.description) {
      formData.append("description", userData.description);
    }

    // Address
    if (userData.address) {
      formData.append("address", JSON.stringify(userData.address));
    }
    // Contact info
    if (userData.contactInfo) {
      formData.append("contactInfo", JSON.stringify(userData.contactInfo));
    }

    // Delivery info
    if (userData.deliveryInfo) {
      if (userData.deliveryInfo.deliveryRadius) {
        formData.append(
          "deliveryInfo[deliveryRadius]",
          userData.deliveryInfo.deliveryRadius.toString()
        );
      }
      if (userData.deliveryInfo.deliveryFee) {
        formData.append(
          "deliveryInfo[deliveryFee]",
          userData.deliveryInfo.deliveryFee.toString()
        );
      }
      if (userData.deliveryInfo.deliveryTime) {
        formData.append(
          "deliveryInfo[deliveryTime]",
          userData.deliveryInfo.deliveryTime
        );
      }
    }

    // Payment methods
    if (userData.paymentMethods) {
      formData.append(
        "paymentMethods",
        JSON.stringify(userData.paymentMethods)
      );
    }

    // Files
    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }

    if (userData.pharmacyLogo) {
      formData.append("pharmacyLogo", userData.pharmacyLogo);
    }

    if (userData.pharmacyImage) {
      userData.pharmacyImage.forEach((file) => {
        formData.append("pharmacyImage", file);
      });
    }

    if (userData.pharmacyDocument) {
      userData.pharmacyDocument.forEach((file) => {
        formData.append("pharmacyDocument", file);
      });
    }

    const response = await api.post("/auth/register/pharmacy", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  // ==================== OTHER AUTH METHODS ====================

  // Verify token
  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    const response = await api.get("/auth/verify-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  // Forgot password
  async forgotPassword(
    emailData: ForgotPasswordRequest
  ): Promise<{ status: string; message: string }> {
    const response = await api.post("/auth/forgot-password", emailData);
    return response.data;
  }

  // Reset password
  async resetPassword(
    resetData: ResetPasswordRequest
  ): Promise<{ status: string; message: string }> {
    const response = await api.post("/auth/reset-password", resetData);
    return response.data;
  }

  // Verify email
  async verifyEmail(verifyData: VerifyEmailRequest): Promise<{
    status: string;
    message: string;
    data: { user: User; token: string };
  }> {
    const response = await api.post("/auth/verify-email", verifyData);
    return response.data;
  }

  // ==================== TOKEN MANAGEMENT ====================

  // Logout (client-side only)
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  // Get stored token
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  // Set token
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  // Remove token
  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }
}

export default new AuthAPI();
