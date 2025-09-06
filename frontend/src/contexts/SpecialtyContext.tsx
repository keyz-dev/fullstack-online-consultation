import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useContext,
} from "react";
import {
  specialtiesAPI,
  Specialty,
  SpecialtyStats,
  CreateSpecialtyRequest,
  UpdateSpecialtyRequest,
} from "@/api/specialties";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/extractError";

// Initial state
const initialState = {
  specialties: [] as Specialty[],
  loading: true,
  error: null as string | null,
  filters: {
    status: "all",
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
    active: 0,
    inactive: 0,
  } as SpecialtyStats,
};

// Action types
const SPECIALTY_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_SPECIALTIES: "SET_SPECIALTIES",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  ADD_SPECIALTY: "ADD_SPECIALTY",
  UPDATE_SPECIALTY: "UPDATE_SPECIALTY",
  DELETE_SPECIALTY: "DELETE_SPECIALTY",
  REFRESH_SPECIALTIES: "REFRESH_SPECIALTIES",
} as const;

type SpecialtyAction = {
  type: keyof typeof SPECIALTY_ACTIONS;
  payload?: unknown;
};

// Reducer
const specialtyReducer = (
  state: typeof initialState,
  action: SpecialtyAction
) => {
  switch (action.type) {
    case SPECIALTY_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload as boolean };

    case SPECIALTY_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload as string, loading: false };

    case SPECIALTY_ACTIONS.SET_SPECIALTIES:
      const payload = action.payload as {
        specialties?: Specialty[];
        stats?: SpecialtyStats;
        total?: number;
      };
      return {
        ...state,
        specialties: payload.specialties || [],
        stats: payload.stats || state.stats,
        pagination: {
          ...state.pagination,
          total: payload.total || payload.specialties?.length || 0,
        },
        loading: false,
        error: null,
      };

    case SPECIALTY_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...(action.payload as Record<string, string>),
        },
        pagination: { ...state.pagination, page: 1 },
      };

    case SPECIALTY_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...(action.payload as Record<string, number>),
        },
      };

    case SPECIALTY_ACTIONS.ADD_SPECIALTY:
      return {
        ...state,
        specialties: [action.payload as Specialty, ...state.specialties],
      };

    case SPECIALTY_ACTIONS.UPDATE_SPECIALTY:
      const updatedSpecialty = action.payload as Specialty;
      return {
        ...state,
        specialties: state.specialties.map((spec) =>
          spec.id === updatedSpecialty.id ? updatedSpecialty : spec
        ),
      };

    case SPECIALTY_ACTIONS.DELETE_SPECIALTY:
      return {
        ...state,
        specialties: state.specialties.filter(
          (spec) => spec.id !== (action.payload as number)
        ),
      };

    case SPECIALTY_ACTIONS.REFRESH_SPECIALTIES:
      return { ...state, loading: true, error: null };

    default:
      return state;
  }
};

// Context type definition
interface SpecialtyContextType {
  specialties: Specialty[];
  loading: boolean;
  error: string | null;
  filters: {
    status: string;
    search: string;
    sortBy: string;
  };
  filteredSpecialties: Specialty[];
  stats: SpecialtyStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    currentPage: number;
  };
  actions: {
    addSpecialty: (specialty: Specialty) => void;
    updateSpecialty: (specialty: Specialty) => void;
    deleteSpecialty: (specialtyId: number) => void;
    setFilter: (filterType: string, value: string) => void;
    setSearch: (searchTerm: string) => void;
    setPage: (page: number) => void;
    refreshSpecialties: () => void;
  };
  fetchSpecialties: () => Promise<void>;
  getSpecialty: (id: number) => Promise<Specialty | null>;
  createSpecialty: (
    data: CreateSpecialtyRequest
  ) => Promise<{ success: boolean; message: string }>;
  updateSpecialty: (
    id: number,
    data: UpdateSpecialtyRequest
  ) => Promise<{ success: boolean; message: string }>;
  deleteSpecialty: (
    id: number
  ) => Promise<{ success: boolean; message: string }>;
}

