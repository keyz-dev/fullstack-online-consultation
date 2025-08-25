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
  role:
    | "admin"
    | "doctor"
    | "patient"
    | "pharmacy"
    | "pending_doctor"
    | "pending_pharmacy"
    | "incomplete_doctor"
    | "incomplete_pharmacy";
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

export interface InitiateRegistrationRequest extends BaseUserData {
  // Basic user data for initial registration
  // No additional fields needed beyond BaseUserData
  _type?: "initiate"; // Type discriminator to avoid empty interface warning
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

// Type for doctor application data (without user data)
export interface DoctorApplicationData {
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
  documents?: any;
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

// Type for pharmacy application data (without user data)
export interface PharmacyApplicationData {
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
  pharmacyImage?: File[];
  pharmacyDocument?: File[];
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

  // Initiate registration (basic user info only)
  async initiateRegistration(
    userData: InitiateRegistrationRequest,
    role: "doctor" | "pharmacy"
  ): Promise<AuthResponse> {
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (key === "address") {
        formData.append(key, JSON.stringify(value));
      } else if (value) {
        formData.append(key, value);
      }
    });

    const response = await api.post(
      `/auth/register/${role}/initiate`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }

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

  // Doctor registration (application submission only)
  async registerDoctor(
    doctorData: DoctorApplicationData
  ): Promise<AuthResponse> {
    const formData = new FormData();

    // Doctor specific fields
    formData.append("licenseNumber", doctorData.licenseNumber);
    formData.append("experience", doctorData.experience.toString());
    formData.append("consultationFee", doctorData.consultationFee.toString());

    if (doctorData.bio) {
      formData.append("bio", doctorData.bio);
    }
    if (doctorData.consultationDuration) {
      formData.append(
        "consultationDuration",
        doctorData.consultationDuration.toString()
      );
    }
    if (doctorData.operationalHospital) {
      formData.append("operationalHospital", doctorData.operationalHospital);
    }

    // Arrays and objects
    if (doctorData.education) {
      doctorData.education.forEach((edu, index) => {
        formData.append(`education[${index}][degree]`, edu.degree);
        formData.append(`education[${index}][institution]`, edu.institution);
        formData.append(`education[${index}][year]`, edu.year);
      });
    }

    if (doctorData.languages) {
      doctorData.languages.forEach((lang, index) => {
        formData.append(`languages[${index}]`, lang);
      });
    }

    doctorData.specialties.forEach((specialty, index) => {
      formData.append(`specialties[${index}]`, specialty);
    });

    // Address
    if (doctorData.clinicAddress) {
      formData.append(
        "clinicAddress",
        JSON.stringify(doctorData.clinicAddress)
      );
    }

    // Contact info
    if (doctorData.contactInfo) {
      formData.append("contactInfo", JSON.stringify(doctorData.contactInfo));
    }

    // Payment methods
    if (doctorData.paymentMethods) {
      formData.append(
        "paymentMethods",
        JSON.stringify(doctorData.paymentMethods)
      );
    }

    // Files

    if (doctorData.documents) {
      doctorData.documents.forEach((doc, index) => {
        formData.append(`doctorDocument`, doc.file);
        formData.append("documentNames", doc.name);
      });
    }

    const response = await api.post("/auth/register/doctor", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  // Pharmacy registration (application submission only)
  async registerPharmacy(
    pharmacyData: PharmacyApplicationData
  ): Promise<AuthResponse> {
    const formData = new FormData();

    // Pharmacy specific fields
    formData.append("pharmacyName", pharmacyData.pharmacyName);
    formData.append("licenseNumber", pharmacyData.licenseNumber);

    if (pharmacyData.description) {
      formData.append("description", pharmacyData.description);
    }

    // Address
    if (pharmacyData.address) {
      formData.append("address", JSON.stringify(pharmacyData.address));
    }
    // Contact info
    if (pharmacyData.contactInfo) {
      formData.append("contactInfo", JSON.stringify(pharmacyData.contactInfo));
    }

    // Delivery info
    if (pharmacyData.deliveryInfo) {
      if (pharmacyData.deliveryInfo.deliveryRadius) {
        formData.append(
          "deliveryInfo[deliveryRadius]",
          pharmacyData.deliveryInfo.deliveryRadius.toString()
        );
      }
      if (pharmacyData.deliveryInfo.deliveryFee) {
        formData.append(
          "deliveryInfo[deliveryFee]",
          pharmacyData.deliveryInfo.deliveryFee.toString()
        );
      }
      if (pharmacyData.deliveryInfo.deliveryTime) {
        formData.append(
          "deliveryInfo[deliveryTime]",
          pharmacyData.deliveryInfo.deliveryTime
        );
      }
    }

    // Payment methods
    if (pharmacyData.paymentMethods) {
      formData.append(
        "paymentMethods",
        JSON.stringify(pharmacyData.paymentMethods)
      );
    }

    // Files
    if (pharmacyData.pharmacyLogo) {
      formData.append("pharmacyLogo", pharmacyData.pharmacyLogo);
    }

    if (pharmacyData.pharmacyImage) {
      pharmacyData.pharmacyImage.forEach((file) => {
        formData.append("pharmacyImage", file);
      });
    }

    if (pharmacyData.pharmacyDocument) {
      pharmacyData.pharmacyDocument.forEach((file) => {
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
