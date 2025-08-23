"use client";

import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useContext,
} from "react";
import {
  symptomsAPI,
  Symptom,
  SymptomStats,
  CreateSymptomRequest,
  UpdateSymptomRequest,
} from "@/api/symptoms";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/extractError";

// Initial state
const initialState = {
  symptoms: [] as Symptom[],
  loading: true,
  error: null as string | null,
  filters: {
    specialtyId: "all",
    search: "",
    sortBy: "name",
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  stats: {
    total: 0,
    bySpecialty: [],
    topSymptoms: [],
  } as SymptomStats,
};

// Action types
const SYMPTOM_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_SYMPTOMS: "SET_SYMPTOMS",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  ADD_SYMPTOM: "ADD_SYMPTOM",
  UPDATE_SYMPTOM: "UPDATE_SYMPTOM",
  DELETE_SYMPTOM: "DELETE_SYMPTOM",
  REFRESH_SYMPTOMS: "REFRESH_SYMPTOMS",
} as const;

type SymptomAction = {
  type: keyof typeof SYMPTOM_ACTIONS;
  payload?: unknown;
};

// Reducer
const symptomReducer = (state: typeof initialState, action: SymptomAction) => {
  switch (action.type) {
    case SYMPTOM_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload as boolean };

    case SYMPTOM_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload as string, loading: false };

    case SYMPTOM_ACTIONS.SET_SYMPTOMS:
      const payload = action.payload as {
        symptoms?: Symptom[];
        stats?: SymptomStats;
        total?: number;
      };
      return {
        ...state,
        symptoms: payload.symptoms || [],
        stats: payload.stats || state.stats,
        pagination: {
          ...state.pagination,
          total: payload.total || payload.symptoms?.length || 0,
        },
        loading: false,
        error: null,
      };

    case SYMPTOM_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...(action.payload as Record<string, string>),
        },
        pagination: { ...state.pagination, page: 1 },
      };

    case SYMPTOM_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...(action.payload as Record<string, number>),
        },
      };

    case SYMPTOM_ACTIONS.ADD_SYMPTOM:
      return {
        ...state,
        symptoms: [action.payload as Symptom, ...state.symptoms],
      };

    case SYMPTOM_ACTIONS.UPDATE_SYMPTOM:
      const updatedSymptom = action.payload as Symptom;
      return {
        ...state,
        symptoms: state.symptoms.map((symptom) =>
          symptom.id === updatedSymptom.id ? updatedSymptom : symptom
        ),
      };

    case SYMPTOM_ACTIONS.DELETE_SYMPTOM:
      return {
        ...state,
        symptoms: state.symptoms.filter(
          (symptom) => symptom.id !== (action.payload as number)
        ),
      };

    case SYMPTOM_ACTIONS.REFRESH_SYMPTOMS:
      return { ...state, loading: true, error: null };

    default:
      return state;
  }
};

// Context type definition
interface SymptomContextType {
  symptoms: Symptom[];
  loading: boolean;
  error: string | null;
  filters: {
    specialtyId: string;
    search: string;
    sortBy: string;
  };
  filteredSymptoms: Symptom[];
  stats: SymptomStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    currentPage: number;
  };
  actions: {
    addSymptom: (symptom: Symptom) => void;
    updateSymptom: (symptom: Symptom) => void;
    deleteSymptom: (symptomId: number) => void;
    setFilter: (filterType: string, value: string) => void;
    setSearch: (searchTerm: string) => void;
    setPage: (page: number) => void;
    refreshSymptoms: () => void;
  };
  fetchSymptoms: () => Promise<void>;
  getSymptom: (id: number) => Promise<Symptom | null>;
  createSymptom: (
    data: CreateSymptomRequest
  ) => Promise<{ success: boolean; message: string }>;
  updateSymptom: (
    id: number,
    data: UpdateSymptomRequest
  ) => Promise<{ success: boolean; message: string }>;
  deleteSymptom: (id: number) => Promise<{ success: boolean; message: string }>;
}

// Create context
const SymptomContext = createContext<SymptomContextType | null>(null);

