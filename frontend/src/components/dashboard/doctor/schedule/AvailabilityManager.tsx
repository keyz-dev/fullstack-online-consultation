"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { AvailabilityHeader } from "./AvailabilityHeader";
import { AvailabilityStats } from "./AvailabilityStats";
import { AvailabilityOverview } from "./AvailabilityOverview";
import { WeeklyCalendar } from "./WeeklyCalendar";
import { TimeSlotsModal } from "./TimeSlotsModal";

import { availabilityApi } from "@/api/availability";
import { scheduleUtils, timeUtils } from "@/utils/availabilityHelpers";
import { Availability, AvailabilityStats as Stats } from "@/types/availability";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AvailabilityManagerProps {
  setView: (view: string) => void;
}

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  setView,
}) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAvailabilities: 0,
    activeAvailabilities: 0,
    totalTimeSlots: 0,
    bookedTimeSlots: 0,
    weeklyHours: 0,
    monthlyEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [timeSlotsModalOpen, setTimeSlotsModalOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null);

  // Load availabilities
  const loadAvailabilities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await availabilityApi.getAllAvailabilities();
      setAvailabilities(response.data || []);

      // Calculate stats
      const calculatedStats = {
        totalAvailabilities: response.data?.length || 0,
        activeAvailabilities:
          response.data?.filter((av) => av.isAvailable && !av.isInvalidated)
            .length || 0,
        totalTimeSlots:
          response.data?.reduce((total, av) => {
            const slots = timeUtils.generateTimeSlots(
              av.startTime,
              av.endTime,
              av.consultationDuration
            );
            return total + slots.length;
          }, 0) || 0,
        bookedTimeSlots: 0, // Will be calculated from backend
        weeklyHours: scheduleUtils.calculateWeeklyHours(response.data || []),
        monthlyEarnings:
          scheduleUtils.calculateWeeklyEarnings(response.data || []) * 4, // Approximate monthly
      };
      setStats(calculatedStats);
    } catch (error) {
      console.error("Failed to load availabilities:", error);
      toast.error("Failed to load availability schedule");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle delete availability (smart delete/invalidate)
  const handleDeleteAvailability = useCallback(
    async (availability: Availability) => {
      if (!availability.id) {
        toast.error("Invalid availability");
        return;
      }

      try {
        // First try to delete (hard delete if no bookings)
        await availabilityApi.deleteAvailability(availability.id);
        toast.success("Availability session deleted successfully");
        await loadAvailabilities();
      } catch (error: any) {
        console.error("Delete failed, checking if invalidation is needed:", error);
        
        // If delete failed due to bookings, offer invalidation
        if (error?.response?.status === 409) {
          const shouldInvalidate = confirm(
            "This session has active bookings and cannot be deleted. Would you like to invalidate it instead? This will notify patients and mark their bookings as cancelled."
          );
          
          if (shouldInvalidate) {
            const reason = prompt("Please provide a reason for invalidating this session:");
            if (reason) {
              try {
                await availabilityApi.invalidateAvailability(availability.id, reason);
                toast.success("Availability session invalidated successfully");
                await loadAvailabilities();
              } catch (invalidateError) {
                console.error("Failed to invalidate availability:", invalidateError);
                toast.error("Failed to invalidate availability session");
              }
            }
          }
        } else {
          toast.error("Failed to delete availability session");
        }
      }
    },
    [loadAvailabilities]
  );

  // Handle invalidation
  const handleInvalidateAvailability = useCallback(
    async (availability: Availability, reason: string) => {
      try {
        await availabilityApi.invalidateAvailability(availability.id!, reason);
        toast.success("Availability session invalidated successfully");
        await loadAvailabilities();
      } catch (error) {
        console.error("Failed to invalidate availability:", error);
        toast.error("Failed to invalidate availability session");
      }
    },
    [loadAvailabilities]
  );

  // Handle adding session to specific day
  const handleAddSessionToDay = useCallback(
    (dayOfWeek: number) => {
      // Store the selected day and switch to add view
      localStorage.setItem("selectedDay", dayOfWeek.toString());
      setView("add");
    },
    [setView]
  );

  // Handle viewing time slots for a session
  const handleViewTimeSlots = useCallback(
    (availability: Availability) => {
      setSelectedAvailability(availability);
      setTimeSlotsModalOpen(true);
    },
    []
  );

  // Load data on mount
  useEffect(() => {
    loadAvailabilities();
  }, [loadAvailabilities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-gray-600 dark:text-gray-400">
            Loading availability schedule...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <AvailabilityStats stats={stats} loading={loading} />

      {/* Header */}
      <AvailabilityHeader
        onRefresh={loadAvailabilities}
        onAddNew={() => setView("add")}
      />

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <WeeklyCalendar
            availabilities={availabilities}
            onDeleteSession={handleDeleteAvailability}
            onInvalidateSession={handleInvalidateAvailability}
            onAddSessionToDay={handleAddSessionToDay}
            onViewTimeSlots={handleViewTimeSlots}
          />
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <AvailabilityOverview availabilities={availabilities} />
        </TabsContent>
      </Tabs>

      {/* Saving Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span className="text-gray-700 dark:text-gray-300">
              Saving availability schedule...
            </span>
          </div>
        </div>
      )}

      {/* Time Slots Modal */}
      <TimeSlotsModal
        isOpen={timeSlotsModalOpen}
        onClose={() => {
          setTimeSlotsModalOpen(false);
          setSelectedAvailability(null);
        }}
        availability={selectedAvailability}
      />
    </div>
  );
};
