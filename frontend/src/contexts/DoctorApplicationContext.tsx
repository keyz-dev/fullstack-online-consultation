import React, { createContext, useState, useContext, useEffect } from "react";
import { PaymentMethod, DoctorApplicationData, authAPI, Address } from "@/api";
import { useRouter } from "next/navigation";
import { extractErrorMessage } from "@/lib/utils";
import { useAuth } from "./AuthContext";

interface DoctorData {
  // Step 1: Basic User Information (similar to admin registration)
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  address?: Address;
  avatar?: File | null;

  // Step 3: Professional Information (moved from old Step 1)
  bio: string;
  languages: string[];
  contactInfo: Array<{ type: string; value: string }>;
  licenseNumber: string;
  experience: string;

  // Step 4: Specialties
  specialties: string[];

  // Step 5: Address & Location
  clinicAddress: Address;
  operationalHospital: string;

  // Step 6: Documents
  documents: any[];

  // Step 7: Payment Setup
  consultationFee: string;
  consultationDuration: string;
  paymentMethods: PaymentMethod[];

  // Step 8: Review
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
  submitStep1: () => Promise<{ success: boolean; error?: string }>;
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
  BASIC_USER_INFO: 1,
  EMAIL_VERIFICATION: 2,
  PROFESSIONAL_INFO: 3,
  SPECIALTIES: 4,
  ADDRESS_LOCATION: 5,
  DOCUMENTS: 6,
  PAYMENT_SETUP: 7,
  REVIEW: 8,
  SUCCESS: 9,
};