// Create context
const SpecialtyContext = createContext<SpecialtyContextType | null>(null);

// Provider component
export const SpecialtyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(specialtyReducer, initialState);

  // Calculate specialty statistics
  const calculateStats = useCallback(
    (specialties: Specialty[]): SpecialtyStats => {
      return {
        total: specialties.length,
        active: specialties.filter((spec) => spec.isActive).length,
        inactive: specialties.filter((spec) => !spec.isActive).length,
        topSpecialties: specialties
          .sort(
            (a, b) => (b.stats?.doctorCount || 0) - (a.stats?.doctorCount || 0)
          )
          .slice(0, 5)
          .map((spec) => ({
            id: spec.id,
            name: spec.name,
            doctorCount: spec.stats?.doctorCount || 0,
          })),
      };
    },
    []
  );

  // Fetch specialties
  const fetchSpecialties = useCallback(async () => {
    try {
      dispatch({ type: SPECIALTY_ACTIONS.SET_LOADING, payload: true });

      const response = await specialtiesAPI.getAllSpecialties();
      const fetchedSpecialties = response.data || [];
      const stats = calculateStats(fetchedSpecialties);

      dispatch({
        type: SPECIALTY_ACTIONS.SET_SPECIALTIES,
        payload: {
          specialties: fetchedSpecialties,
          stats,
          total: response.total || fetchedSpecialties.length,
        },
      });
    } catch (err: unknown) {
      console.error("Error fetching specialties:", err);
      const errorMessage = extractErrorMessage(err as unknown);
      dispatch({ type: SPECIALTY_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error("Failed to load specialties");
    }
  }, [calculateStats]);

  // Auto-fetch specialties when provider mounts
  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  // Filter and sort specialties based on current filters (client-side)
  const getFilteredSpecialties = useCallback(() => {
    if (!state.specialties.length) return [];

    const filtered = state.specialties.filter((specialty) => {
      // Status filter
      if (
        state.filters.status !== "all" &&
        ((state.filters.status === "active" && !specialty.isActive) ||
          (state.filters.status === "inactive" && specialty.isActive))
      ) {
        return false;
      }

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
  }, [state.specialties, state.filters]);

  // Get paginated specialties from filtered results
  const getPaginatedSpecialties = useCallback(() => {
    const filteredSpecialties = getFilteredSpecialties();
    const startIndex = (state.pagination.page - 1) * state.pagination.limit;
    const endIndex = startIndex + state.pagination.limit;
    return filteredSpecialties.slice(startIndex, endIndex);
  }, [getFilteredSpecialties, state.pagination.page, state.pagination.limit]);

  // Calculate pagination info from filtered results
  const getPaginationInfo = useCallback(() => {
    const filteredSpecialties = getFilteredSpecialties();
    const total = filteredSpecialties.length;
    const totalPages = Math.ceil(total / state.pagination.limit);

    return {
      total,
      totalPages,
      currentPage: state.pagination.page,
    };
  }, [getFilteredSpecialties, state.pagination.limit, state.pagination.page]);

  // Get specialty by ID
  const getSpecialty = useCallback(
    async (id: number): Promise<Specialty | null> => {
      try {
        dispatch({ type: SPECIALTY_ACTIONS.SET_LOADING, payload: true });
        const response = await specialtiesAPI.getSpecialtyById(id);
        return response.data;
      } catch (err: unknown) {
        const errorMessage = extractErrorMessage(err as unknown);
        dispatch({ type: SPECIALTY_ACTIONS.SET_ERROR, payload: errorMessage });
        toast.error("Failed to fetch specialty");
        return null;
      } finally {
        dispatch({ type: SPECIALTY_ACTIONS.SET_LOADING, payload: false });
      }
    },
    []
  );

  // Create specialty
  const createSpecialty = useCallback(async (data: CreateSpecialtyRequest) => {
    try {
      dispatch({ type: SPECIALTY_ACTIONS.SET_LOADING, payload: true });

      const response = await specialtiesAPI.createSpecialty(data);
      const newSpecialty = response.data;

      dispatch({
        type: SPECIALTY_ACTIONS.ADD_SPECIALTY,
        payload: newSpecialty,
      });

      return { success: true, message: "Specialty created successfully" };
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err as unknown);
      dispatch({ type: SPECIALTY_ACTIONS.SET_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: SPECIALTY_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Update specialty
  const updateSpecialty = useCallback(
    async (id: number, data: UpdateSpecialtyRequest) => {
      try {
        dispatch({ type: SPECIALTY_ACTIONS.SET_LOADING, payload: true });

        const response = await specialtiesAPI.updateSpecialty(id, data);
        const updatedSpecialty = response.data;

        dispatch({
          type: SPECIALTY_ACTIONS.UPDATE_SPECIALTY,
          payload: updatedSpecialty,
        });

        return { success: true, message: "Specialty updated successfully" };
      } catch (err: unknown) {
        const errorMessage = extractErrorMessage(err as unknown);
        dispatch({ type: SPECIALTY_ACTIONS.SET_ERROR, payload: errorMessage });
        throw new Error(errorMessage);
      } finally {
        dispatch({ type: SPECIALTY_ACTIONS.SET_LOADING, payload: false });
      }
    },
    []
  );

  // Delete specialty
  const deleteSpecialty = useCallback(async (id: number) => {
    try {
      dispatch({ type: SPECIALTY_ACTIONS.SET_LOADING, payload: true });

      await specialtiesAPI.deleteSpecialty(id);
      dispatch({ type: SPECIALTY_ACTIONS.DELETE_SPECIALTY, payload: id });

      return { success: true, message: "Specialty deleted successfully" };
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err);
      dispatch({ type: SPECIALTY_ACTIONS.SET_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: SPECIALTY_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Actions
  const actions = {
    // Specialty management
    addSpecialty: (specialty: Specialty) => {
      dispatch({ type: SPECIALTY_ACTIONS.ADD_SPECIALTY, payload: specialty });
    },

    updateSpecialty: (specialty: Specialty) => {
      dispatch({
        type: SPECIALTY_ACTIONS.UPDATE_SPECIALTY,
        payload: specialty,
      });
    },

    deleteSpecialty: (specialtyId: number) => {
      dispatch({
        type: SPECIALTY_ACTIONS.DELETE_SPECIALTY,
        payload: specialtyId,
      });
    },

    // Filter management
    setFilter: (filterType: string, value: string) => {
      dispatch({
        type: SPECIALTY_ACTIONS.SET_FILTERS,
        payload: { [filterType]: value },
      });
      // Reset to page 1 when filters change
      dispatch({
        type: SPECIALTY_ACTIONS.SET_PAGINATION,
        payload: { page: 1 },
      });
    },

    setSearch: (searchTerm: string) => {
      dispatch({
        type: SPECIALTY_ACTIONS.SET_FILTERS,
        payload: { search: searchTerm },
      });
      // Reset to page 1 when search changes
      dispatch({
        type: SPECIALTY_ACTIONS.SET_PAGINATION,
        payload: { page: 1 },
      });
    },

    // Pagination
    setPage: (page: number) => {
      dispatch({ type: SPECIALTY_ACTIONS.SET_PAGINATION, payload: { page } });
    },

    // Refresh specialties
    refreshSpecialties: () => {
      dispatch({ type: SPECIALTY_ACTIONS.REFRESH_SPECIALTIES });
    },
  };

  // Context value
  const value = {
    ...state,
    filteredSpecialties: getPaginatedSpecialties(),
    stats: calculateStats(getFilteredSpecialties()),
    pagination: {
      ...state.pagination,
      ...getPaginationInfo(),
    },
    actions,
    fetchSpecialties,
    getSpecialty,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
  };

  return (
    <SpecialtyContext.Provider value={value}>
      {children}
    </SpecialtyContext.Provider>
  );
};

export const useSpecialty = () => {
  const context = useContext(SpecialtyContext);
  if (!context) {
    throw new Error("useSpecialty must be used within a SpecialtyProvider");
  }
  return context;
};