// Provider component
export const SymptomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(symptomReducer, initialState);

  // Calculate symptom statistics
  const calculateStats = useCallback((symptoms: Symptom[]): SymptomStats => {
    const bySpecialty = symptoms.reduce((acc, symptom) => {
      if (symptom.specialtyId) {
        const existing = acc.find(
          (item) => item.specialtyId === symptom.specialtyId
        );
        if (existing) {
          existing.count++;
        } else {
          acc.push({
            specialtyId: symptom.specialtyId,
            specialtyName: symptom.specialty?.name || "Unknown",
            count: 1,
          });
        }
      }
      return acc;
    }, [] as Array<{ specialtyId: number; specialtyName: string; count: number }>);

    const topSymptoms = symptoms.slice(0, 5).map((symptom) => ({
      id: symptom.id,
      name: symptom.name,
      specialtyName: symptom.specialty?.name || "Unknown",
    }));

    return {
      total: symptoms.length,
      bySpecialty,
      topSymptoms,
    };
  }, []);

  // Fetch symptoms
  const fetchSymptoms = useCallback(async () => {
    try {
      dispatch({ type: SYMPTOM_ACTIONS.SET_LOADING, payload: true });

      const response = await symptomsAPI.getAllSymptoms();
      const fetchedSymptoms = response.data || [];
      const stats = calculateStats(fetchedSymptoms);

      dispatch({
        type: SYMPTOM_ACTIONS.SET_SYMPTOMS,
        payload: {
          symptoms: fetchedSymptoms,
          stats,
          total: response.total || fetchedSymptoms.length,
        },
      });
    } catch (err: unknown) {
      console.error("Error fetching symptoms:", err);
      const errorMessage = extractErrorMessage(err as any);
      dispatch({ type: SYMPTOM_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error("Failed to load symptoms");
    }
  }, [calculateStats]);

  // Auto-fetch symptoms when provider mounts
  useEffect(() => {
    fetchSymptoms();
  }, [fetchSymptoms]);

  // Filter and sort symptoms based on current filters (client-side)
  const getFilteredSymptoms = useCallback(() => {
    if (!state.symptoms.length) return [];

    const filtered = state.symptoms.filter((symptom) => {
      // Specialty filter
      if (
        state.filters.specialtyId !== "all" &&
        symptom.specialtyId?.toString() !== state.filters.specialtyId
      ) {
        return false;
      }

      // Search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        const symptomName = symptom.name?.toLowerCase() || "";

        if (!symptomName.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });

    // Sort the filtered results
    if (state.filters.sortBy) {
      filtered.sort((a, b) => {
        switch (state.filters.sortBy) {
          case "name":
            return (a.name || "").localeCompare(b.name || "");
          case "createdAt":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "updatedAt":
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [state.symptoms, state.filters]);

  // Get paginated symptoms from filtered results
  const getPaginatedSymptoms = useCallback(() => {
    const filteredSymptoms = getFilteredSymptoms();
    const startIndex = (state.pagination.page - 1) * state.pagination.limit;
    const endIndex = startIndex + state.pagination.limit;
    return filteredSymptoms.slice(startIndex, endIndex);
  }, [getFilteredSymptoms, state.pagination.page, state.pagination.limit]);

  // Calculate pagination info from filtered results
  const getPaginationInfo = useCallback(() => {
    const filteredSymptoms = getFilteredSymptoms();
    const total = filteredSymptoms.length;
    const totalPages = Math.ceil(total / state.pagination.limit);

    return {
      total,
      totalPages,
      currentPage: state.pagination.page,
    };
  }, [getFilteredSymptoms, state.pagination.limit, state.pagination.page]);

  // Get symptom by ID
  const getSymptom = useCallback(
    async (id: number): Promise<Symptom | null> => {
      try {
        dispatch({ type: SYMPTOM_ACTIONS.SET_LOADING, payload: true });
        const response = await symptomsAPI.getSymptomById(id);
        return response.data;
      } catch (err: unknown) {
        const errorMessage = extractErrorMessage(err as any);
        dispatch({ type: SYMPTOM_ACTIONS.SET_ERROR, payload: errorMessage });
        toast.error("Failed to fetch symptom");
        return null;
      } finally {
        dispatch({ type: SYMPTOM_ACTIONS.SET_LOADING, payload: false });
      }
    },
    []
  );

  // Create symptom
  const createSymptom = useCallback(async (data: CreateSymptomRequest) => {
    try {
      dispatch({ type: SYMPTOM_ACTIONS.SET_LOADING, payload: true });

      const response = await symptomsAPI.createSymptom(data);
      const newSymptom = response.data;

      dispatch({
        type: SYMPTOM_ACTIONS.ADD_SYMPTOM,
        payload: newSymptom,
      });

      return { success: true, message: "Symptom created successfully" };
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err as any);
      dispatch({ type: SYMPTOM_ACTIONS.SET_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: SYMPTOM_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Update symptom
  const updateSymptom = useCallback(
    async (id: number, data: UpdateSymptomRequest) => {
      try {
        dispatch({ type: SYMPTOM_ACTIONS.SET_LOADING, payload: true });

        const response = await symptomsAPI.updateSymptom(id, data);
        const updatedSymptom = response.data;

        dispatch({
          type: SYMPTOM_ACTIONS.UPDATE_SYMPTOM,
          payload: updatedSymptom,
        });

        return { success: true, message: "Symptom updated successfully" };
      } catch (err: unknown) {
        const errorMessage = extractErrorMessage(err as any);
        dispatch({ type: SYMPTOM_ACTIONS.SET_ERROR, payload: errorMessage });
        throw new Error(errorMessage);
      } finally {
        dispatch({ type: SYMPTOM_ACTIONS.SET_LOADING, payload: false });
      }
    },
    []
  );

  // Delete symptom
  const deleteSymptom = useCallback(async (id: number) => {
    try {
      dispatch({ type: SYMPTOM_ACTIONS.SET_LOADING, payload: true });

      await symptomsAPI.deleteSymptom(id);
      dispatch({ type: SYMPTOM_ACTIONS.DELETE_SYMPTOM, payload: id });

      return { success: true, message: "Symptom deleted successfully" };
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err as any);
      dispatch({ type: SYMPTOM_ACTIONS.SET_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: SYMPTOM_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Actions
  const actions = {
    // Symptom management
    addSymptom: (symptom: Symptom) => {
      dispatch({ type: SYMPTOM_ACTIONS.ADD_SYMPTOM, payload: symptom });
    },

    updateSymptom: (symptom: Symptom) => {
      dispatch({
        type: SYMPTOM_ACTIONS.UPDATE_SYMPTOM,
        payload: symptom,
      });
    },

    deleteSymptom: (symptomId: number) => {
      dispatch({
        type: SYMPTOM_ACTIONS.DELETE_SYMPTOM,
        payload: symptomId,
      });
    },

    // Filter management
    setFilter: (filterType: string, value: string) => {
      dispatch({
        type: SYMPTOM_ACTIONS.SET_FILTERS,
        payload: { [filterType]: value },
      });
      // Reset to page 1 when filters change
      dispatch({
        type: SYMPTOM_ACTIONS.SET_PAGINATION,
        payload: { page: 1 },
      });
    },

    setSearch: (searchTerm: string) => {
      dispatch({
        type: SYMPTOM_ACTIONS.SET_FILTERS,
        payload: { search: searchTerm },
      });
      // Reset to page 1 when search changes
      dispatch({
        type: SYMPTOM_ACTIONS.SET_PAGINATION,
        payload: { page: 1 },
      });
    },

    // Pagination
    setPage: (page: number) => {
      dispatch({ type: SYMPTOM_ACTIONS.SET_PAGINATION, payload: { page } });
    },

    // Refresh symptoms
    refreshSymptoms: () => {
      dispatch({ type: SYMPTOM_ACTIONS.REFRESH_SYMPTOMS });
    },
  };

  // Context value
  const value = {
    ...state,
    filteredSymptoms: getPaginatedSymptoms(),
    stats: calculateStats(getFilteredSymptoms()),
    pagination: {
      ...state.pagination,
      ...getPaginationInfo(),
    },
    actions,
    fetchSymptoms,
    getSymptom,
    createSymptom,
    updateSymptom,
    deleteSymptom,
  };

  return (
    <SymptomContext.Provider value={value}>{children}</SymptomContext.Provider>
  );
};

export const useSymptom = () => {
  const context = useContext(SymptomContext);
  if (!context) {
    throw new Error("useSymptom must be used within a SymptomProvider");
  }
  return context;
};
