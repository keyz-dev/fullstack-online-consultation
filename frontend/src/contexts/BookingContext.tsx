"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Doctor } from "../api/doctors";
import { Symptom } from "../api/symptoms";
import { Specialty } from "../api/specialties";

// Types
export interface TimeSlot {
  id: number;
  doctorId: number;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  consultationType: "online" | "physical" | "both";
  consultationFee: number;
}

export interface BookingIntent {
  type: "global" | "doctor" | "specialty" | "direct";
  doctorId?: number;
  specialtyId?: number;
  symptomIds?: number[];
  currentStep: number;
  timestamp: number;
}

export interface StepConfig {
  index: number;
  required: boolean;
  skippable: boolean;
  title: string;
  description: string;
}

export interface BookingStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface BookingState {
  // Current step
  currentStep: number;
  steps: BookingStep[];

  // Booking data
  symptomIds: number[];
  specialtyId: number | null;
  doctorId: number | null;
  doctor: Doctor | null;
  timeSlotId: number | null;
  timeSlot: TimeSlot | null;
  consultationType: "online" | "physical" | null;
  appointmentDate: string | null;
  appointmentTime: string | null;
  notes: string;
  medicalDocuments: any[];

  // Loading states
  isLoading: boolean;
  isCreatingAppointment: boolean;
  isInitiatingPayment: boolean;

  // Error states
  error: string | null;

  // Payment tracking
  paymentReference: string | null;
  appointmentId: number | null;
  phoneNumber: string;
  paymentStatus: "pending" | "processing" | "success" | "failed";
  paymentMessage: string;
}

