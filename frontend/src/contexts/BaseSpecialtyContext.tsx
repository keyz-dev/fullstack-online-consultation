"use client";

import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { homeApi, Specialty } from "../api/home";

// Initial state
const initialState = {
  specialties: [],
  loading: true,
  error: null,
  filters: {
    search: "",
    sortBy: "name",
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  },
};

// Action types
const SPECIALTY_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_SPECIALTIES: "SET_SPECIALTIES",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  REFRESH_SPECIALTIES: "REFRESH_SPECIALTIES",
};

// Reducer
const specialtyReducer = (state: unknown, action: unknown) => {
  switch (action.type) {
    case SPECIALTY_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case SPECIALTY_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case SPECIALTY_ACTIONS.SET_SPECIALTIES:
      return {
        ...state,
        specialties: action.payload.specialties || [],
        pagination: {
          ...state.pagination,
          total:
            action.payload.total || action.payload.specialties?.length || 0,
          totalPages: action.payload.totalPages || 1,
        },
        loading: false,
        error: null,
      };

    case SPECIALTY_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 },
      };

    case SPECIALTY_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case SPECIALTY_ACTIONS.REFRESH_SPECIALTIES:
      return { ...state, loading: true, error: null };

    default:
      return state;
  }
};

// Create context
const BaseSpecialtyContext = createContext<any>(undefined);

// Provider component
export const BaseSpecialtyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(specialtyReducer, initialState);

  // Fetch all specialties
  const fetchSpecialties = useCallback(async () => {
    try {
      dispatch({ type: SPECIALTY_ACTIONS.SET_LOADING, payload: true });

      const response = await homeApi.getSpecialties();
      const fetchedSpecialties = response.data || [];

      dispatch({
        type: SPECIALTY_ACTIONS.SET_SPECIALTIES,
        payload: {
          specialties: fetchedSpecialties,
          total: fetchedSpecialties.length,
          totalPages: 1,
        },
      });
    } catch (err: unknown) {
      console.error("Error fetching specialties:", err);
      const errorMessage =
        err?.response?.data?.message ||
        "Failed to load specialties. Please try again.";
      dispatch({ type: SPECIALTY_ACTIONS.SET_ERROR, payload: errorMessage });
    }
  }, []);

  // Filter and sort specialties based on current filters (client-side)
  const getFilteredSpecialties = useCallback(() => {
    let filtered = state.specialties.filter((specialty: Specialty) => {
      // Search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        const specialtyName = specialty.name?.toLowerCase() || "";
        const specialtyDescription = specialty.description?.toLowerCase() || "";

        if (
          !specialtyName.includes(searchTerm) &&
          !specialtyDescription.includes(searchTerm)
        ) {
          return false;
        }
      }

      return true;
    });

    // Sort
    switch (state.filters.sortBy) {
      case "name":
        filtered.sort((a: Specialty, b: Specialty) =>
          (a.name || "").localeCompare(b.name || "")
        );
        break;
      case "doctors":
        filtered.sort(
          (a: Specialty, b: Specialty) =>
            (b.doctorCount || 0) - (a.doctorCount || 0)
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [state.specialties, state.filters]);

  // Handle search
  const handleSearch = useCallback((searchTerm: string) => {
    dispatch({
      type: SPECIALTY_ACTIONS.SET_FILTERS,
      payload: { search: searchTerm },
    });
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filters: unknown) => {
    dispatch({
      type: SPECIALTY_ACTIONS.SET_FILTERS,
      payload: filters,
    });
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((sortBy: string) => {
    dispatch({
      type: SPECIALTY_ACTIONS.SET_FILTERS,
      payload: { sortBy },
    });
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    dispatch({
      type: SPECIALTY_ACTIONS.SET_FILTERS,
      payload: {
        search: "",
        sortBy: "name",
      },
    });
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  // Get filtered and paginated specialties
  const getPaginatedSpecialties = useCallback(() => {
    const filtered = getFilteredSpecialties();
    const startIndex = (state.pagination.page - 1) * state.pagination.limit;
    const endIndex = startIndex + state.pagination.limit;
    return filtered.slice(startIndex, endIndex);
  }, [getFilteredSpecialties, state.pagination.page, state.pagination.limit]);

  // Load more
  const handleLoadMore = useCallback(() => {
    const filtered = getFilteredSpecialties();
    const totalPages = Math.ceil(filtered.length / state.pagination.limit);

    if (state.pagination.page < totalPages) {
      dispatch({
        type: SPECIALTY_ACTIONS.SET_PAGINATION,
        payload: { page: state.pagination.page + 1 },
      });
    }
  }, [getFilteredSpecialties, state.pagination.page, state.pagination.limit]);

  // Initialize data
  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  const value = {
    // State
    specialties: getPaginatedSpecialties(),
    allSpecialties: state.specialties,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    hasMore:
      state.pagination.page <
      Math.ceil(getFilteredSpecialties().length / state.pagination.limit),

    // Actions
    fetchSpecialties,
    handleSearch,
    handleFilterChange,
    handleSortChange,
    handleLoadMore,
    resetFilters,
    refreshData,
    getFilteredSpecialties,
  };

  return (
    <BaseSpecialtyContext.Provider value={value}>
      {children}
    </BaseSpecialtyContext.Provider>
  );
};

// Hook to use the context
export const useBaseSpecialty = () => {
  const context = useContext(BaseSpecialtyContext);
  if (context === undefined) {
    throw new Error(
      "useBaseSpecialty must be used within a BaseSpecialtyProvider"
    );
  }
  return context;
};
