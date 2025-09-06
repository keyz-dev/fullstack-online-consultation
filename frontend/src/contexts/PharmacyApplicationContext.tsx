"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "./AuthContext";
import authAPI, { ContactInfo } from "@/api/auth";
import { Address, PaymentMethod } from "@/api";
import { extractErrorMessage } from "@/lib/utils";

// ==================== TYPES ====================
export interface PharmacyData {
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

  // Step 3: Professional Info
  pharmacyName: string;
  licenseNumber: string;
  description: string;
  languages: string[];

  // Step 4: Address
  pharmacyAddress: Address;

  // Step 5: Documents
  pharmacyLogo?: File | null;
  pharmacyDocuments: unknown[];
  contactInfo?: ContactInfo[];

  // Step 6: Images
  pharmacyImages?: Array<{ id: string; file: File; url: string; name: string }>;

  // Step 7: Payment & Delivery
  shipping: {
    // Zone-based rates (stored in XAF as base currency)
    sameCityRate: number;
    sameRegionRate: number;
    sameCountryRate: number;
    othersRate: number;
    freeShippingThreshold: number;

    // Customizable processing days
    sameCityDays: string;
    sameRegionDays: string;
    sameCountryDays: string;
    othersDays: string;

    // Delivery areas
    deliverLocally: boolean;
    deliverNationally: boolean;
    deliverInternationally: boolean;

    // Cash on delivery settings
    allowCashOnDelivery: boolean;
    codConditions: string;

    // Additional shipping settings
    processingTime: string;
  };
  paymentMethods?: PaymentMethod[];

  // Step 8: Review
  agreedToTerms: boolean;
}

export enum STEPS {
  BASIC_USER_INFO = 1,
  EMAIL_VERIFICATION = 2,
  PHARMACY_INFO = 3,
  ADDRESS_LOCATION = 4,
  DOCUMENTS = 5,
  IMAGES = 6,
  PAYMENT_DELIVERY = 7,
  REVIEW_SUBMIT = 8,
  SUCCESS = 9,
}

interface PharmacyApplicationContextType {
  // State
  activeStep: STEPS;
  visitedSteps: number[];
  pharmacyData: PharmacyData;
  isLoading: boolean;
  errors: Record<string, any>;
  // Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: STEPS) => void;
  updatePharmacyData: (data: Partial<PharmacyData>) => void;
  updateField: (field: string, value: unknown) => void;
  // Step-specific actions
  submitStep1: () => Promise<{ success: boolean; error?: string }>;
  submitPharmacyApplication: () => Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }>;

  // Utilities
  isStepCompleted: (step: STEPS) => boolean;
  canContinue: (step: STEPS) => boolean;
  getStepTitle: (step: STEPS) => string;
  getStepSubtitle: (step: STEPS) => string;
}

// ==================== CONTEXT ====================
const PharmacyApplicationContext = createContext<
  PharmacyApplicationContextType | undefined
>(undefined);

export const usePharmacyApplication = () => {
  const context = useContext(PharmacyApplicationContext);
  if (!context) {
    throw new Error(
      "usePharmacyApplication must be used within a PharmacyApplicationProvider"
    );
  }
  return context;
};

