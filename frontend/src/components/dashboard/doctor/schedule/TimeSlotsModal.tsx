"use client";

import React, { useState, useEffect } from "react";
import { ModalWrapper, Button } from "@/components/ui";
import { Availability } from "@/types/availability";
import { availabilityApi } from "@/api/availability";
import { timeUtils } from "@/utils/availabilityHelpers";
import {
  Clock,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  isBooked: boolean;
}

interface TimeSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availability: Availability | null;
}

const DAY_NAMES = [
  "Sunday",
  "Monday", 
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const TimeSlotsModal: React.FC<TimeSlotsModalProps> = ({
  isOpen,
  onClose,
  availability,
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && availability?.id) {
      loadTimeSlots();
    }
  }, [isOpen, availability?.id]);

  const loadTimeSlots = async () => {
    if (!availability?.id) return;

    try {
      setLoading(true);
      const response = await availabilityApi.getAvailabilityById(availability.id);
      
      // Fix: Handle the correct response structure
      // Backend returns: { status: "success", data: { timeSlots: [...] } }
      const timeSlots = response.data?.timeSlots || [];
      setTimeSlots(timeSlots);
      
      // Log for debugging
      console.log('Loaded time slots:', timeSlots);
      
      if (timeSlots.length === 0) {
        console.log('No time slots found for availability:', availability.id);
      }
    } catch (error) {
      console.error("Failed to load time slots:", error);
      toast.error("Failed to load time slots");
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateSlots = async () => {
    if (!availability?.id) return;

    try {
      setLoading(true);
      await availabilityApi.regenerateTimeSlots(availability.id);
      toast.success("Time slots regenerated successfully");
      await loadTimeSlots(); // Reload the slots
    } catch (error) {
      console.error("Failed to regenerate time slots:", error);
      toast.error("Failed to regenerate time slots");
    } finally {
      setLoading(false);
    }
  };

  const handleTestSlots = async () => {
    if (!availability?.id) return;

    try {
      setLoading(true);
      const result = await availabilityApi.testTimeSlotGeneration(availability.id);
      console.log('Test result:', result);
      toast.success(`Test completed: ${result.data.slotsGenerated} slots generated`);
      await loadTimeSlots(); // Reload the slots
    } catch (error) {
      console.error("Failed to test time slots:", error);
      toast.error("Failed to test time slots");
    } finally {
      setLoading(false);
    }
  };

  const groupSlotsByDate = (slots: TimeSlot[]) => {
    const grouped = slots.reduce((acc, slot) => {
      const date = slot.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    }, {} as Record<string, TimeSlot[]>);

    // Sort dates
    return Object.keys(grouped)
      .sort()
      .reduce((acc, date) => {
        acc[date] = grouped[date].sort((a, b) => 
          a.startTime.localeCompare(b.startTime)
        );
        return acc;
      }, {} as Record<string, TimeSlot[]>);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayName = DAY_NAMES[date.getDay()];
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${dayName}, ${formattedDate}`;
  };

  const getSlotStats = (slots: TimeSlot[]) => {
    const total = slots.length;
    const booked = slots.filter(slot => slot.isBooked).length;
    const available = total - booked;
    return { total, booked, available };
  };

  if (!availability || !isOpen) return null;

  const groupedSlots = groupSlotsByDate(timeSlots);
  const totalStats = getSlotStats(timeSlots);

  return (
    <ModalWrapper>
      <div className="w-full sm:w-lg lg:w-2xl xl:w-3xl 2xl:w-4xl max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Time Slots Overview
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
        {/* Session Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
              {DAY_NAMES[availability.dayOfWeek]} Session
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              {availability.consultationDuration}min sessions
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>
                {timeUtils.formatTime(availability.startTime)} - {timeUtils.formatTime(availability.endTime)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Type: {availability.consultationType}</span>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalStats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Slots
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalStats.available}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Available
            </div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {totalStats.booked}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              Booked
            </div>
          </div>
        </div>

        {/* Time Slots by Date */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                Loading time slots...
              </span>
            </div>
          ) : Object.keys(groupedSlots).length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No time slots generated yet</p>
              <p className="text-sm mt-1">
                Time slots are automatically generated for upcoming dates
              </p>
              <div className="flex space-x-2 mt-4">
                <Button
                  onClickHandler={handleRegenerateSlots}
                  additionalClasses="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate Slots
                </Button>
                <Button
                  onClickHandler={handleTestSlots}
                  additionalClasses="px-4 py-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  Test Generation
                </Button>
              </div>
            </div>
          ) : (
            Object.entries(groupedSlots).map(([date, slots]) => {
              const dateStats = getSlotStats(slots);
              return (
                <div key={date} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {formatDate(date)}
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {dateStats.available} / {dateStats.total} available
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-2 rounded text-center text-sm border ${
                          slot.isBooked
                            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                            : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          {slot.isBooked ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          <span>
                            {timeUtils.formatTime(slot.startTime)}
                          </span>
                        </div>
                        <div className="text-xs mt-1">
                          {slot.isBooked ? "Booked" : "Available"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClickHandler={onClose}
            additionalClasses="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white"
          >
            Close
          </Button>
        </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
