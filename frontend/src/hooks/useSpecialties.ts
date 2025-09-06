import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  specialtiesAPI,
  Specialty,
  SpecialtyStats,
  CreateSpecialtyRequest,
  UpdateSpecialtyRequest,
} from "@/api/specialties";

interface Filters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseSpecialtiesReturn {
  // State
  specialties: Specialty[];
  loading: boolean;
  error: string | null;
  stats: SpecialtyStats | null;
  filters: Filters;
  pagination: Pagination;
  selectedSpecialty: Specialty | null;

  // Actions
  fetchSpecialties: () => Promise<void>;
  fetchSpecialtyById: (id: number) => Promise<void>;
  createSpecialty: (data: CreateSpecialtyRequest) => Promise<boolean>;
  updateSpecialty: (
    id: number,
    data: UpdateSpecialtyRequest
  ) => Promise<boolean>;
  deleteSpecialty: (id: number) => Promise<boolean>;
  setFilter: (filterType: keyof Filters, value: string) => void;
  setSearch: (searchTerm: string) => void;
  clearAllFilters: () => void;
  setSelectedSpecialty: (specialty: Specialty | null) => void;
  refreshSpecialties: () => void;
}

export const useSpecialties = (): UseSpecialtiesReturn => {
  // State
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<SpecialtyStats | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(
    null
  );

  // Filters and pagination
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    sortBy: "name",
    sortOrder: "ASC",
  });

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch specialties
  const fetchSpecialties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: unknown = {
        ...filters,
      };

      // Remove empty values
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === "all") {
          delete params[key];
        }
      });

      const response = await specialtiesAPI.getAllSpecialties(params);

      setSpecialties(response.data);
      setStats(response.stats);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        totalPages: Math.ceil(response.total / prev.limit),
      }));
    } catch (err: unknown) {
      setError(err.response?.data?.message || "Failed to fetch specialties");
      toast.error("Failed to fetch specialties");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch single specialty
  const fetchSpecialtyById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await specialtiesAPI.getSpecialtyById(id);
      setSelectedSpecialty(response.data);
    } catch (err: unknown) {
      setError(err.response?.data?.message || "Failed to fetch specialty");
      toast.error("Failed to fetch specialty");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create specialty
  const createSpecialty = useCallback(
    async (data: CreateSpecialtyRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await specialtiesAPI.createSpecialty(data);

        toast.success("Specialty created successfully");
        await fetchSpecialties(); // Refresh the list
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err.response?.data?.message || "Failed to create specialty";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchSpecialties]
  );

  // Update specialty
  const updateSpecialty = useCallback(
    async (id: number, data: UpdateSpecialtyRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await specialtiesAPI.updateSpecialty(id, data);

        toast.success("Specialty updated successfully");
        await fetchSpecialties(); // Refresh the list
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err.response?.data?.message || "Failed to update specialty";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchSpecialties]
  );

  // Delete specialty
  const deleteSpecialty = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await specialtiesAPI.deleteSpecialty(id);

        toast.success("Specialty deleted successfully");
        await fetchSpecialties(); // Refresh the list
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete specialty";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchSpecialties]
  );

  // Filter actions
  const setFilter = useCallback((filterType: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }, []);

  const setSearch = useCallback((searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      sortBy: "name",
      sortOrder: "ASC",
    });
  }, []);

  const refreshSpecialties = useCallback(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  // Load specialties on mount and when filters change
  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  return {
    // State
    specialties,
    loading,
    error,
    stats,
    filters,
    pagination,
    selectedSpecialty,

    // Actions
    fetchSpecialties,
    fetchSpecialtyById,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    setFilter,
    setSearch,
    clearAllFilters,
    setSelectedSpecialty,
    refreshSpecialties,
  };
};