// ==================== PROVIDER ====================
export const PharmacyApplicationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState<STEPS>(STEPS.BASIC_USER_INFO);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [pharmacyData, setPharmacyData] = useState<PharmacyData>({
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

    // Step 3: Professional Info
    pharmacyName: "",
    licenseNumber: "",
    description: "",
    languages: [],
    pharmacyLogo: null,
    contactInfo: [],

    // Step 4: Address
    pharmacyAddress: {
      street: "",
      fullAddress: "",
      city: "",
      state: "",
      country: "Cameroon",
      postalCode: "00000",
      coordinates: undefined,
    },

    // Step 5: Documents
    pharmacyDocuments: [],

    // Step 6: Images
    pharmacyImages: [],

    // Step 7: Payment & Delivery
    shipping: {
      // Zone-based rates (stored in XAF as base currency)
      sameCityRate: 1000,
      sameRegionRate: 2000,
      sameCountryRate: 5000,
      othersRate: 15000,
      freeShippingThreshold: 50000,

      // Customizable processing days
      sameCityDays: "1",
      sameRegionDays: "2-3",
      sameCountryDays: "3-5",
      othersDays: "5-10",

      // Delivery areas
      deliverLocally: true,
      deliverNationally: true,
      deliverInternationally: false,

      // Cash on delivery settings
      allowCashOnDelivery: false,
      codConditions: "",

      // Additional shipping settings
      processingTime: "1-2 business days",
    },
    paymentMethods: [] as PaymentMethod[],

    // Step 8: Review
    agreedToTerms: false,
  });

  // ==================== INITIALIZATION ====================
  useEffect(() => {
    // Handle return from email verification
    const step = searchParams.get("step");
    const visited = searchParams.get("visited");

    if (step && visited) {
      const stepNumber = parseInt(step);
      const visitedStepsArray = visited.split(",").map((s) => parseInt(s));

      setActiveStep(stepNumber as STEPS);
      setVisitedSteps(visitedStepsArray);

      // Clean up URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("step");
      newUrl.searchParams.delete("visited");
      window.history.replaceState({}, "", newUrl.toString());
    }

    // Handle incomplete_pharmacy user
    if (user?.role === "incomplete_pharmacy") {
      setActiveStep(STEPS.PHARMACY_INFO);
      setVisitedSteps([1, 2]);

      // Set sessionStorage context for redirection
      sessionStorage.setItem(
        "registrationContext",
        JSON.stringify({
          role: "incomplete_pharmacy",
          returnUrl: "/register/pharmacy",
        })
      );
    }
  }, [searchParams, user]);

  // ==================== STEP NAVIGATION ====================
  const nextStep = () => {
    if (activeStep < STEPS.REVIEW_SUBMIT) {
      const nextStepNumber = activeStep + 1;
      setActiveStep(nextStepNumber as STEPS);
      setVisitedSteps((prev) => [...new Set([...prev, nextStepNumber])]);
    }
  };

  // Update form data for a specific field
  const updateField = (field: string, value: unknown) => {
    setPharmacyData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const prevStep = () => {
    // Prevent going back to Steps 1 and 2 for incomplete_pharmacy users
    if (
      user?.role === "incomplete_pharmacy" &&
      activeStep <= STEPS.PHARMACY_INFO
    ) {
      return;
    }

    if (activeStep > STEPS.BASIC_USER_INFO) {
      const prevStepNumber = activeStep - 1;
      setActiveStep(prevStepNumber as STEPS);
    }
  };

  const goToStep = (step: STEPS) => {
    // Prevent going to Steps 1 and 2 for incomplete_pharmacy users
    if (
      user?.role === "incomplete_pharmacy" &&
      step <= STEPS.EMAIL_VERIFICATION
    ) {
      return;
    }

    setActiveStep(step);
    setVisitedSteps((prev) => [...new Set([...prev, step])]);
  };

  // ==================== DATA MANAGEMENT ====================
  const updatePharmacyData = (data: Partial<PharmacyData>) => {
    setPharmacyData((prev) => ({ ...prev, ...data }));
  };

  // ==================== STEP SUBMISSIONS ====================
  // Submit Step 1 (Basic User Information)
  const submitStep1 = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Call initiate registration
      const response = await authAPI.initiateRegistration(
        {
          name: pharmacyData.name,
          email: pharmacyData.email,
          password: pharmacyData.password,
          phoneNumber: pharmacyData.phoneNumber,
          gender: pharmacyData.gender,
          dob: pharmacyData.dob,
          address: pharmacyData.address,
          avatar: pharmacyData.avatar as File,
        },
        "pharmacy"
      );

      if (response.status === "success") {
        // Store registration context for email verification
        sessionStorage.setItem(
          "registrationContext",
          JSON.stringify({
            type: "pharmacy",
            returnUrl: "/register/pharmacy",
            returnStep: STEPS.PHARMACY_INFO,
            visitedSteps: [STEPS.BASIC_USER_INFO, STEPS.EMAIL_VERIFICATION],
          })
        );

        // Mark Step 2 as visited and redirect to email verification
        setVisitedSteps((prev) => [...prev, STEPS.EMAIL_VERIFICATION]);
        router.push(
          `/verify-account?email=${encodeURIComponent(
            pharmacyData.email
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
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const submitPharmacyApplication = async () => {
    try {
      setIsLoading(true);

      // Prepare pharmacy data for submission
      const submissionData = {
        pharmacyName: pharmacyData.pharmacyName,
        licenseNumber: pharmacyData.licenseNumber,
        description: pharmacyData.description,
        contactInfo: pharmacyData.contactInfo,
        address: pharmacyData.pharmacyAddress,
        shipping: pharmacyData.shipping,
        paymentMethods: pharmacyData.paymentMethods,
        languages: pharmacyData.languages,
        pharmacyLogo: pharmacyData.pharmacyLogo,
        pharmacyImage:
          pharmacyData.pharmacyImages?.map((img) => img.file) || [],
        pharmacyDocument: pharmacyData.pharmacyDocuments || [],
      };

      console.log(submissionData);

      const result = await authAPI.registerPharmacy(submissionData);

      if (result.status === "success") {
        // Clear sessionStorage context
        sessionStorage.removeItem("registrationContext");

        // Move to success step
        setActiveStep(STEPS.SUCCESS);
        setVisitedSteps((prev) => [...new Set([...prev, STEPS.SUCCESS])]);

        return { success: true };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: error.message || "Application submission failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== STEP VALIDATION ====================
  const isStepCompleted = (step: STEPS): boolean => {
    switch (step) {
      case STEPS.BASIC_USER_INFO:
      case STEPS.EMAIL_VERIFICATION:
        // These steps are completed for incomplete_pharmacy users
        return Boolean(user?.role === "incomplete_pharmacy");

      case STEPS.PHARMACY_INFO:
        return !!(pharmacyData.pharmacyName && pharmacyData.licenseNumber);

      case STEPS.ADDRESS_LOCATION:
        return !!(
          pharmacyData.address?.street &&
          pharmacyData.address?.city &&
          pharmacyData.address?.coordinates
        );

      case STEPS.DOCUMENTS:
        return (
          pharmacyData.pharmacyDocuments &&
          pharmacyData.pharmacyDocuments.length > 0
        );

      case STEPS.IMAGES:
        return (
          pharmacyData.pharmacyImages && pharmacyData.pharmacyImages.length >= 3
        );

      case STEPS.PAYMENT_DELIVERY:
        return !!(
          pharmacyData.paymentMethods && pharmacyData.paymentMethods.length > 0
        );

      case STEPS.REVIEW_SUBMIT:
        return (
          isStepCompleted(STEPS.PHARMACY_INFO) &&
          isStepCompleted(STEPS.ADDRESS_LOCATION) &&
          isStepCompleted(STEPS.DOCUMENTS) &&
          isStepCompleted(STEPS.IMAGES) &&
          isStepCompleted(STEPS.PAYMENT_DELIVERY)
        );

      case STEPS.SUCCESS:
        return true;

      default:
        return false;
    }
  };

  const canContinue = (step: STEPS): boolean => {
    return isStepCompleted(step) || false;
  };

  // ==================== UTILITIES ====================
  const getStepTitle = (step: STEPS): string => {
    switch (step) {
      case STEPS.BASIC_USER_INFO:
        return "Basic Information";
      case STEPS.EMAIL_VERIFICATION:
        return "Email Verification";
      case STEPS.PHARMACY_INFO:
        return "Pharmacy Information";
      case STEPS.ADDRESS_LOCATION:
        return "Address & Location";
      case STEPS.DOCUMENTS:
        return "Documents & Certifications";
      case STEPS.IMAGES:
        return "Pharmacy Images";
      case STEPS.PAYMENT_DELIVERY:
        return "Payment & Delivery Setup";
      case STEPS.REVIEW_SUBMIT:
        return "Review & Submit";
      case STEPS.SUCCESS:
        return "Application Submitted";
      default:
        return "";
    }
  };

  const getStepSubtitle = (step: STEPS): string => {
    switch (step) {
      case STEPS.BASIC_USER_INFO:
        return "Tell us about yourself";
      case STEPS.EMAIL_VERIFICATION:
        return "Verify your email address";
      case STEPS.PHARMACY_INFO:
        return "Tell us about your pharmacy";
      case STEPS.ADDRESS_LOCATION:
        return "Where is your pharmacy located?";
      case STEPS.DOCUMENTS:
        return "Upload required documents";
      case STEPS.IMAGES:
        return "Add photos of your pharmacy";
      case STEPS.PAYMENT_DELIVERY:
        return "Set up payment methods and delivery";
      case STEPS.REVIEW_SUBMIT:
        return "Review your application before submitting";
      case STEPS.SUCCESS:
        return "Your application has been submitted successfully";
      default:
        return "";
    }
  };

  // ==================== CONTEXT VALUE ====================
  const contextValue: PharmacyApplicationContextType = {
    activeStep,
    visitedSteps,
    pharmacyData,
    isLoading,
    errors,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    updatePharmacyData,
    submitStep1,
    submitPharmacyApplication,
    isStepCompleted,
    canContinue,
    getStepTitle,
    getStepSubtitle,
  };

  return (
    <PharmacyApplicationContext.Provider value={contextValue}>
      {children}
    </PharmacyApplicationContext.Provider>
  );
};