// Actions
export type BookingAction =
  | { type: "SET_CURRENT_STEP"; payload: number }
  | {
      type: "SET_STEP_COMPLETED";
      payload: { stepIndex: number; completed: boolean };
    }
  | {
      type: "UPDATE_STEP_DATA";
      payload: { stepIndex: number; data: Record<string, unknown> };
    }
  | { type: "SET_SYMPTOM_IDS"; payload: number[] }
  | { type: "SET_SPECIALTY_ID"; payload: number | null }
  | { type: "SET_DOCTOR_ID"; payload: number | null }
  | { type: "SET_DOCTOR"; payload: Doctor | null }
  | { type: "SET_TIME_SLOT_ID"; payload: number | null }
  | { type: "SET_TIME_SLOT"; payload: TimeSlot | null }
  | { type: "SET_CONSULTATION_TYPE"; payload: "online" | "physical" }
  | { type: "SET_APPOINTMENT_DATE"; payload: string | null }
  | { type: "SET_APPOINTMENT_TIME"; payload: string | null }
  | { type: "SET_NOTES"; payload: string }
  | { type: "SET_MEDICAL_DOCUMENTS"; payload: any[] }
  | { type: "ADD_MEDICAL_DOCUMENTS"; payload: any[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CREATING_APPOINTMENT"; payload: boolean }
  | { type: "SET_INITIATING_PAYMENT"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PAYMENT_REFERENCE"; payload: string | null }
  | { type: "SET_APPOINTMENT_ID"; payload: number | null }
  | { type: "SET_PHONE_NUMBER"; payload: string }
  | {
      type: "SET_PAYMENT_STATUS";
      payload: "pending" | "processing" | "success" | "failed";
    }
  | { type: "SET_PAYMENT_MESSAGE"; payload: string }
  | { type: "RESET_BOOKING" }
  | { type: "INITIALIZE_FROM_INTENT"; payload: Record<string, unknown> };

// Initial state
const initialSteps: BookingStep[] = [
  {
    id: "symptoms",
    title: "Symptoms",
    description: "Tell us your symptoms",
    isCompleted: false,
    isActive: true,
  },
  {
    id: "doctor",
    title: "Doctor",
    description: "Pick a doctor",
    isCompleted: false,
    isActive: false,
  },
  {
    id: "time",
    title: "Time",
    description: "Choose a time slot",
    isCompleted: false,
    isActive: false,
  },
  {
    id: "details",
    title: "Details",
    description: "Notes & documents",
    isCompleted: false,
    isActive: false,
  },
  {
    id: "consultation",
    title: "Type",
    description: "Set consultation type",
    isCompleted: false,
    isActive: false,
  },
  {
    id: "payment",
    title: "Payment",
    description: "Confirm and pay",
    isCompleted: false,
    isActive: false,
  },
];

const initialState: BookingState = {
  currentStep: 0,
  steps: initialSteps,
  symptomIds: [],
  specialtyId: null,
  doctorId: null,
  doctor: null,
  timeSlotId: null,
  timeSlot: null,
  consultationType: null,
  appointmentDate: null,
  appointmentTime: null,
  notes: "",
  medicalDocuments: [],
  isLoading: false,
  isCreatingAppointment: false,
  isInitiatingPayment: false,
  error: null,
  paymentReference: null,
  appointmentId: null,
  phoneNumber: "",
  paymentStatus: "pending",
  paymentMessage: "Ready to process payment",
};

// Reducer
function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case "SET_CURRENT_STEP":
      return {
        ...state,
        currentStep: action.payload,
        steps: state.steps.map((step, index) => ({
          ...step,
          isActive: index === action.payload,
        })),
      };

    case "SET_STEP_COMPLETED":
      return {
        ...state,
        steps: state.steps.map((step, index) =>
          index === action.payload.stepIndex
            ? { ...step, isCompleted: action.payload.completed }
            : step
        ),
      };

    case "UPDATE_STEP_DATA":
      return {
        ...state,
        ...action.payload.data,
      };

    case "SET_SYMPTOM_IDS":
      return {
        ...state,
        symptomIds: action.payload,
      };

    case "SET_SPECIALTY_ID":
      return {
        ...state,
        specialtyId: action.payload,
      };

    case "SET_DOCTOR_ID":
      return {
        ...state,
        doctorId: action.payload,
      };

    case "SET_DOCTOR":
      return {
        ...state,
        doctor: action.payload,
      };

    case "SET_TIME_SLOT_ID":
      return {
        ...state,
        timeSlotId: action.payload,
      };

    case "SET_TIME_SLOT":
      return {
        ...state,
        timeSlot: action.payload,
      };

    case "SET_CONSULTATION_TYPE":
      return {
        ...state,
        consultationType: action.payload,
      };

    case "SET_APPOINTMENT_DATE":
      return {
        ...state,
        appointmentDate: action.payload,
      };

    case "SET_APPOINTMENT_TIME":
      return {
        ...state,
        appointmentTime: action.payload,
      };

    case "SET_NOTES":
      return {
        ...state,
        notes: action.payload,
      };

    case "SET_MEDICAL_DOCUMENTS":
      return {
        ...state,
        medicalDocuments: action.payload,
      };

    case "ADD_MEDICAL_DOCUMENTS":
      return {
        ...state,
        medicalDocuments: [
          ...(state.medicalDocuments || []),
          ...action.payload,
        ],
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_CREATING_APPOINTMENT":
      return {
        ...state,
        isCreatingAppointment: action.payload,
      };

    case "SET_INITIATING_PAYMENT":
      return {
        ...state,
        isInitiatingPayment: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "SET_PAYMENT_REFERENCE":
      return {
        ...state,
        paymentReference: action.payload,
      };

    case "SET_APPOINTMENT_ID":
      return {
        ...state,
        appointmentId: action.payload,
      };

    case "SET_PHONE_NUMBER":
      return {
        ...state,
        phoneNumber: action.payload,
      };

    case "SET_PAYMENT_STATUS":
      return {
        ...state,
        paymentStatus: action.payload,
      };

    case "SET_PAYMENT_MESSAGE":
      return {
        ...state,
        paymentMessage: action.payload,
      };

    case "RESET_BOOKING":
      return initialState;

    case "INITIALIZE_FROM_INTENT":
      const intent = action.payload as Record<string, unknown>;
      const newState = { ...initialState };

      // Preserve existing medical documents to avoid losing blob URLs
      if (state.medicalDocuments && state.medicalDocuments.length > 0) {
        newState.medicalDocuments = state.medicalDocuments;
      }

      // Set data based on intent
      if (intent.specialtyId && typeof intent.specialtyId === "number") {
        newState.specialtyId = intent.specialtyId;
      }
      if (intent.symptomId && typeof intent.symptomId === "number") {
        newState.symptomIds = [intent.symptomId];
      }
      if (
        intent.symptomIds &&
        Array.isArray(intent.symptomIds) &&
        intent.symptomIds.length
      ) {
        newState.symptomIds = intent.symptomIds as number[];
      }
      if (intent.doctorId && typeof intent.doctorId === "number") {
        newState.doctorId = intent.doctorId;
      }
      if (intent.doctor) {
        newState.doctor = intent.doctor as Doctor;
      }
      if (intent.timeSlotId && typeof intent.timeSlotId === "number") {
        newState.timeSlotId = intent.timeSlotId;
      }
      if (intent.timeSlot) {
        newState.timeSlot = intent.timeSlot as TimeSlot;
      }
      if (
        intent.consultationType &&
        (intent.consultationType === "online" ||
          intent.consultationType === "physical")
      ) {
        newState.consultationType = intent.consultationType;
      }
      if (
        intent.appointmentDate &&
        typeof intent.appointmentDate === "string"
      ) {
        newState.appointmentDate = intent.appointmentDate;
      }
      if (
        intent.appointmentTime &&
        typeof intent.appointmentTime === "string"
      ) {
        newState.appointmentTime = intent.appointmentTime;
      }
      if (intent.notes && typeof intent.notes === "string") {
        newState.notes = intent.notes;
      }
      if (
        intent.medicalDocuments &&
        Array.isArray(intent.medicalDocuments) &&
        intent.medicalDocuments.length
      ) {
        newState.medicalDocuments = intent.medicalDocuments as Record<
          string,
          unknown
        >[];
      }

      // Determine starting step based on what's already selected
      if (intent.doctorId && intent.timeSlotId) {
        newState.currentStep = 3; // Details step
      } else if (intent.doctorId) {
        newState.currentStep = 2; // Time selection step
      } else if (
        intent.specialtyId ||
        intent.symptomId ||
        (intent.symptomIds &&
          Array.isArray(intent.symptomIds) &&
          intent.symptomIds.length)
      ) {
        newState.currentStep = 1; // Doctor selection step
      } else {
        newState.currentStep = 0; // Symptoms step
      }

      // Update step states
      newState.steps = newState.steps.map((step, index) => ({
        ...step,
        isActive: index === newState.currentStep,
        isCompleted: index < newState.currentStep,
      }));

      return newState;

    default:
      return state;
  }
}

// Context
const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  canProceedToNextStep: () => boolean;
  isStepCompleted: (stepIndex: number) => boolean;
  getCurrentStepData: () => Record<string, unknown>;
  createAppointmentAndInitiatePayment: (phoneNumber: string) => Promise<void>;
  updatePhoneNumber: (phoneNumber: string) => void;
} | null>(null);

// Provider
export const BookingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const nextStep = () => {
    if (state.currentStep < state.steps.length - 1) {
      dispatch({ type: "SET_CURRENT_STEP", payload: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 0) {
      dispatch({ type: "SET_CURRENT_STEP", payload: state.currentStep - 1 });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < state.steps.length) {
      dispatch({ type: "SET_CURRENT_STEP", payload: step });
    }
  };

  const canProceedToNextStep = () => {
    // Check if current step is completed based on step-specific validation
    switch (state.currentStep) {
      case 0: // Symptoms - optional, can proceed with or without symptoms
        return true;
      case 1: // Doctor - required
        return !!state.doctorId;
      case 2: // Time Slot - required
        return !!state.timeSlotId;
      case 3: // Details - optional, can proceed with or without details
        return true;
      case 4: // Consultation Type - required
        return !!state.consultationType;
      case 5: // Payment - handled by PaymentForm component
        return true;
      default:
        return false;
    }
  };

  const isStepCompleted = (stepIndex: number) => {
    return state.steps[stepIndex]?.isCompleted || false;
  };

  const getCurrentStepData = () => {
    switch (state.currentStep) {
      case 0: // Symptoms
        return {
          symptomIds: state.symptomIds,
          specialtyId: state.specialtyId,
        };
      case 1: // Doctor
        return {
          doctorId: state.doctorId,
          doctor: state.doctor,
        };
      case 2: // Time Slot
        return {
          timeSlotId: state.timeSlotId,
          timeSlot: state.timeSlot,
          consultationType: state.consultationType,
          appointmentDate: state.appointmentDate,
          appointmentTime: state.appointmentTime,
        };
      case 3: // Details
        return {
          notes: state.notes,
          medicalDocuments: state.medicalDocuments,
        };
      case 4: // Consultation Type
        return {
          consultationType: state.consultationType,
        };
      case 5: // Payment
        return {
          paymentReference: state.paymentReference,
          appointmentId: state.appointmentId,
        };
      default:
        return {};
    }
  };

  const updatePhoneNumber = (phoneNumber: string) => {
    dispatch({ type: "SET_PHONE_NUMBER", payload: phoneNumber });
  };

  const createAppointmentAndInitiatePayment = async (phoneNumber: string) => {
    // This will be implemented in the useBookingPayment hook
    console.log(
      "Creating appointment and initiating payment for:",
      phoneNumber
    );
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        dispatch,
        nextStep,
        prevStep,
        goToStep,
        canProceedToNextStep,
        isStepCompleted,
        getCurrentStepData,
        createAppointmentAndInitiatePayment,
        updatePhoneNumber,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Hook
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
