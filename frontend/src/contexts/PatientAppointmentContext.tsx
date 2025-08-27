"use client";

import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useContext,
} from "react";
import {
  appointmentsAPI,
  PatientAppointment,
  PatientAppointmentStats,
  PatientAppointmentFilters,
} from "@/api/appointments";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/extractError";

// Initial state
const initialState = {
  appointments: [] as PatientAppointment[],
  loading: true,
  error: null as string | null,
  filters: {
    status: "all",
    consultationType: "all",
    search: "",
    sortBy: "date",
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  stats: {
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    thisMonth: 0,
    pendingPayment: 0,
  } as PatientAppointmentStats,
};

// Action types
const PATIENT_APPOINTMENT_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_APPOINTMENTS: "SET_APPOINTMENTS",
  SET_STATS: "SET_STATS",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  REFRESH_APPOINTMENTS: "REFRESH_APPOINTMENTS",
} as const;

type PatientAppointmentAction = {
  type: keyof typeof PATIENT_APPOINTMENT_ACTIONS;
  payload?: unknown;
};

// Reducer
const patientAppointmentReducer = (
  state: typeof initialState,
  action: PatientAppointmentAction
) => {
  switch (action.type) {
    case PATIENT_APPOINTMENT_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload as boolean };

    case PATIENT_APPOINTMENT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload as string, loading: false };

    case PATIENT_APPOINTMENT_ACTIONS.SET_APPOINTMENTS:
      const payload = action.payload as {
        appointments?: PatientAppointment[];
        stats?: PatientAppointmentStats;
        total?: number;
        totalPages?: number;
      };
      return {
        ...state,
        appointments: payload.appointments || [],
        stats: payload.stats || state.stats,
        pagination: {
          ...state.pagination,
          total: payload.total || payload.appointments?.length || 0,
          totalPages: payload.totalPages || 0,
        },
        loading: false,
        error: null,
      };

    case PATIENT_APPOINTMENT_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload as PatientAppointmentStats,
      };

    case PATIENT_APPOINTMENT_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...(action.payload as Record<string, string>),
        },
        pagination: { ...state.pagination, page: 1 },
      };

    case PATIENT_APPOINTMENT_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...(action.payload as Record<string, number>),
        },
      };

    case PATIENT_APPOINTMENT_ACTIONS.REFRESH_APPOINTMENTS:
      return { ...state };

    default:
      return state;
  }
};

// Context interface
interface PatientAppointmentContextType {
  appointments: PatientAppointment[];
  stats: PatientAppointmentStats;
  loading: boolean;
  error: string | null;
  filters: typeof initialState.filters;
  pagination: typeof initialState.pagination;
  actions: {
    setFilter: (key: string, value: string) => void;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    clearFilters: () => void;
    refreshAppointments: () => Promise<void>;
    fetchStats: () => Promise<void>;
  };
}

// Create context
const PatientAppointmentContext =
  createContext<PatientAppointmentContextType | null>(null);

// Provider component
export const PatientAppointmentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(patientAppointmentReducer, initialState);

  // Calculate appointment statistics
  const calculateStats = useCallback(
    (appointments: PatientAppointment[]): PatientAppointmentStats => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      return {
        total: appointments.length,
        upcoming: appointments.filter(
          (apt) =>
            apt.status === "confirmed" && new Date(apt.timeSlot.date) > now
        ).length,
        completed: appointments.filter((apt) => apt.status === "completed")
          .length,
        cancelled: appointments.filter((apt) => apt.status === "cancelled")
          .length,
        thisMonth: appointments.filter(
          (apt) => new Date(apt.timeSlot.date) >= startOfMonth
        ).length,
        pendingPayment: appointments.filter(
          (apt) => apt.status === "pending_payment"
        ).length,
      };
    },
    []
  );

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      dispatch({
        type: PATIENT_APPOINTMENT_ACTIONS.SET_LOADING,
        payload: true,
      });

      const response = await appointmentsAPI.getPatientAppointments({
        page: state.pagination.page,
        limit: state.pagination.limit,
        ...state.filters,
      });

      const fetchedAppointments = response.data.appointments || [];
      const stats = calculateStats(fetchedAppointments);

      dispatch({
        type: PATIENT_APPOINTMENT_ACTIONS.SET_APPOINTMENTS,
        payload: {
          appointments: fetchedAppointments,
          stats,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        },
      });
    } catch (err: unknown) {
      console.error("Error fetching appointments:", err);
      const errorMessage = extractErrorMessage(err as Error);
      dispatch({
        type: PATIENT_APPOINTMENT_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      toast.error("Failed to load appointments");
    }
  }, [
    state.pagination.page,
    state.pagination.limit,
    state.filters,
    calculateStats,
  ]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await appointmentsAPI.getPatientAppointmentStats();
      dispatch({
        type: PATIENT_APPOINTMENT_ACTIONS.SET_STATS,
        payload: response.data,
      });
    } catch (err: unknown) {
      console.error("Error fetching appointment stats:", err);
      toast.error("Failed to load appointment statistics");
    }
  }, []);

  // Refresh appointments
  const refreshAppointments = useCallback(async () => {
    await fetchAppointments();
  }, [fetchAppointments]);

  // Actions
  const actions = {
    setFilter: (key: string, value: string) => {
      dispatch({
        type: PATIENT_APPOINTMENT_ACTIONS.SET_FILTERS,
        payload: { [key]: value },
      });
    },
    setSearch: (search: string) => {
      dispatch({
        type: PATIENT_APPOINTMENT_ACTIONS.SET_FILTERS,
        payload: { search },
      });
    },
    setPage: (page: number) => {
      dispatch({
        type: PATIENT_APPOINTMENT_ACTIONS.SET_PAGINATION,
        payload: { page },
      });
    },
    clearFilters: () => {
      dispatch({
        type: PATIENT_APPOINTMENT_ACTIONS.SET_FILTERS,
        payload: {
          status: "all",
          consultationType: "all",
          search: "",
          sortBy: "date",
        },
      });
    },
    refreshAppointments,
    fetchStats,
  };

  // Auto-fetch appointments when filters or pagination change
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Auto-fetch stats when provider mounts
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const contextValue: PatientAppointmentContextType = {
    appointments: state.appointments,
    stats: state.stats,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    actions,
  };

  return (
    <PatientAppointmentContext.Provider value={contextValue}>
      {children}
    </PatientAppointmentContext.Provider>
  );
};

// Hook to use the context
export const usePatientAppointments = () => {
  const context = useContext(PatientAppointmentContext);
  if (!context) {
    throw new Error(
      "usePatientAppointments must be used within a PatientAppointmentProvider"
    );
  }
  return context;
};
