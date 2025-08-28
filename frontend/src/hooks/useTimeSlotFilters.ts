import { useState, useMemo } from 'react';

export interface TimeSlot {
  id: number;
  doctorId: number;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  consultationType: "online" | "physical" | "both";
  consultationFee: number;
  isPast?: boolean;
  isToday?: boolean;
  isTomorrow?: boolean;
}

export interface TimeSlotFilters {
  date: string;
  consultationType: string;
  minFee: string;
  maxFee: string;
  showOnlyAvailable: boolean;
  showOnlyToday: boolean;
  showOnlyTomorrow: boolean;
}

export interface FilterOptions {
  availableDates: string[];
  consultationTypes: string[];
  feeRange: {
    min: number;
    max: number;
  };
}

export const useTimeSlotFilters = (timeSlots: TimeSlot[]) => {
  const [filters, setFilters] = useState<TimeSlotFilters>({
    date: "",
    consultationType: "",
    minFee: "",
    maxFee: "",
    showOnlyAvailable: true,
    showOnlyToday: false,
    showOnlyTomorrow: false,
  });

  // Get available filter options from time slots
  const filterOptions = useMemo((): FilterOptions => {
    if (timeSlots.length === 0) {
      return {
        availableDates: [],
        consultationTypes: [],
        feeRange: { min: 0, max: 0 }
      };
    }

    const dates = [...new Set(timeSlots.map(slot => slot.date))].sort();
    const types = [...new Set(timeSlots.map(slot => slot.consultationType))];
    const fees = timeSlots.map(slot => slot.consultationFee);

    return {
      availableDates: dates,
      consultationTypes: types,
      feeRange: {
        min: Math.min(...fees),
        max: Math.max(...fees)
      }
    };
  }, [timeSlots]);

  // Apply filters to time slots
  const filteredTimeSlots = useMemo(() => {
    let filtered = [...timeSlots];

    // Filter by availability
    if (filters.showOnlyAvailable) {
      filtered = filtered.filter(slot => !slot.isBooked);
    }

    // Filter by today only
    if (filters.showOnlyToday) {
      filtered = filtered.filter(slot => slot.isToday);
    }

    // Filter by tomorrow only
    if (filters.showOnlyTomorrow) {
      filtered = filtered.filter(slot => slot.isTomorrow);
    }

    return filtered;
  }, [timeSlots, filters]);

  // Get next bookable slot
  const nextBookableSlot = useMemo(() => {
    const availableSlots = filteredTimeSlots.filter(slot => !slot.isBooked);
    if (availableSlots.length === 0) return null;
    
    // Sort by date and time, return the first available
    return availableSlots.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.startTime}`);
      const dateB = new Date(`${b.date} ${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    })[0];
  }, [filteredTimeSlots]);

  // Group time slots by date
  const groupedTimeSlots = useMemo(() => {
    return filteredTimeSlots.reduce((acc, slot) => {
      const date = slot.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    }, {} as Record<string, TimeSlot[]>);
  }, [filteredTimeSlots]);

  // Update filter
  const updateFilter = (key: keyof TimeSlotFilters, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      date: "",
      consultationType: "",
      minFee: "",
      maxFee: "",
      showOnlyAvailable: true,
      showOnlyToday: false,
      showOnlyTomorrow: false,
    });
  };

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.date) count++;
    if (filters.consultationType) count++;
    if (filters.minFee) count++;
    if (filters.maxFee) count++;
    if (filters.showOnlyToday) count++;
    if (filters.showOnlyTomorrow) count++;
    return count;
  }, [filters]);

  // Check if any filters are active
  const hasActiveFilters = activeFiltersCount > 0;

  return {
    filters,
    filterOptions,
    filteredTimeSlots,
    groupedTimeSlots,
    nextBookableSlot,
    updateFilter,
    clearFilters,
    activeFiltersCount,
    hasActiveFilters,
  };
};
