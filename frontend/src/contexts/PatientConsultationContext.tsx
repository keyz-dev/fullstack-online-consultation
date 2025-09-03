"use client";

import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { useSocketContext } from "./SocketProvider";
import { consultationsAPI } from "@/api/consultations";
import { Consultation } from "@/types";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/extractError";

// Types
interface PatientConsultationStats {
  total: number;
  active: number;
  completed: number;
  avgRating: number;
}

interface PatientConsultationFilters {
  status: "all" | "in_progress" | "completed" | "cancelled" | "not_started";
  type: "all" | "video_call" | "voice_call" | "chat" | "in_person";
  search: string;
  sortBy: "date" | "doctor" | "status" | "rating";
  sortOrder: "asc" | "desc";
}

interface PatientConsultationPagination {
  page: number;
  limit: number;
  total: number;
}

// Initial state
const initialState = {
  consultations: [] as Consultation[],
  activeConsultations: [] as Consultation[],
  loading: true,
  error: null as string | null,
  filters: {
    status: "all",
    type: "all",
    search: "",
    sortBy: "date",
    sortOrder: "desc",
  } as PatientConsultationFilters,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  } as PatientConsultationPagination,
  stats: {
    total: 0,
    active: 0,
    completed: 0,
    avgRating: 0,
  } as PatientConsultationStats,
};

// Action types
const PATIENT_CONSULTATION_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_CONSULTATIONS: "SET_CONSULTATIONS",
  SET_ACTIVE_CONSULTATIONS: "SET_ACTIVE_CONSULTATIONS",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  SET_STATS: "SET_STATS",
  UPDATE_CONSULTATION: "UPDATE_CONSULTATION",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer
function patientConsultationReducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case PATIENT_CONSULTATION_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case PATIENT_CONSULTATION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case PATIENT_CONSULTATION_ACTIONS.SET_CONSULTATIONS:
      return { ...state, consultations: action.payload, loading: false };
    case PATIENT_CONSULTATION_ACTIONS.SET_ACTIVE_CONSULTATIONS:
      return { ...state, activeConsultations: action.payload };
    case PATIENT_CONSULTATION_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case PATIENT_CONSULTATION_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };
    case PATIENT_CONSULTATION_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    case PATIENT_CONSULTATION_ACTIONS.UPDATE_CONSULTATION:
      return {
        ...state,
        consultations: state.consultations.map((consultation) =>
          consultation.id === action.payload.id ? action.payload : consultation
        ),
      };
    case PATIENT_CONSULTATION_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

// Context
const PatientConsultationContext = createContext<{
  consultations: Consultation[];
  activeConsultations: Consultation[];
  loading: boolean;
  error: string | null;
  filters: PatientConsultationFilters;
  pagination: PatientConsultationPagination;
  stats: PatientConsultationStats;
  actions: {
    refreshConsultations: () => Promise<void>;
    refreshActiveConsultations: () => Promise<void>;
    setFilters: (filters: Partial<PatientConsultationFilters>) => void;
    setPagination: (pagination: Partial<PatientConsultationPagination>) => void;
    joinConsultation: (consultationId: string) => Promise<void>;
    leaveConsultation: (consultationId: string) => Promise<void>;
    clearError: () => void;
  };
} | null>(null);

