"use client";

import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useContext,
} from "react";
import {
  doctorsApi,
  Doctor,
  DoctorFilters,
  DoctorSearchParams,
} from "../api/doctors";
import { homeApi, Specialty } from "../api/home";
import { symptomsAPI, Symptom } from "../api/symptoms";

// Initial state
const initialState = {
  doctors: [],
  allDoctors: [],
  loading: true,
  error: null,
  filters: {
    search: "",
    specialtyId: undefined,
    symptomId: undefined,
    experience: "",
    consultationFeeMin: undefined,
    consultationFeeMax: undefined,
    rating: undefined,
    availability: undefined,
    sortBy: "name" as const,
    sortOrder: "ASC" as const,
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  },
  specialties: [],
  symptoms: [],
  specialtiesLoading: false,
  symptomsLoading: false,
};

// Action types
const DOCTOR_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_DOCTORS: "SET_DOCTORS",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  SET_SPECIALTIES: "SET_SPECIALTIES",
  SET_SYMPTOMS: "SET_SYMPTOMS",
  SET_SPECIALTIES_LOADING: "SET_SPECIALTIES_LOADING",
  SET_SYMPTOMS_LOADING: "SET_SYMPTOMS_LOADING",
  REFRESH_DOCTORS: "REFRESH_DOCTORS",
};

// Reducer
const doctorReducer = (state: unknown, action: unknown) => {
  switch (action.type) {
    case DOCTOR_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case DOCTOR_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case DOCTOR_ACTIONS.SET_DOCTORS:
      return {
        ...state,
        doctors: action.payload.doctors || [],
        allDoctors: action.payload.allDoctors || action.payload.doctors || [],
        pagination: {
          ...state.pagination,
          total: action.payload.total || action.payload.doctors?.length || 0,
          totalPages: action.payload.totalPages || 1,
        },
        loading: false,
        error: null,
      };

    case DOCTOR_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 },
      };

    case DOCTOR_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case DOCTOR_ACTIONS.SET_SPECIALTIES:
      return {
        ...state,
        specialties: action.payload,
        specialtiesLoading: false,
      };

    case DOCTOR_ACTIONS.SET_SYMPTOMS:
      return {
        ...state,
        symptoms: action.payload,
        symptomsLoading: false,
      };

    case DOCTOR_ACTIONS.SET_SPECIALTIES_LOADING:
      return { ...state, specialtiesLoading: action.payload };

    case DOCTOR_ACTIONS.SET_SYMPTOMS_LOADING:
      return { ...state, symptomsLoading: action.payload };

    case DOCTOR_ACTIONS.REFRESH_DOCTORS:
      return { ...state, loading: true, error: null };

    default:
      return state;
  }
};

// Create context
const DoctorContext = createContext<any>(undefined);