export const DoctorApplicationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const { user, verifyToken } = useAuth();
  const [activeStep, setActiveStep] = useState(STEPS.BASIC_USER_INFO);
  const [visitedSteps, setVisitedSteps] = useState([STEPS.BASIC_USER_INFO]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});

  const [doctorData, setDoctorData] = useState<DoctorData>({
    // Step 1: Basic User Information
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    address: {
      street: "",
      fullAddress: "",
      city: "",
      state: "",
      country: "Cameroon",
      postalCode: "00000",
      coordinates: undefined,
    },
    avatar: null,

    // Step 3: Professional Information
    bio: "",
    languages: [],
    contactInfo: [],
    licenseNumber: "",
    experience: "",

    // Step 4: Specialties
    specialties: [],

    // Step 5: Address & Location
    clinicAddress: {
      street: "",
      fullAddress: "",
      city: "",
      state: "",
      country: "Cameroon",
      postalCode: "00000",
      coordinates: undefined,
    },
    operationalHospital: "",

    // Step 6: Documents
    documents: [],

    // Step 7: Payment Setup
    consultationFee: "",
    consultationDuration: "30",
    paymentMethods: [] as PaymentMethod[],

    // Step 8: Review
    agreedToTerms: false,
  });

  // Handle return from email verification and logged-in incomplete users
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const returnStep = urlParams.get("step");
    const visitedStepsParam = urlParams.get("visited");

    if (returnStep && visitedStepsParam) {
      const step = parseInt(returnStep);
      const visited = visitedStepsParam.split(",").map(Number);

      // Set the active step
      setActiveStep(step);

      // Mark steps as visited
      setVisitedSteps(visited);

      // Clean up URL
      window.history.replaceState({}, "", "/register/doctor");
    } else if (user && user.role === "incomplete_doctor") {
      // User is logged in but has incomplete application
      // Set them to Step 3 and mark Steps 1 & 2 as visited
      setActiveStep(STEPS.PROFESSIONAL_INFO);
      setVisitedSteps([STEPS.BASIC_USER_INFO, STEPS.EMAIL_VERIFICATION]);
    }
  }, [user]);

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
    // If user is logged in as incomplete_doctor, don't allow going back to Steps 1 & 2
    if (user && user.role === "incomplete_doctor") {
      setActiveStep((prev) => Math.max(prev - 1, STEPS.PROFESSIONAL_INFO));
    } else {
      setActiveStep((prev) => Math.max(prev - 1, STEPS.BASIC_USER_INFO));
    }
  };

  // Jump to a specific step (only if visited)
  const goToStep = (step: number) => {
    // If user is logged in as incomplete_doctor, don't allow going to Steps 1 & 2
    if (
      user &&
      user.role === "incomplete_doctor" &&
      step < STEPS.PROFESSIONAL_INFO
    ) {
      return;
    }

    if (visitedSteps.includes(step) || step <= activeStep) {
      setActiveStep(step);
    }
  };

  // Submit Step 1 (Basic User Information)
  const submitStep1 = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Call initiate registration
      const response = await authAPI.initiateRegistration(
        {
          name: doctorData.name,
          email: doctorData.email,
          password: doctorData.password,
          phoneNumber: doctorData.phoneNumber,
          gender: doctorData.gender,
          dob: doctorData.dob,
          address: doctorData.address,
          avatar: doctorData.avatar as File,
        },
        "doctor"
      );

      if (response.status === "success") {
        // Store registration context for email verification
        sessionStorage.setItem(
          "registrationContext",
          JSON.stringify({
            type: "doctor",
            returnUrl: "/register/doctor",
            returnStep: STEPS.PROFESSIONAL_INFO,
            visitedSteps: [STEPS.BASIC_USER_INFO, STEPS.EMAIL_VERIFICATION],
          })
        );

        // Mark Step 2 as visited and redirect to email verification
        setVisitedSteps((prev) => [...prev, STEPS.EMAIL_VERIFICATION]);
        router.push(
          `/verify-account?email=${encodeURIComponent(
            doctorData.email
          )}&from=register`
        );

        return { success: true };
      } else {
        const errorMessage = extractErrorMessage(response.message);
        return {
          success: false,
          error: errorMessage || "Failed to submit basic information",
        };
      }
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Submit doctor application (Steps 3-8)
  const submitDoctorApplication = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Prepare doctor application data (without user data)
      const doctorApplicationData: DoctorApplicationData = {
        licenseNumber: doctorData.licenseNumber,
        experience: parseInt(doctorData.experience),
        bio: doctorData.bio,
        languages: doctorData.languages,
        specialties: doctorData.specialties,
        clinicAddress: doctorData.clinicAddress,
        operationalHospital: doctorData.operationalHospital,
        consultationFee: parseInt(doctorData.consultationFee),
        consultationDuration: parseInt(doctorData.consultationDuration),
        contactInfo: doctorData.contactInfo,
        paymentMethods: doctorData.paymentMethods,
        documents: doctorData.documents,
      };

      const response = await authAPI.registerDoctor(doctorApplicationData);
      if (response.status === "success") {
        // Clear the registration context
        sessionStorage.removeItem("registrationContext");
        // Clear the doctor data

        // verify the user token
        const token = authAPI.getToken();
        if (token) {
          await verifyToken(token);
        }
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
      case STEPS.BASIC_USER_INFO:
        return "Basic Information";
      case STEPS.EMAIL_VERIFICATION:
        return "Email Verification";
      case STEPS.PROFESSIONAL_INFO:
        return "Professional Information";
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
      case STEPS.BASIC_USER_INFO:
        return "Enter your personal information";
      case STEPS.EMAIL_VERIFICATION:
        return "Verify your email address";
      case STEPS.PROFESSIONAL_INFO:
        return "Enter your professional details";
      case STEPS.SPECIALTIES:
        return "Select your medical specialties";
      case STEPS.ADDRESS_LOCATION:
        return "Verify your clinic/hospital location";
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
      case STEPS.BASIC_USER_INFO:
        return "👤";
      case STEPS.EMAIL_VERIFICATION:
        return "📧";
      case STEPS.PROFESSIONAL_INFO:
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
      case STEPS.BASIC_USER_INFO:
        // If user is logged in as incomplete_doctor, this step is always completed
        if (user && user.role === "incomplete_doctor") {
          return true;
        }
        return !!(
          doctorData.name &&
          doctorData.email &&
          doctorData.password &&
          doctorData.confirmPassword &&
          doctorData.password === doctorData.confirmPassword
        );

      case STEPS.EMAIL_VERIFICATION:
        // If user is logged in as incomplete_doctor, this step is always completed
        if (user && user.role === "incomplete_doctor") {
          return true;
        }
        // This step is completed when user returns from verification
        return visitedSteps.includes(STEPS.EMAIL_VERIFICATION);

      case STEPS.PROFESSIONAL_INFO:
        return !!(
          doctorData.bio &&
          doctorData.languages.length > 0 &&
          doctorData.licenseNumber &&
          doctorData.experience
        );

      case STEPS.SPECIALTIES:
        return !!(doctorData.specialties && doctorData.specialties.length > 0);

      case STEPS.ADDRESS_LOCATION:
        return !!(
          doctorData.clinicAddress?.fullAddress &&
          doctorData.clinicAddress?.coordinates
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
    submitStep1,
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
