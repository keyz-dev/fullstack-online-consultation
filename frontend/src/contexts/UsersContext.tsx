import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useContext,
} from "react";
import {
  usersAPI,
  User,
  UserStats,
  UpdateUserStatusRequest,
} from "@/api/users";
import { toast } from "react-toastify";

// Initial state
const initialState = {
  users: [] as User[],
  loading: true,
  error: null as string | null,
  filters: {
    role: "all",
    status: "all",
    verified: "all",
    search: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  stats: {
    total: 0,
    active: 0,
    verified: 0,
    recentRegistrations: 0,
    byRole: {},
  } as UserStats,
};

// Action types
const USERS_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_USERS: "SET_USERS",
  SET_STATS: "SET_STATS",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  UPDATE_USER: "UPDATE_USER",
  REFRESH_USERS: "REFRESH_USERS",
} as const;

type UsersAction = {
  type: keyof typeof USERS_ACTIONS;
  payload?: unknown;
};

// Reducer
const usersReducer = (state: typeof initialState, action: UsersAction) => {
  switch (action.type) {
    case USERS_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload as boolean };

    case USERS_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload as string, loading: false };

    case USERS_ACTIONS.SET_USERS:
      const payload = action.payload as {
        users?: User[];
        total?: number;
      };
      return {
        ...state,
        users: payload.users || [],
        pagination: {
          ...state.pagination,
          total: payload.total || payload.users?.length || 0,
        },
        loading: false,
        error: null,
      };

    case USERS_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload as UserStats,
      };

    case USERS_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...(action.payload as Record<string, string>),
        },
        pagination: { ...state.pagination, page: 1 },
      };

    case USERS_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...(action.payload as Record<string, number>),
        },
      };

    case USERS_ACTIONS.UPDATE_USER:
      const updatedUser = action.payload as User;
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        ),
      };

    case USERS_ACTIONS.REFRESH_USERS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    default:
      return state;
  }
};

// Context
const UsersContext = createContext<{
  users: User[];
  loading: boolean;
  error: string | null;
  stats: UserStats;
  filters: typeof initialState.filters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    currentPage: number;
  };
  actions: {
    setFilter: (filterType: string, value: string) => void;
    setSearch: (searchTerm: string) => void;
    setPage: (page: number) => void;
    refreshUsers: () => void;
    updateUserStatus: (id: number, isActive: boolean) => Promise<void>;
  };
  fetchUsers: () => Promise<void>;
  fetchUserStats: () => Promise<void>;
} | null>(null);

// Provider
export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      dispatch({ type: USERS_ACTIONS.SET_LOADING, payload: true });

      const response = await usersAPI.getAllUsers({
        page: state.pagination.page,
        limit: state.pagination.limit,
        search: state.filters.search,
        role: state.filters.role,
        status: state.filters.status,
        verified: state.filters.verified,
        sortBy: state.filters.sortBy,
        sortOrder: state.filters.sortOrder,
      });

      console.log("Users API Response:", response.data); // Debug log
      dispatch({
        type: USERS_ACTIONS.SET_USERS,
        payload: {
          users: response.data.data,
          total: response.data.pagination.total,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch users";
      dispatch({ type: USERS_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
    }
  }, [
    state.pagination.page,
    state.pagination.limit,
    state.filters.search,
    state.filters.role,
    state.filters.status,
    state.filters.verified,
    state.filters.sortBy,
    state.filters.sortOrder,
  ]);

  // Fetch user stats
  const fetchUserStats = useCallback(async () => {
    try {
      const response = await usersAPI.getUserStats();
      console.log("Stats API Response:", response.data); // Debug log
      dispatch({
        type: USERS_ACTIONS.SET_STATS,
        payload: response.data.data,
      });
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  }, []);

  // Update user status
  const updateUserStatus = useCallback(
    async (id: number, isActive: boolean) => {
      try {
        const response = await usersAPI.updateUserStatus(id, { isActive });
        dispatch({
          type: USERS_ACTIONS.UPDATE_USER,
          payload: response.data.data,
        });
        toast.success(
          `User ${isActive ? "activated" : "deactivated"} successfully`
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update user status";
        toast.error(errorMessage);
        throw error;
      }
    },
    []
  );

  // Actions
  const actions = {
    setFilter: useCallback((filterType: string, value: string) => {
      dispatch({
        type: USERS_ACTIONS.SET_FILTERS,
        payload: { [filterType]: value },
      });
    }, []),

    setSearch: useCallback((searchTerm: string) => {
      dispatch({
        type: USERS_ACTIONS.SET_FILTERS,
        payload: { search: searchTerm },
      });
    }, []),

    setPage: useCallback((page: number) => {
      dispatch({
        type: USERS_ACTIONS.SET_PAGINATION,
        payload: { page },
      });
    }, []),

    refreshUsers: useCallback(() => {
      dispatch({ type: USERS_ACTIONS.REFRESH_USERS });
    }, []),

    updateUserStatus,
  };

  // Effects
  useEffect(() => {
    // Initial data fetch - fetch both users and stats
    const initializeData = async () => {
      try {
        // Fetch users first
        await fetchUsers();
        // Then fetch stats
        await fetchUserStats();
      } catch (error) {
        console.error("Failed to initialize data:", error);
      }
    };

    initializeData();
  }, []); // Only run once on mount

  // Refetch users when filters or pagination change
  useEffect(() => {
    // Skip the initial load and only refetch when filters/pagination actually change
    const hasInitialData = state.users.length > 0 || state.loading;
    if (hasInitialData && !state.loading) {
      fetchUsers();
    }
  }, [
    state.filters.search,
    state.filters.role,
    state.filters.status,
    state.filters.verified,
    state.filters.sortBy,
    state.filters.sortOrder,
    state.pagination.page,
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(state.pagination.total / state.pagination.limit);

  const value = {
    users: state.users,
    loading: state.loading,
    error: state.error,
    stats: state.stats,
    filters: state.filters,
    pagination: {
      ...state.pagination,
      totalPages,
      currentPage: state.pagination.page,
    },
    actions,
    fetchUsers,
    fetchUserStats,
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

// Hook
export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};
