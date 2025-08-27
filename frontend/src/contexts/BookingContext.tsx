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
}

// Actions
export type BookingAction =
  | { type: "SET_CURRENT_STEP"; payload: number }
  | {
      type: "SET_STEP_COMPLETED";
      payload: { stepIndex: number; completed: boolean };
    }
  | { type: "UPDATE_STEP_DATA"; payload: { stepIndex: number; data: any } }
  | { type: "SET_SYMPTOM_IDS"; payload: number[] }
  | { type: "SET_SPECIALTY_ID"; payload: number | null }
  | { type: "SET_DOCTOR_ID"; payload: number | null }
  | { type: "SET_DOCTOR"; payload: Doctor | null }
  | { type: "SET_TIME_SLOT_ID"; payload: number | null }
  | { type: "SET_TIME_SLOT"; payload: TimeSlot | null }
  | { type: "SET_CONSULTATION_TYPE"; payload: "online" | "physical" | null }
  | { type: "SET_APPOINTMENT_DATE"; payload: string | null }
  | { type: "SET_APPOINTMENT_TIME"; payload: string | null }
  | { type: "SET_NOTES"; payload: string }
  | { type: "SET_MEDICAL_DOCUMENTS"; payload: any[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CREATING_APPOINTMENT"; payload: boolean }
  | { type: "SET_INITIATING_PAYMENT"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PAYMENT_REFERENCE"; payload: string | null }
  | { type: "SET_APPOINTMENT_ID"; payload: number | null }
  | { type: "RESET_BOOKING" }
  | { type: "INITIALIZE_FROM_INTENT"; payload: any };

// Initial state
const initialSteps: BookingStep[] = [
  {
    id: "symptoms",
    title: "Select Symptoms",
    description: "Choose your symptoms to help us find the right doctor",
    isCompleted: false,
    isActive: true,
  },
  {
    id: "doctor",
    title: "Choose Doctor",
    description: "Select a doctor based on your symptoms and preferences",
    isCompleted: false,
    isActive: false,
  },
  {
    id: "time",
    title: "Select Time",
    description: "Pick an available time slot for your consultation",
    isCompleted: false,
    isActive: false,
  },
  {
    id: "details",
    title: "Additional Details",
    description: "Add notes and upload medical documents (optional)",
    isCompleted: false,
    isActive: false,
  },
  {
    id: "payment",
    title: "Payment",
    description: "Complete payment to confirm your appointment",
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

    case "RESET_BOOKING":
      return initialState;

    case "INITIALIZE_FROM_INTENT":
      const intent = action.payload;
      let newState = { ...initialState };

      // Set data based on intent
      if (intent.specialtyId) {
        newState.specialtyId = intent.specialtyId;
      }
      if (intent.symptomId) {
        newState.symptomIds = [intent.symptomId];
      }
      if (intent.symptomIds?.length) {
        newState.symptomIds = intent.symptomIds;
      }
      if (intent.doctorId) {
        newState.doctorId = intent.doctorId;
        newState.doctor = intent.doctor;
      }
      if (intent.timeSlotId) {
        newState.timeSlotId = intent.timeSlotId;
        newState.timeSlot = intent.timeSlot;
      }
      if (intent.consultationType) {
        newState.consultationType = intent.consultationType;
      }
      if (intent.appointmentDate) {
        newState.appointmentDate = intent.appointmentDate;
      }
      if (intent.appointmentTime) {
        newState.appointmentTime = intent.appointmentTime;
      }
      if (intent.notes) {
        newState.notes = intent.notes;
      }
      if (intent.medicalDocuments?.length) {
        newState.medicalDocuments = intent.medicalDocuments;
      }

      // Determine starting step based on what's already selected
      if (intent.doctorId && intent.timeSlotId) {
        newState.currentStep = 3; // Details step
      } else if (intent.doctorId) {
        newState.currentStep = 2; // Time selection step
      } else if (
        intent.specialtyId ||
        intent.symptomId ||
        intent.symptomIds?.length
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
  getCurrentStepData: () => any;
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
    // Check if current step is completed
    const currentStep = state.steps[state.currentStep];
    return currentStep.isCompleted;
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
      case 4: // Payment
        return {
          paymentReference: state.paymentReference,
          appointmentId: state.appointmentId,
        };
      default:
        return {};
    }
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
