import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import prescriptionsApi, { 
  Prescription, 
  CreatePrescriptionData, 
  PrescriptionsResponse,
  PrescriptionStatsResponse 
} from '../api/prescriptions';

interface UsePrescriptionsReturn {
  prescriptions: Prescription[];
  prescriptionStats: {
    total: number;
    active: number;
    completed: number;
  } | null;
  loading: boolean;
  error: string | null;
  createPrescription: (data: CreatePrescriptionData) => Promise<{ success: boolean; message: string; prescription?: Prescription }>;
  getPrescriptionsByConsultation: (consultationId: number) => Promise<Prescription[]>;
  getPrescriptionById: (prescriptionId: number) => Promise<Prescription | null>;
  updatePrescription: (prescriptionId: number, data: Partial<CreatePrescriptionData>) => Promise<{ success: boolean; message: string; prescription?: Prescription }>;
  deletePrescription: (prescriptionId: number) => Promise<{ success: boolean; message: string }>;
  generatePrescriptionPDF: (prescriptionId: number) => Promise<{ success: boolean; message: string }>;
  getPrescriptionStats: (doctorId?: number, patientId?: number) => Promise<void>;
  clearError: () => void;
}

export const usePrescriptions = (): UsePrescriptionsReturn => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [prescriptionStats, setPrescriptionStats] = useState<{
    total: number;
    active: number;
    completed: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createPrescription = useCallback(async (data: CreatePrescriptionData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await prescriptionsApi.createPrescription(data);
      
      toast.success(response.message);
      
      // Add the new prescription to the list if it's for the current consultation
      setPrescriptions(prev => [response.data.prescription, ...prev]);
      
      return { 
        success: true, 
        message: response.message,
        prescription: response.data.prescription
      };
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to create prescription";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getPrescriptionsByConsultation = useCallback(async (consultationId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await prescriptionsApi.getPrescriptionsByConsultation(consultationId);
      setPrescriptions(response.data.prescriptions);
      return response.data.prescriptions;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch prescriptions";
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getPrescriptionById = useCallback(async (prescriptionId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await prescriptionsApi.getPrescriptionById(prescriptionId);
      return response.data.prescription;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch prescription";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePrescription = useCallback(async (prescriptionId: number, data: Partial<CreatePrescriptionData>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await prescriptionsApi.updatePrescription(prescriptionId, data);
      
      toast.success(response.message);
      
      // Update the prescription in the list
      setPrescriptions(prev => 
        prev.map(p => p.id === prescriptionId ? response.data.prescription : p)
      );
      
      return { 
        success: true, 
        message: response.message,
        prescription: response.data.prescription
      };
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update prescription";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePrescription = useCallback(async (prescriptionId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await prescriptionsApi.deletePrescription(prescriptionId);
      
      toast.success(response.message);
      
      // Remove the prescription from the list
      setPrescriptions(prev => prev.filter(p => p.id !== prescriptionId));
      
      return { success: true, message: response.message };
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete prescription";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const generatePrescriptionPDF = useCallback(async (prescriptionId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await prescriptionsApi.generatePrescriptionPDF(prescriptionId);
      
      toast.success(response.message);
      
      return { success: true, message: response.message };
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to generate prescription PDF";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getPrescriptionStats = useCallback(async (doctorId?: number, patientId?: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await prescriptionsApi.getPrescriptionStats(doctorId, patientId);
      setPrescriptionStats(response.data.stats);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch prescription statistics";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    prescriptions,
    prescriptionStats,
    loading,
    error,
    createPrescription,
    getPrescriptionsByConsultation,
    getPrescriptionById,
    updatePrescription,
    deletePrescription,
    generatePrescriptionPDF,
    getPrescriptionStats,
    clearError,
  };
};
