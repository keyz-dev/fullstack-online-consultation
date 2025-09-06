"use client";

import React, {
  createContext,
  useReducer,
  useCallback,
  useContext,
  ReactNode,
} from "react";
import { useSocketContext } from "./SocketProvider";
import { consultationsAPI } from "@/api/consultations";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/extractError";
import { useAuth } from "./AuthContext";

// Types
interface ConsultationState {
  loading: boolean;
  error: string | null;
  currentConsultation: unknown;
  patientPresence: {
    isOnline: boolean;
    lastSeen?: string;
    userName: string;
    userEmail: string;
  } | null;
  checkingPresence: boolean;
}

interface ConsultationContextType extends ConsultationState {
  getConsultationByAppointment: (
    appointmentId: string
  ) => Promise<string | null>;
  checkPatientPresence: (patientId: string) => Promise<void>;
  initiateVideoCall: (
    consultationId: string
  ) => Promise<{ roomId: string; consultationId: string } | null>;
  cancelVideoCall: (roomId: string, consultationId: string) => void;
  clearConsultationState: () => void;
}

// Initial state
const initialState: ConsultationState = {
  loading: false,
  error: null,
  currentConsultation: null,
  patientPresence: null,
  checkingPresence: false,
};

// Action types
const CONSULTATION_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_CONSULTATION: "SET_CONSULTATION",
  SET_PATIENT_PRESENCE: "SET_PATIENT_PRESENCE",
  SET_CHECKING_PRESENCE: "SET_CHECKING_PRESENCE",
  CLEAR_STATE: "CLEAR_STATE",
} as const;

// Reducer
const consultationReducer = (
  state: ConsultationState,
  action: unknown
): ConsultationState => {
  switch (action.type) {
    case CONSULTATION_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case CONSULTATION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case CONSULTATION_ACTIONS.SET_CONSULTATION:
      return { ...state, currentConsultation: action.payload, loading: false };
    case CONSULTATION_ACTIONS.SET_PATIENT_PRESENCE:
      return {
        ...state,
        patientPresence: action.payload,
        checkingPresence: false,
      };
    case CONSULTATION_ACTIONS.SET_CHECKING_PRESENCE:
      return { ...state, checkingPresence: action.payload };
    case CONSULTATION_ACTIONS.CLEAR_STATE:
      return initialState;
    default:
      return state;
  }
};

// Context
const ConsultationContext = createContext<ConsultationContextType | undefined>(
  undefined
);

// Provider
interface ConsultationProviderProps {
  children: ReactNode;
}

export const ConsultationProvider: React.FC<ConsultationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(consultationReducer, initialState);
  const { socket } = useSocketContext();
  const { user } = useAuth();

  // Get consultation by appointment ID
  const getConsultationByAppointment = useCallback(
    async (appointmentId: string): Promise<string | null> => {
      dispatch({ type: CONSULTATION_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CONSULTATION_ACTIONS.SET_ERROR, payload: null });

      try {
        // Get user role from auth context - this should be passed in or available
        const userRole = user?.role as "doctor" | "patient";
        const response = await consultationsAPI.getConsultationByAppointment(
          userRole,
          appointmentId
        );

        console.log("Requesting for consultations: ", response);

        if (response.success && response.data) {
          const consultation = response.data;
          if (consultation) {
            dispatch({
              type: CONSULTATION_ACTIONS.SET_CONSULTATION,
              payload: consultation,
            });
            return consultation.id.toString();
          }
        }
        return null;
      } catch (error) {
        const errorMessage = extractErrorMessage(error as Error);
        dispatch({
          type: CONSULTATION_ACTIONS.SET_ERROR,
          payload: errorMessage,
        });
        toast.error("Failed to load consultation details");
        return null;
      }
    },
    []
  );

  // Check patient presence
  const checkPatientPresence = useCallback(
    async (patientId: string): Promise<void> => {
      dispatch({
        type: CONSULTATION_ACTIONS.SET_CHECKING_PRESENCE,
        payload: true,
      });

      try {
        const response = await consultationsAPI.checkPatientPresence(patientId);
        if (response.success) {
          dispatch({
            type: CONSULTATION_ACTIONS.SET_PATIENT_PRESENCE,
            payload: {
              isOnline: response.data.isOnline,
              lastSeen: response.data.lastSeen,
              userName: response.data.userId || "Unknown",
              userEmail: "Unknown",
            },
          });
        }
      } catch (error) {
        console.error("Error checking patient presence:", error);
        dispatch({
          type: CONSULTATION_ACTIONS.SET_PATIENT_PRESENCE,
          payload: {
            isOnline: false,
            userName: "Unknown",
            userEmail: "Unknown",
          },
        });
      }
    },
    []
  );

  // Initiate video call
  const initiateVideoCall = useCallback(
    async (
      consultationId: string
    ): Promise<{ roomId: string; consultationId: string } | null> => {
      dispatch({ type: CONSULTATION_ACTIONS.SET_LOADING, payload: true });

      try {
        const response = await consultationsAPI.initiateCall(consultationId);
        if (response.success && response.data) {
          return {
            roomId: response.data.roomId,
            consultationId: consultationId,
          };
        }
        return null;
      } catch (error) {
        const errorMessage = extractErrorMessage(error as Error);
        dispatch({
          type: CONSULTATION_ACTIONS.SET_ERROR,
          payload: errorMessage,
        });
        toast.error("Failed to initiate video call");
        return null;
      } finally {
        dispatch({ type: CONSULTATION_ACTIONS.SET_LOADING, payload: false });
      }
    },
    []
  );

  // Cancel video call
  const cancelVideoCall = useCallback(
    (roomId: string, consultationId: string) => {
      if (socket) {
        console.log("📞 Cancelling video call...", { roomId, consultationId });
        socket.emit("call_cancelled", { roomId, consultationId });
        toast.info("Video call cancelled");
      }
    },
    [socket]
  );

  // Clear consultation state
  const clearConsultationState = useCallback(() => {
    dispatch({ type: CONSULTATION_ACTIONS.CLEAR_STATE });
  }, []);

  const contextValue: ConsultationContextType = {
    ...state,
    getConsultationByAppointment,
    checkPatientPresence,
    initiateVideoCall,
    cancelVideoCall,
    clearConsultationState,
  };

  return (
    <ConsultationContext.Provider value={contextValue}>
      {children}
    </ConsultationContext.Provider>
  );
};

// Hook
export const useConsultation = (): ConsultationContextType => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error(
      "useConsultation must be used within a ConsultationProvider"
    );
  }
  return context;
};
