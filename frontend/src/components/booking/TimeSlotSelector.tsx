import React, { useState, useEffect } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { Calendar, Clock, Video, User, Filter, DollarSign } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { toast } from "react-toastify";
import api from "@/api";
import { useTimeSlotFilters, TimeSlot } from "@/hooks/useTimeSlotFilters";
import TimeSlotFilters from "./TimeSlotFilters";
import NextBookableSlot from "./NextBookableSlot";

const TimeSlotSelector: React.FC = () => {
  const { state, dispatch } = useBooking();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [selectedConsultationType, setSelectedConsultationType] = useState<
    "online" | "physical" | null
  >(null);
  const [showFilters, setShowFilters] = useState(false);

  // Use the custom hook for filtering
  const {
    filters,
    filterOptions,
    groupedTimeSlots,
    nextBookableSlot,
    updateFilter,
    clearFilters,
    activeFiltersCount,
  } = useTimeSlotFilters(timeSlots);

  // Fetch time slots for the selected doctor
  useEffect(() => {
    if (!state.doctorId) {
      toast.error("Please select a doctor first");
      return;
    }

    const fetchTimeSlots = async () => {
      setLoading(true);
      try {
        // Build query parameters for server-side filtering
        const queryParams = new URLSearchParams();
        if (filters.date) queryParams.append("date", filters.date);
        if (filters.consultationType)
          queryParams.append("consultationType", filters.consultationType);
        if (filters.minFee) queryParams.append("minFee", filters.minFee);
        if (filters.maxFee) queryParams.append("maxFee", filters.maxFee);

        const response = await api.get(
          `/timeSlot/doctors/${
            state.doctorId
          }/time-slots?${queryParams.toString()}`
        );
        setTimeSlots(response.data.timeSlots || []);
      } catch (error: any) {
        console.error("Error fetching time slots:", error);
        toast.error(
          error.response?.data?.message || "Failed to load available time slots"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [
    state.doctorId,
    filters.date,
    filters.consultationType,
    filters.minFee,
    filters.maxFee,
  ]);

  // Initialize selected time slot and consultation type from booking context
  useEffect(() => {
    if (state.timeSlot && state.timeSlotId) {
      setSelectedTimeSlot(state.timeSlot);

      // Set consultation type if it's not "both"
      if (state.timeSlot.consultationType !== "both") {
        setSelectedConsultationType(state.timeSlot.consultationType);
      } else if (state.consultationType) {
        setSelectedConsultationType(state.consultationType);
      }
    }
  }, [state.timeSlot, state.timeSlotId, state.consultationType]);

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);

    // Auto-select consultation type if only one option
    if (timeSlot.consultationType === "online") {
      setSelectedConsultationType("online");
    } else if (timeSlot.consultationType === "physical") {
      setSelectedConsultationType("physical");
    } else {
      setSelectedConsultationType(null); // Let user choose for "both"
    }

    // Update booking state
    dispatch({
      type: "UPDATE_STEP_DATA",
      payload: {
        stepIndex: 2,
        data: {
          timeSlotId: timeSlot.id,
          timeSlot: timeSlot,
          consultationType:
            timeSlot.consultationType === "both"
              ? null
              : timeSlot.consultationType,
          appointmentDate: timeSlot.date,
          appointmentTime: timeSlot.startTime,
        },
      },
    });

    // Mark step as completed if consultation type is auto-selected
    if (timeSlot.consultationType !== "both") {
      dispatch({
        type: "SET_STEP_COMPLETED",
        payload: { stepIndex: 2, completed: true },
      });
    }

    // move to the next step
    dispatch({
      type: "SET_CURRENT_STEP",
      payload: 3,
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  if (!state.doctorId) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Please select a doctor first to view available time slots.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Select Time Slot
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose an available time slot for your consultation.
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Next Bookable Slot Highlight */}
      {nextBookableSlot && (
        <NextBookableSlot
          slot={nextBookableSlot}
          onSelect={handleTimeSlotSelect}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}

      {/* Filters Panel */}
      {showFilters && (
        <TimeSlotFilters
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          activeFiltersCount={activeFiltersCount}
          formatDate={formatDate}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      )}

      {/* Time Slots */}
      {!loading && (
        <div className="space-y-6">
          {Object.keys(groupedTimeSlots).length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No available time slots found for the selected criteria.
              </p>
              <button
                onClick={clearFilters}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear filters to see all slots
              </button>
            </div>
          ) : (
            Object.entries(groupedTimeSlots).map(([date, slots]) => (
              <div
                key={date}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {formatDate(date)}
                  </h3>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {slots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleTimeSlotSelect(slot)}
                        disabled={slot.isBooked}
                        className={`p-3 text-center rounded-lg border transition-all relative ${
                          selectedTimeSlot?.id === slot.id
                            ? "border-primary bg-primary/5 dark:bg-primary/10 text-primary"
                            : slot.isBooked
                            ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                            : "border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {formatTime(slot.startTime)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {slot.isBooked ? "Booked" : "Available"}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {slot.consultationFee} XAF
                        </div>
                        {/* Consultation type indicator */}
                        <div className="absolute top-1 right-1">
                          {slot.consultationType === "online" && (
                            <Video className="w-3 h-3 text-blue-500" />
                          )}
                          {slot.consultationType === "physical" && (
                            <User className="w-3 h-3 text-green-500" />
                          )}
                          {slot.consultationType === "both" && (
                            <div className="flex gap-0.5">
                              <Video className="w-2 h-2 text-blue-500" />
                              <User className="w-2 h-2 text-green-500" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Selected Time Slot Summary */}
      {selectedTimeSlot && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
            Selected Appointment
          </h3>
          <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(selectedTimeSlot.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {formatTime(selectedTimeSlot.startTime)} -{" "}
                {formatTime(selectedTimeSlot.endTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {selectedConsultationType === "online" ? (
                <Video className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span className="capitalize">
                {selectedConsultationType || selectedTimeSlot.consultationType}{" "}
                consultation
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium">
                Fee: {selectedTimeSlot.consultationFee} XAF
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
