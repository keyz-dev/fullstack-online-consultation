import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { pharmacyMedicationsApi, Medication, MedicationStats, MedicationFilters } from "@/api/pharmacyMedications";

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Helper function to convert medication data to FormData
const createMedicationFormData = (medicationData: Partial<Medication>, imageFile?: File): FormData => {
  const formData = new FormData();
  
  // Add all medication fields
  Object.entries(medicationData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  // Add image file if provided
  if (imageFile) {
    formData.append('medicationImage', imageFile);
  }
  
  return formData;
};

export const usePharmacyMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [medicationStats, setMedicationStats] = useState<MedicationStats>({
    total: 0,
    available: 0,
    outOfStock: 0,
    expiringSoon: 0,
    requiresPrescription: 0,
    overTheCounter: 0
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchMedications = useCallback(async (page: number = 1, filters: MedicationFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching medications with params:", { page, limit: 10, ...filters });
      const response = await pharmacyMedicationsApi.getMedications({
        page,
        limit: 10,
        ...filters
      });
      console.log("Medications response:", response);
      setMedications(response.data.medications);
      setPagination(response.data.pagination);
    } catch (err: unknown) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch medications";
      console.error("Error fetching medications:", err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMedicationStats = useCallback(async () => {
    try {
      const response = await pharmacyMedicationsApi.getMedicationStats();
      setMedicationStats(response.data);
    } catch (err: unknown) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch medication stats";
      console.error(errorMessage);
    }
  }, []);

  const createMedication = useCallback(async (medicationData: Partial<Medication>, imageFile?: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = createMedicationFormData(medicationData, imageFile);
      console.log("Creating medication with formData:", formData);
      const response = await pharmacyMedicationsApi.createMedication(formData);
      console.log("Create medication response:", response);
      
      toast.success(response.message);
      // Refresh the medications list
      console.log("Refreshing medications list...");
      await fetchMedications(1); // Always refresh to page 1 after creation
      await fetchMedicationStats();
      
      return { success: true, message: response.message };
    } catch (err: unknown) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to create medication";
      console.error("Error creating medication:", err);
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchMedications, fetchMedicationStats]);

  const updateMedication = useCallback(async (id: number, medicationData: Partial<Medication>, imageFile?: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = createMedicationFormData(medicationData, imageFile);
      const response = await pharmacyMedicationsApi.updateMedication(id, formData);
      
      toast.success(response.message);
      // Refresh the medications list
      await fetchMedications(pagination.currentPage);
      await fetchMedicationStats();
      
      return { success: true, message: response.message };
    } catch (err: unknown) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update medication";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchMedications, fetchMedicationStats, pagination.currentPage]);

  const deleteMedication = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await pharmacyMedicationsApi.deleteMedication(id);
      // Refresh the medications list
      await fetchMedications(pagination.currentPage);
      await fetchMedicationStats();
      
      return { success: true, message: response.message };
    } catch (err: unknown) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete medication";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchMedications, fetchMedicationStats, pagination.currentPage]);

  const bulkInsertMedications = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const response = await pharmacyMedicationsApi.bulkImportMedications(file);
      
      toast.success(response.message);
      // Refresh the medications list
      await fetchMedications(pagination.currentPage);
      await fetchMedicationStats();
      
      return { 
        success: true, 
        message: response.message,
        imported: response.data.imported,
        errors: response.data.errors
      };
    } catch (err: unknown) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to import medications";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchMedications, fetchMedicationStats, pagination.currentPage]);

  const bulkCreateMedications = useCallback(async (medications: unknown[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await pharmacyMedicationsApi.bulkCreateMedications(medications);
      
      toast.success(response.message);
      // Refresh the medications list
      await fetchMedications(pagination.currentPage);
      await fetchMedicationStats();
      
      return { 
        success: true, 
        message: response.message,
        imported: response.data.imported,
        errors: response.data.errors
      };
    } catch (err: unknown) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to create medications";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchMedications, fetchMedicationStats, pagination.currentPage]);

  const downloadTemplate = useCallback(async () => {
    try {
      const blob = await pharmacyMedicationsApi.downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'medication_import_template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to download template";
      toast.error(errorMessage);
    }
  }, []);

  return {
    medications,
    medicationStats,
    pagination,
    loading,
    error,
    fetchMedications,
    fetchMedicationStats,
    createMedication,
    updateMedication,
    deleteMedication,
    bulkInsertMedications,
    bulkCreateMedications,
    downloadTemplate
  };
};
