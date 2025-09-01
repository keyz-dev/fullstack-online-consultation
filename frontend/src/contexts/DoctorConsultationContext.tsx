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
interface DoctorConsultationStats {
  total: number;
  active: number;
  completed: number;
  avgDuration: number;
}

interface DoctorConsultationFilters {
  status: "all" | "in_progress" | "completed" | "cancelled" | "not_started";
  type: "all" | "video_call" | "voice_call" | "chat" | "in_person";
  search: string;
  sortBy: "date" | "patient" | "status" | "duration";
  sortOrder: "asc" | "desc";
}

interface DoctorConsultationPagination {
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
  } as DoctorConsultationFilters,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  } as DoctorConsultationPagination,
  stats: {
    total: 0,
    active: 0,
    completed: 0,
    avgDuration: 0,
  } as DoctorConsultationStats,
};

// Action types
const DOCTOR_CONSULTATION_ACTIONS = {
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
function doctorConsultationReducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case DOCTOR_CONSULTATION_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case DOCTOR_CONSULTATION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case DOCTOR_CONSULTATION_ACTIONS.SET_CONSULTATIONS:
      return { ...state, consultations: action.payload, loading: false };
    case DOCTOR_CONSULTATION_ACTIONS.SET_ACTIVE_CONSULTATIONS:
      return { ...state, activeConsultations: action.payload };
    case DOCTOR_CONSULTATION_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case DOCTOR_CONSULTATION_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    case DOCTOR_CONSULTATION_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    case DOCTOR_CONSULTATION_ACTIONS.UPDATE_CONSULTATION:
      return {
        ...state,
        consultations: state.consultations.map(consultation =>
          consultation.id === action.payload.id ? action.payload : consultation
        ),
      };
    case DOCTOR_CONSULTATION_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

// Context
const DoctorConsultationContext = createContext<{
  consultations: Consultation[];
  activeConsultations: Consultation[];
  loading: boolean;
  error: string | null;
  filters: DoctorConsultationFilters;
  pagination: DoctorConsultationPagination;
  stats: DoctorConsultationStats;
  actions: {
    refreshConsultations: () => Promise<void>;
    refreshActiveConsultations: () => Promise<void>;
    setFilters: (filters: Partial<DoctorConsultationFilters>) => void;
    setPagination: (pagination: Partial<DoctorConsultationPagination>) => void;
    joinConsultation: (consultationId: string) => Promise<void>;
    endConsultation: (consultationId: string) => Promise<void>;
    clearError: () => void;
  };
} | null>(null);

// Provider
export const DoctorConsultationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(doctorConsultationReducer, initialState);
  const { socket } = useSocketContext();

  // Fetch consultations
  const refreshConsultations = useCallback(async () => {
    try {
      dispatch({ type: DOCTOR_CONSULTATION_ACTIONS.SET_LOADING, payload: true });
      
      console.log('🔄 Fetching consultations with filters:', state.filters);
      
      const response = await consultationsAPI.getConsultations({
        page: state.pagination.page,
        limit: state.pagination.limit,
        filters: state.filters,
      });

      console.log('📊 Consultations API response:', response);

      dispatch({ type: DOCTOR_CONSULTATION_ACTIONS.SET_CONSULTATIONS, payload: response.consultations || [] });
      dispatch({ type: DOCTOR_CONSULTATION_ACTIONS.SET_PAGINATION, payload: {
        total: response.pagination?.totalItems || 0
      }});

      // Calculate stats from consultations
      const stats = calculateStats(response.consultations || []);
      dispatch({ type: DOCTOR_CONSULTATION_ACTIONS.SET_STATS, payload: stats });

    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      dispatch({ type: DOCTOR_CONSULTATION_ACTIONS.SET_ERROR, payload: errorMessage });
      console.error('❌ Failed to fetch consultations:', error);
      // Don't show toast for empty data, only for actual errors
      if (!errorMessage.includes('No consultations found')) {
        toast.error(`Failed to fetch consultations: ${errorMessage}`);
      }
    }
  }, [state.pagination.page, state.pagination.limit, state.filters]);

  // Fetch active consultations
  const refreshActiveConsultations = useCallback(async () => {
    try {
      const { activeConsultations } = await consultationsAPI.getActiveConsultations();
      dispatch({ type: DOCTOR_CONSULTATION_ACTIONS.SET_ACTIVE_CONSULTATIONS, payload: activeConsultations });
    } catch (error) {
      console.error("Failed to fetch active consultations:", error);
    }
  }, []);

  // Join consultation
  const joinConsultation = useCallback(async (consultationId: string) => {
    try {
      await consultationsAPI.joinConsultationSession(consultationId);
      await refreshActiveConsultations();
      toast.success("Joined consultation successfully");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(`Failed to join consultation: ${errorMessage}`);
    }
  }, [refreshActiveConsultations]);

  // End consultation
  const endConsultation = useCallback(async (consultationId: string) => {
    try {
      await consultationsAPI.leaveConsultationSession(consultationId);
      await refreshConsultations();
      await refreshActiveConsultations();
      toast.success("Consultation ended successfully");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(`Failed to end consultation: ${errorMessage}`);
    }
  }, [refreshConsultations, refreshActiveConsultations]);

  // Set filters
  const setFilters = useCallback((newFilters: Partial<DoctorConsultationFilters>) => {
    dispatch({ type: DOCTOR_CONSULTATION_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  // Set pagination
  const setPagination = useCallback((newPagination: Partial<DoctorConsultationPagination>) => {
    dispatch({ type: DOCTOR_CONSULTATION_ACTIONS.SET_PAGINATION, payload: newPagination });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: DOCTOR_CONSULTATION_ACTIONS.CLEAR_ERROR });
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
      endConsultation,
      clearError,
    },
  };

  return (
    <DoctorConsultationContext.Provider value={value}>
      {children}
    </DoctorConsultationContext.Provider>
  );
};

// Hook
export const useDoctorConsultations = () => {
  const context = useContext(DoctorConsultationContext);
  if (!context) {
    throw new Error("useDoctorConsultations must be used within DoctorConsultationProvider");
  }
  return context;
};

// Helper function to calculate stats
function calculateStats(consultations: Consultation[]): DoctorConsultationStats {
  const stats = consultations.reduce((acc, consultation) => {
    acc.total++;
    
    if (consultation.status === "in_progress") acc.active++;
    if (consultation.status === "completed") acc.completed++;
    
    if (consultation.duration && consultation.status === "completed") {
      acc.totalDuration += consultation.duration;
    }
    
    return acc;
  }, {
    total: 0,
    active: 0,
    completed: 0,
    totalDuration: 0,
  });

  const avgDuration = stats.completed > 0 ? Math.round(stats.totalDuration / stats.completed) : 0;

  return {
    total: stats.total,
    active: stats.active,
    completed: stats.completed,
    avgDuration,
  };
}
