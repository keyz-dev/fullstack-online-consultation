import React, { createContext, useState, useContext } from "react";
import { doctorAppApi } from "@/api/doctorApp";

interface DoctorData {
  // Step 1: Basic Information
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  licenseNumber: string;
  experience: string;
  bio: string;
  education: string[];
  languages: string[];

  // Step 2: Specialties
  specialties: string[];

  // Step 3: Address & Location
  clinicAddress: {
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    fullAddress: string;
  };
  coordinates: { lat: number; lng: number } | null;
  operationalHospital: string;

  // Step 4: Documents
  documents: any[];

  // Step 5: Payment Setup
  consultationFee: string;
  consultationDuration: string;
  paymentMethods: string[];

  // Step 6: Review
  agreedToTerms: boolean;
}

interface DoctorApplicationContextType {
  // State
  activeStep: number;
  visitedSteps: number[];
  isLoading: boolean;
  errors: Record<string, any>;
  doctorData: DoctorData;
  STEPS: Record<string, number>;

  // Actions
  updateField: (field: string, value: any) => void;
  updateFormData: (stepData: Partial<DoctorData>) => void;
  setDoctorData: React.Dispatch<React.SetStateAction<DoctorData>>;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitDoctorApplication: () => Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }>;

  // Helpers
  getStepTitle: (step: number) => string;
  getStepSubtitle: (step: number) => string;
  getStepIcon: (step: number) => string;
  isStepCompleted: (step: number) => boolean;
}

const DoctorApplicationContext = createContext<
  DoctorApplicationContextType | undefined
>(undefined);

const STEPS = {
  BASIC_INFO: 0,
  SPECIALTIES: 1,
  ADDRESS_LOCATION: 2,
  DOCUMENTS: 3,
  PAYMENT_SETUP: 4,
  REVIEW: 5,
  SUCCESS: 6,
};

