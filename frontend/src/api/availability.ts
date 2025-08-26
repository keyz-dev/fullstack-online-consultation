import api from ".";
import {
  Availability,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  DoctorAvailabilityWithSlots,
  AvailabilityStats,
} from "@/types/availability";

export const availabilityApi = {
  // Create multiple availabilities
  createAvailabilities: async (data: CreateAvailabilityRequest) => {
    const response = await api.post<{
      status: string;
      message: string;
      data: Availability[];
    }>("/doctorAvailability", data);
    return response.data;
  },

  // Get all availabilities for the authenticated doctor
  getAllAvailabilities: async (includeInvalidated = false) => {
    const response = await api.get<{
      status: string;
      data: DoctorAvailabilityWithSlots[];
    }>("/doctorAvailability", {
      params: { includeInvalidated },
    });
    return response.data;
  },

  // Get a specific availability by ID
  getAvailabilityById: async (id: number) => {
    const response = await api.get<{
      status: string;
      data: DoctorAvailabilityWithSlots;
    }>(`/doctorAvailability/${id}`);
    return response.data;
  },

  // Update an availability
  updateAvailability: async (id: number, data: UpdateAvailabilityRequest) => {
    const response = await api.put<{
      status: string;
      message: string;
      data: Availability;
    }>(`/doctorAvailability/${id}`, data);
    return response.data;
  },

  // Invalidate an availability (soft delete)
  invalidateAvailability: async (id: number, reason: string) => {
    const response = await api.patch<{
      status: string;
      message: string;
      data: Availability;
    }>(`/doctorAvailability/${id}/invalidate`, {
      invalidationReason: reason,
    });
    return response.data;
  },

  // Reactivate an invalidated availability
  reactivateAvailability: async (id: number) => {
    const response = await api.patch<{
      status: string;
      message: string;
      data: Availability;
    }>(`/doctorAvailability/${id}/reactivate`);
    return response.data;
  },

  // Get available doctors (for patients)
  getAvailableDoctors: async (params: {
    date: string;
    symptoms?: string[];
    consultationType?: "online" | "physical" | "both";
  }) => {
    const response = await api.get<{
      status: string;
      data: DoctorAvailabilityWithSlots[];
    }>("/doctorAvailability/available-doctors", {
      params,
    });
    return response.data;
  },

  // Get availability statistics
  getAvailabilityStats: async (): Promise<AvailabilityStats> => {
    const availabilities = await availabilityApi.getAllAvailabilities();

    const activeAvailabilities = availabilities.data.filter(
      (av) => !av.isInvalidated
    );
    const totalTimeSlots = activeAvailabilities.reduce((total, av) => {
      return total + (av.timeSlots?.length || 0);
    }, 0);

    const bookedTimeSlots = activeAvailabilities.reduce((total, av) => {
      return (
        total + (av.timeSlots?.filter((slot) => slot.isBooked).length || 0)
      );
    }, 0);

    const weeklyHours = activeAvailabilities.reduce((total, av) => {
      const start = new Date(`2000-01-01 ${av.startTime}`);
      const end = new Date(`2000-01-01 ${av.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);

    const monthlyEarnings = activeAvailabilities.reduce((total, av) => {
      const slotsPerWeek = av.timeSlots?.length || 0;
      const monthlySlots = slotsPerWeek * 4; // Approximate
      return total + monthlySlots * av.consultationFee;
    }, 0);

    return {
      totalAvailabilities: availabilities.data.length,
      activeAvailabilities: activeAvailabilities.length,
      totalTimeSlots,
      bookedTimeSlots,
      weeklyHours: Math.round(weeklyHours * 100) / 100,
      monthlyEarnings: Math.round(monthlyEarnings),
    };
  },
};