// Provider component
export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(doctorReducer, initialState);

  // Fetch all doctors
  const fetchDoctors = useCallback(async (params: DoctorSearchParams = {}) => {
    try {
      dispatch({ type: DOCTOR_ACTIONS.SET_LOADING, payload: true });

      const response = await doctorsApi.getAllDoctors(params);
      const fetchedDoctors = response.data.doctors || [];

      dispatch({
        type: DOCTOR_ACTIONS.SET_DOCTORS,
        payload: {
          doctors: fetchedDoctors,
          allDoctors: fetchedDoctors,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        },
      });
    } catch (err: unknown) {
      console.error("Error fetching doctors:", err);
      const errorMessage =
        err?.response?.data?.message ||
        "Failed to load doctors. Please try again.";
      dispatch({ type: DOCTOR_ACTIONS.SET_ERROR, payload: errorMessage });
    }
  }, []);

  // Fetch specialties
  const fetchSpecialties = useCallback(async () => {
    try {
      dispatch({ type: DOCTOR_ACTIONS.SET_SPECIALTIES_LOADING, payload: true });

      const response = await homeApi.getSpecialties();
      const fetchedSpecialties = response.data || [];

      dispatch({
        type: DOCTOR_ACTIONS.SET_SPECIALTIES,
        payload: fetchedSpecialties,
      });
    } catch (err: unknown) {
      console.error("Error fetching specialties:", err);
      dispatch({
        type: DOCTOR_ACTIONS.SET_SPECIALTIES_LOADING,
        payload: false,
      });
    }
  }, []);

  // Fetch symptoms
  const fetchSymptoms = useCallback(async () => {
    try {
      dispatch({ type: DOCTOR_ACTIONS.SET_SYMPTOMS_LOADING, payload: true });

      const response = await symptomsAPI.getAllSymptoms();
      const fetchedSymptoms = response.data || [];

      dispatch({
        type: DOCTOR_ACTIONS.SET_SYMPTOMS,
        payload: fetchedSymptoms,
      });
    } catch (err: unknown) {
      console.error("Error fetching symptoms:", err);
      dispatch({ type: DOCTOR_ACTIONS.SET_SYMPTOMS_LOADING, payload: false });
    }
  }, []);

  // Handle search
  const handleSearch = useCallback((searchTerm: string) => {
    dispatch({
      type: DOCTOR_ACTIONS.SET_FILTERS,
      payload: { search: searchTerm },
    });
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filters: Partial<DoctorFilters>) => {
    dispatch({
      type: DOCTOR_ACTIONS.SET_FILTERS,
      payload: filters,
    });
  }, []);

  // Handle sort change
  const handleSortChange = useCallback(
    (sortBy: string, sortOrder: "ASC" | "DESC" = "ASC") => {
      dispatch({
        type: DOCTOR_ACTIONS.SET_FILTERS,
        payload: { sortBy, sortOrder },
      });
    },
    []
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    dispatch({
      type: DOCTOR_ACTIONS.SET_FILTERS,
      payload: {
        search: "",
        specialtyId: undefined,
        symptomId: undefined,
        experience: "",
        consultationFeeMin: undefined,
        consultationFeeMax: undefined,
        rating: undefined,
        availability: undefined,
        sortBy: "name",
        sortOrder: "ASC",
      },
    });
  }, []);

  // Load more
  const handleLoadMore = useCallback(() => {
    if (state.pagination.page < state.pagination.totalPages) {
      dispatch({
        type: DOCTOR_ACTIONS.SET_PAGINATION,
        payload: { page: state.pagination.page + 1 },
      });
    }
  }, [state.pagination.page, state.pagination.totalPages]);

  // Refresh data
  const refreshData = useCallback(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Apply filters and fetch doctors
  useEffect(() => {
    const params: DoctorSearchParams = {
      ...state.filters,
      page: state.pagination.page,
      limit: state.pagination.limit,
    };

    // Remove undefined values
    Object.keys(params).forEach((key) => {
      if (params[key as keyof DoctorSearchParams] === undefined) {
        delete params[key as keyof DoctorSearchParams];
      }
    });

    fetchDoctors(params);
  }, [
    state.filters,
    state.pagination.page,
    state.pagination.limit,
    fetchDoctors,
  ]);

  // Initialize data
  useEffect(() => {
    fetchSpecialties();
    fetchSymptoms();
  }, [fetchSpecialties, fetchSymptoms]);

  const value = {
    // State
    doctors: state.doctors,
    allDoctors: state.allDoctors,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    specialties: state.specialties,
    symptoms: state.symptoms,
    specialtiesLoading: state.specialtiesLoading,
    symptomsLoading: state.symptomsLoading,
    hasMore: state.pagination.page < state.pagination.totalPages,

    // Actions
    fetchDoctors,
    handleSearch,
    handleFilterChange,
    handleSortChange,
    handleLoadMore,
    resetFilters,
    refreshData,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

// Hook to use the context
export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error("useDoctor must be used within a DoctorProvider");
  }
  return context;
};