// Provider
export const PatientConsultationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(
    patientConsultationReducer,
    initialState
  );
  const { socket } = useSocketContext();

  // Fetch consultations
  const refreshConsultations = useCallback(async () => {
    try {
      dispatch({
        type: PATIENT_CONSULTATION_ACTIONS.SET_LOADING,
        payload: true,
      });

      const response = await consultationsAPI.getConsultations("patient", {
        page: state.pagination.page,
        limit: state.pagination.limit,
        filters: state.filters,
      });

      console.log(
        "These are all the consultations from the context: ",
        response.consultations
      );

      dispatch({
        type: PATIENT_CONSULTATION_ACTIONS.SET_CONSULTATIONS,
        payload: response.consultations,
      });
      dispatch({
        type: PATIENT_CONSULTATION_ACTIONS.SET_PAGINATION,
        payload: {
          total: response.pagination.totalItems,
        },
      });

      // Calculate stats from consultations
      const stats = calculatePatientStats(response.consultations);
      dispatch({
        type: PATIENT_CONSULTATION_ACTIONS.SET_STATS,
        payload: stats,
      });
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      dispatch({
        type: PATIENT_CONSULTATION_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      toast.error(`Failed to fetch consultations: ${errorMessage}`);
    }
  }, [state.pagination.page, state.pagination.limit, state.filters]);

  // Fetch active consultations
  const refreshActiveConsultations = useCallback(async () => {
    try {
      const response = await consultationsAPI.getActiveConsultations("patient");
      const { activeConsultations } = response.data;
      dispatch({
        type: PATIENT_CONSULTATION_ACTIONS.SET_ACTIVE_CONSULTATIONS,
        payload: activeConsultations,
      });
    } catch (error) {
      console.error("Failed to fetch active consultations:", error);
    }
  }, []);

  // Join consultation
  const joinConsultation = useCallback(
    async (consultationId: string) => {
      try {
        await consultationsAPI.joinConsultationSession(consultationId);
        await refreshActiveConsultations();
        toast.success("Joined consultation successfully");
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        toast.error(`Failed to join consultation: ${errorMessage}`);
      }
    },
    [refreshActiveConsultations]
  );

  // Leave consultation
  const leaveConsultation = useCallback(
    async (consultationId: string) => {
      try {
        await consultationsAPI.leaveConsultationSession(consultationId);
        await refreshConsultations();
        await refreshActiveConsultations();
        toast.success("Left consultation successfully");
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        toast.error(`Failed to leave consultation: ${errorMessage}`);
      }
    },
    [refreshConsultations, refreshActiveConsultations]
  );

  // Set filters
  const setFilters = useCallback(
    (newFilters: Partial<PatientConsultationFilters>) => {
      dispatch({
        type: PATIENT_CONSULTATION_ACTIONS.SET_FILTERS,
        payload: newFilters,
      });
    },
    []
  );

  // Set pagination
  const setPagination = useCallback(
    (newPagination: Partial<PatientConsultationPagination>) => {
      dispatch({
        type: PATIENT_CONSULTATION_ACTIONS.SET_PAGINATION,
        payload: newPagination,
      });
    },
    []
  );

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: PATIENT_CONSULTATION_ACTIONS.CLEAR_ERROR });
  }, []);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleConsultationUpdate = (data: any) => {
      console.log("📊 Consultation updated via socket:", data);
      refreshConsultations();
      refreshActiveConsultations();
    };

    socket.on("consultation:status-updated", handleConsultationUpdate);
    socket.on("consultation:session-started", handleConsultationUpdate);
    socket.on("consultation:session-ended", handleConsultationUpdate);

    return () => {
      socket.off("consultation:status-updated", handleConsultationUpdate);
      socket.off("consultation:session-started", handleConsultationUpdate);
      socket.off("consultation:session-ended", handleConsultationUpdate);
    };
  }, [socket, refreshConsultations, refreshActiveConsultations]);

  // Initial load - only call once on mount
  useEffect(() => {
    let isMounted = true;

    const initialLoad = async () => {
      if (isMounted) {
        await refreshConsultations();
        await refreshActiveConsultations();
      }
    };

    initialLoad();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array for initial load only

  // Refresh when filters/pagination change
  useEffect(() => {
    let isMounted = true;

    const filterLoad = async () => {
      if (isMounted) {
        await refreshConsultations();
      }
    };

    filterLoad();

    return () => {
      isMounted = false;
    };
  }, [state.filters, state.pagination.page]); // Remove refreshConsultations from deps

  const value = {
    consultations: state.consultations,
    activeConsultations: state.activeConsultations,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    stats: state.stats,
    actions: {
      refreshConsultations,
      refreshActiveConsultations,
      setFilters,
      setPagination,
      joinConsultation,
      leaveConsultation,
      clearError,
    },
  };

  return (
    <PatientConsultationContext.Provider value={value}>
      {children}
    </PatientConsultationContext.Provider>
  );
};

// Hook
export const usePatientConsultations = () => {
  const context = useContext(PatientConsultationContext);
  if (!context) {
    throw new Error(
      "usePatientConsultations must be used within PatientConsultationProvider"
    );
  }
  return context;
};

// Helper function to calculate patient stats
function calculatePatientStats(
  consultations: Consultation[]
): PatientConsultationStats {
  const stats = consultations.reduce(
    (acc, consultation) => {
      acc.total++;

      if (consultation.status === "in_progress") acc.active++;
      if (consultation.status === "completed") acc.completed++;

      if (consultation.rating) {
        acc.totalRating += consultation.rating;
        acc.ratedCount++;
      }

      return acc;
    },
    {
      total: 0,
      active: 0,
      completed: 0,
      totalRating: 0,
      ratedCount: 0,
    }
  );

  const avgRating =
    stats.ratedCount > 0
      ? Math.round((stats.totalRating / stats.ratedCount) * 10) / 10
      : 0;

  return {
    total: stats.total,
    active: stats.active,
    completed: stats.completed,
    avgRating,
  };
}