export const DoctorApplicationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeStep, setActiveStep] = useState(STEPS.BASIC_INFO);
  const [visitedSteps, setVisitedSteps] = useState([STEPS.BASIC_INFO]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});

  const [doctorData, setDoctorData] = useState<DoctorData>({
    // Step 1: Basic Information
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    experience: "",
    bio: "",
    education: [],
    languages: [],

    // Step 2: Specialties
    specialties: [],

    // Step 3: Address & Location
    clinicAddress: {
      streetAddress: "",
      city: "",
      state: "",
      country: "Cameroon",
      postalCode: "00000",
      fullAddress: "", // For display purposes
    },
    coordinates: null, // {lat, lng}
    operationalHospital: "",

    // Step 4: Documents
    documents: [],

    // Step 5: Payment Setup
    consultationFee: "",
    consultationDuration: "30",
    paymentMethods: [],

    // Step 6: Review
    agreedToTerms: false,
  });

  // Update form data for a specific field
  const updateField = (field: string, value: any) => {
    setDoctorData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Update multiple fields at once
  const updateFormData = (stepData: Partial<DoctorData>) => {
    setDoctorData((prev) => ({ ...prev, ...stepData }));
  };

  // Navigate to next step
  const nextStep = () => {
    const newStep = Math.min(activeStep + 1, STEPS.SUCCESS);
    if (!visitedSteps.includes(newStep)) {
      setVisitedSteps((prev) => [...prev, newStep]);
    }
    setActiveStep(newStep);
  };

  // Navigate to previous step
  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, STEPS.BASIC_INFO));
  };

  // Jump to a specific step (only if visited)
  const goToStep = (step: number) => {
    if (visitedSteps.includes(step) || step <= activeStep) {
      setActiveStep(step);
    }
  };

  // Submit doctor application
  const submitDoctorApplication = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const formData = new FormData();

      // Basic Information (user data)
      formData.append("name", doctorData.name);
      formData.append("email", doctorData.email);
      formData.append("password", doctorData.password);
      formData.append("phone", doctorData.phone);

      // Doctor-specific information
      formData.append("licenseNumber", doctorData.licenseNumber);
      formData.append("experience", doctorData.experience);
      formData.append("bio", doctorData.bio);

      // Arrays
      formData.append("education", JSON.stringify(doctorData.education));
      formData.append("languages", JSON.stringify(doctorData.languages));
      formData.append("specialties", JSON.stringify(doctorData.specialties));

      // Address & Location
      formData.append(
        "clinicAddress",
        JSON.stringify(doctorData.clinicAddress)
      );
      formData.append("operationalHospital", doctorData.operationalHospital);

      // Contact Info (format as expected by backend)
      const contactInfo = [
        {
          type: "phone",
          value: doctorData.phone,
        },
        {
          type: "email",
          value: doctorData.email,
        },
      ];
      formData.append("contactInfo", JSON.stringify(contactInfo));

      // Payment Setup
      formData.append("consultationFee", doctorData.consultationFee);
      formData.append("consultationDuration", doctorData.consultationDuration);

      // Convert payment methods to expected format
      const paymentMethods = doctorData.paymentMethods.map((method) => ({
        method: method,
        value: {
          accountNumber: "N/A",
          accountName: doctorData.name,
        },
      }));
      formData.append("paymentMethods", JSON.stringify(paymentMethods));

      // Documents (use doctorDocument field name as expected by backend)
      if (doctorData.documents && doctorData.documents.length > 0) {
        const limitedDocuments = doctorData.documents.slice(0, 10);
        limitedDocuments.forEach((doc) => {
          formData.append("doctorDocument", doc.file);
          formData.append("documentNames", doc.documentName);
        });
      }

      const response = await doctorAppApi.createDoctorSetup(formData);

      if (response.success) {
        setActiveStep(STEPS.SUCCESS);
        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          error: response.message || "Failed to submit application",
        };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to submit doctor application";
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for UI
  const getStepTitle = (step: number) => {
    switch (step) {
      case STEPS.BASIC_INFO:
        return "Basic Information";
      case STEPS.SPECIALTIES:
        return "Medical Specialties";
      case STEPS.ADDRESS_LOCATION:
        return "Address & Location";
      case STEPS.DOCUMENTS:
        return "Document Upload";
      case STEPS.PAYMENT_SETUP:
        return "Payment Setup";
      case STEPS.REVIEW:
        return "Review & Submit";
      case STEPS.SUCCESS:
        return "Success";
      default:
        return "";
    }
  };

  const getStepSubtitle = (step: number) => {
    switch (step) {
      case STEPS.BASIC_INFO:
        return "Enter your personal and professional details";
      case STEPS.SPECIALTIES:
        return "Select your medical specialties";
      case STEPS.ADDRESS_LOCATION:
        return "Verify your clinic location";
      case STEPS.DOCUMENTS:
        return "Upload verification documents";
      case STEPS.PAYMENT_SETUP:
        return "Configure consultation fees and payment options";
      case STEPS.REVIEW:
        return "Review and submit for approval";
      case STEPS.SUCCESS:
        return "Application submitted successfully";
      default:
        return "";
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case STEPS.BASIC_INFO:
        return "👨‍⚕️";
      case STEPS.SPECIALTIES:
        return "🏥";
      case STEPS.ADDRESS_LOCATION:
        return "📍";
      case STEPS.DOCUMENTS:
        return "📋";
      case STEPS.PAYMENT_SETUP:
        return "💳";
      case STEPS.REVIEW:
        return "✅";
      case STEPS.SUCCESS:
        return "🎉";
      default:
        return "";
    }
  };

  const isStepCompleted = (step: number) => {
    if (step > activeStep) return false;

    switch (step) {
      case STEPS.BASIC_INFO:
        return !!(
          doctorData.name &&
          doctorData.email &&
          doctorData.phone &&
          doctorData.password &&
          doctorData.confirmPassword &&
          doctorData.password === doctorData.confirmPassword &&
          doctorData.bio
        );

      case STEPS.SPECIALTIES:
        return !!(
          doctorData.specialties &&
          doctorData.specialties.length > 0 &&
          doctorData.licenseNumber &&
          doctorData.experience
        );

      case STEPS.ADDRESS_LOCATION:
        return !!(
          doctorData.clinicAddress?.fullAddress && doctorData.coordinates
        );

      case STEPS.DOCUMENTS:
        return !!(doctorData.documents && doctorData.documents.length > 0);

      case STEPS.PAYMENT_SETUP: {
        const hasPaymentMethod =
          doctorData.paymentMethods && doctorData.paymentMethods.length > 0;
        const hasConsultationFee = doctorData.consultationFee;

        return !!(hasPaymentMethod && hasConsultationFee);
      }

      case STEPS.REVIEW:
        return doctorData.agreedToTerms;

      default:
        return false;
    }
  };

  const value: DoctorApplicationContextType = {
    // State
    activeStep,
    visitedSteps,
    isLoading,
    errors,
    doctorData,
    STEPS,

    // Actions
    updateField,
    updateFormData,
    setDoctorData,
    nextStep,
    prevStep,
    goToStep,
    submitDoctorApplication,

    // Helpers
    getStepTitle,
    getStepSubtitle,
    getStepIcon,
    isStepCompleted,
  };

  return (
    <DoctorApplicationContext.Provider value={value}>
      {children}
    </DoctorApplicationContext.Provider>
  );
};

export { DoctorApplicationContext };

export const useDoctorApplication = () => {
  const context = useContext(DoctorApplicationContext);
  if (!context) {
    throw new Error(
      "useDoctorApplication must be used within a DoctorApplicationProvider"
    );
  }
  return context;
};
