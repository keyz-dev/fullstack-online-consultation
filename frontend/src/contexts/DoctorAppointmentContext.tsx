"use client";

import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { useSocketContext } from "./SocketProvider";
import {
  appointmentsAPI,
  DoctorAppointment,
  DoctorAppointmentStats,
  DoctorAppointmentFilters,
  DoctorAppointmentPagination,
} from "@/api/appointments";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/extractError";

// Initial state
const initialState = {
  appointments: [] as DoctorAppointment[],
  loading: true,
  error: null as string | null,
  filters: {
    status: "all",
    consultationType: "all",
    search: "",
    sortBy: "date",
  } as DoctorAppointmentFilters,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  } as DoctorAppointmentPagination,
  stats: {
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    completed: 0,
    cancelled: 0,
    successRate: 0,
  } as DoctorAppointmentStats,
};

// Action types
const DOCTOR_APPOINTMENT_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_APPOINTMENTS: "SET_APPOINTMENTS",
  SET_STATS: "SET_STATS",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  REFRESH_APPOINTMENTS: "REFRESH_APPOINTMENTS",
} as const;

type DoctorAppointmentAction = {
  type: keyof typeof DOCTOR_APPOINTMENT_ACTIONS;
  payload?: unknown;
};

// Reducer
const doctorAppointmentReducer = (
  state: typeof initialState,
  action: DoctorAppointmentAction
): typeof initialState => {
  switch (action.type) {
    case DOCTOR_APPOINTMENT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload as boolean,
      };

    case DOCTOR_APPOINTMENT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload as string | null,
        loading: false,
      };

    case DOCTOR_APPOINTMENT_ACTIONS.SET_APPOINTMENTS:
      const appointmentData = action.payload as {
        appointments: DoctorAppointment[];
        pagination: DoctorAppointmentPagination;
      };
      return {
        ...state,
        appointments: appointmentData.appointments,
        pagination: appointmentData.pagination,
        loading: false,
        error: null,
      };

    case DOCTOR_APPOINTMENT_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload as DoctorAppointmentStats,
      };

    case DOCTOR_APPOINTMENT_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...(action.payload as DoctorAppointmentFilters),
        },
        pagination: { ...state.pagination, page: 1 }, // Reset to first page when filters change
      };

    case DOCTOR_APPOINTMENT_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...(action.payload as Partial<DoctorAppointmentPagination>),
        },
      };

    case DOCTOR_APPOINTMENT_ACTIONS.REFRESH_APPOINTMENTS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    default:
      return state;
  }
};

// Context type
interface DoctorAppointmentContextType {
  // State
  appointments: DoctorAppointment[];
  loading: boolean;
  error: string | null;
  filters: DoctorAppointmentFilters;
  pagination: DoctorAppointmentPagination;
  stats: DoctorAppointmentStats;

  // Actions
  fetchAppointments: () => Promise<void>;
  fetchStats: () => Promise<void>;
  setFilters: (filters: Partial<DoctorAppointmentFilters>) => void;
  setPagination: (pagination: Partial<DoctorAppointmentPagination>) => void;
  refreshAppointments: () => void;
}

// Create context
const DoctorAppointmentContext =
  createContext<DoctorAppointmentContextType | null>(null);

// Provider component
export const DoctorAppointmentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(doctorAppointmentReducer, initialState);
  const socket = useSocketContext();

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      dispatch({ type: DOCTOR_APPOINTMENT_ACTIONS.SET_LOADING, payload: true });

      const response = await appointmentsAPI.getDoctorAppointments({
        ...state.filters,
        page: state.pagination.page,
        limit: state.pagination.limit,
      });

      const payload = {
        appointments: response.data.appointments,
        pagination: response.data.pagination,
      };

      dispatch({
        type: DOCTOR_APPOINTMENT_ACTIONS.SET_APPOINTMENTS,
        payload,
      });
    } catch (err: unknown) {
      console.error("Error fetching doctor appointments:", err);
      const errorMessage = extractErrorMessage(err as unknown);
      dispatch({
        type: DOCTOR_APPOINTMENT_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      toast.error("Failed to load appointments");
    }
  }, [state.filters, state.pagination.page, state.pagination.limit]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await appointmentsAPI.getDoctorAppointmentStats();
      dispatch({
        type: DOCTOR_APPOINTMENT_ACTIONS.SET_STATS,
        payload: response.data,
      });
    } catch (err: unknown) {
      console.error("Error fetching doctor appointment stats:", err);
      const errorMessage = extractErrorMessage(err as unknown);
      toast.error(`Error: ${errorMessage}`);
    }
  }, []);

  // Set filters
  const setFilters = useCallback(
    (newFilters: Partial<DoctorAppointmentFilters>) => {
      dispatch({
        type: DOCTOR_APPOINTMENT_ACTIONS.SET_FILTERS,
        payload: newFilters,
      });
    },
    []
  );

  // Set pagination
  const setPagination = useCallback(
    (newPagination: Partial<DoctorAppointmentPagination>) => {
      dispatch({
        type: DOCTOR_APPOINTMENT_ACTIONS.SET_PAGINATION,
        payload: newPagination,
      });
    },
    []
  );

  // Refresh appointments
  const refreshAppointments = useCallback(() => {
    dispatch({ type: DOCTOR_APPOINTMENT_ACTIONS.REFRESH_APPOINTMENTS });
  }, []);

  // Auto-fetch appointments when filters or pagination change
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Auto-fetch stats when provider mounts
  useEffect(() => {
    fetchStats();
  }, [fetchStats, fetchAppointments]);

  // Real-time socket listeners for doctor appointments
  useEffect(() => {
    if (!socket?.socket) return;

    // Listen for payment confirmations only
    socket.socket.on("payment-confirmed", (data: unknown) => {
      console.log("💰 Payment confirmed:", data);
      toast.success(
        `New confirmed appointment with ${data.patientName} on ${data.appointmentDate}`
      );
      // Refresh appointments list
      fetchAppointments();
      // Refresh stats
      fetchStats();
    });

    // // Listen for appointment status updates (for cancellations, completions, etc.)
    // socket.socket.on("appointment-status-updated", (data: unknown) => {
    //   console.log("🔄 Appointment status updated:", data);
    //   toast.info(`Appointment status updated: ${data.status}`);
    //   // Refresh appointments list
    //   fetchAppointments();
    //   // Refresh stats
    //   fetchStats();
    // });

    return () => {
      socket.socket.off("payment-confirmed");
      socket.socket.off("appointment-status-updated");
    };
  }, [socket, fetchAppointments, fetchStats]);

  const value: DoctorAppointmentContextType = {
    // State
    appointments: state.appointments,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    stats: state.stats,

    // Actions
    fetchAppointments,
    fetchStats,
    setFilters,
    setPagination,
    refreshAppointments,
  };

  return (
    <DoctorAppointmentContext.Provider value={value}>
      {children}
    </DoctorAppointmentContext.Provider>
  );
};

// Hook to use the context
export const useDoctorAppointments = () => {
  const context = useContext(DoctorAppointmentContext);
  if (!context) {
    throw new Error(
      "useDoctorAppointments must be used within a DoctorAppointmentProvider"
    );
  }
  return context;
};
