import React, { useState, useEffect } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { Calendar, Clock, Video, User } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { toast } from "react-toastify";
import api from "@/api";

interface TimeSlot {
  id: number;
  doctorId: number;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  consultationType: "online" | "physical" | "both";
  consultationFee: number;
}

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
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Fetch time slots for the selected doctor
  useEffect(() => {
    if (!state.doctorId) {
      toast.error("Please select a doctor first");
      return;
    }

    const fetchTimeSlots = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/timeSlot/doctors/${state.doctorId}/time-slots`
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
  }, [state.doctorId]);

  // Initialize selected time slot and consultation type from booking context
  useEffect(() => {
    if (state.timeSlot && state.timeSlotId) {
      setSelectedTimeSlot(state.timeSlot);
      setSelectedDate(state.timeSlot.date);

      // Set consultation type if it's not "both"
      if (state.timeSlot.consultationType !== "both") {
        setSelectedConsultationType(state.timeSlot.consultationType);
      } else if (state.consultationType) {
        setSelectedConsultationType(state.consultationType);
      }
    }
  }, [state.timeSlot, state.timeSlotId, state.consultationType]);

  // Group time slots by date
  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  // Get available dates (next 7 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }

    return dates;
  };

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
  };

  const handleConsultationTypeSelect = (type: "online" | "physical") => {
    setSelectedConsultationType(type);

    // Update booking state with consultation type
    if (selectedTimeSlot) {
      dispatch({
        type: "UPDATE_STEP_DATA",
        payload: {
          stepIndex: 2,
          data: {
            timeSlotId: selectedTimeSlot.id,
            timeSlot: selectedTimeSlot,
            consultationType: type,
            appointmentDate: selectedTimeSlot.date,
            appointmentTime: selectedTimeSlot.startTime,
          },
        },
      });

      // Mark step as completed
      dispatch({
        type: "SET_STEP_COMPLETED",
        payload: { stepIndex: 2, completed: true },
      });
    }
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
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Select Time Slot
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Choose an available time slot for your consultation.
      </p>

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
                No available time slots found for the selected doctor.
              </p>
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
                        className={`p-3 text-center rounded-lg border transition-all ${
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
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Consultation Type Selection */}
      {selectedTimeSlot && selectedTimeSlot.consultationType === "both" && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
            Choose Consultation Type
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleConsultationTypeSelect("online")}
              className={`p-4 border rounded-lg text-center transition-all ${
                selectedConsultationType === "online"
                  ? "border-primary bg-primary/5 dark:bg-primary/10 text-primary"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
              }`}
            >
              <Video className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Online</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Video consultation
              </div>
            </button>

            <button
              onClick={() => handleConsultationTypeSelect("physical")}
              className={`p-4 border rounded-lg text-center transition-all ${
                selectedConsultationType === "physical"
                  ? "border-primary bg-primary/5 dark:bg-primary/10 text-primary"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Physical</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                In-person visit
              </div>
            </button>
          </div>
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
