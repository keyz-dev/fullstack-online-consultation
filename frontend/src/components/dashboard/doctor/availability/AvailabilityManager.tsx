"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { AvailabilityHeader } from "./AvailabilityHeader";
import { AvailabilityStats } from "./AvailabilityStats";
import { AvailabilityOverview } from "./AvailabilityOverview";
import { WeeklyCalendar } from "./WeeklyCalendar";
import { TimeBlockBuilder } from "./TimeBlockBuilder";
import { availabilityApi } from "@/api/availability";
import { scheduleUtils } from "@/utils/availabilityHelpers";
import {
  Availability,
  TimeBlock,
  AvailabilityStats as Stats,
} from "@/types/availability";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const AvailabilityManager: React.FC = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAvailabilities: 0,
    weeklyHours: 0,
    totalTimeSlots: 0,
    monthlyEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTimeBlockBuilder, setShowTimeBlockBuilder] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState<
    Availability | undefined
  >();
  const [selectedDay, setSelectedDay] = useState<number>(0);

  // Load availabilities
  const loadAvailabilities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await availabilityApi.getAllAvailabilities();
      setAvailabilities(response.data || []);

      // Calculate stats
      const calculatedStats = scheduleUtils.calculateStats(response.data || []);
      setStats(calculatedStats);
    } catch (error) {
      console.error("Failed to load availabilities:", error);
      toast.error("Failed to load availability schedule");
    } finally {
      setLoading(false);
    }
  }, []);

  // Save availabilities
  const saveAvailabilities = useCallback(async () => {
    try {
      setSaving(true);
      await availabilityApi.createAvailabilities({
        availabilities: availabilities.map((av) => ({
          dayOfWeek: av.dayOfWeek,
          startTime: av.startTime,
          endTime: av.endTime,
          consultationDuration: av.consultationDuration,
          consultationType: av.consultationType,
          consultationFee: av.consultationFee,
          maxPatients: av.maxPatients,
        })),
      });

      toast.success("Availability schedule saved successfully");
      await loadAvailabilities();
    } catch (error) {
      console.error("Failed to save availabilities:", error);
      toast.error("Failed to save availability schedule");
    } finally {
      setSaving(false);
    }
  }, [availabilities, loadAvailabilities]);

  // Handle time block save
  const handleTimeBlockSave = useCallback(
    (timeBlock: TimeBlock) => {
      if (editingAvailability) {
        // Update existing availability
        setAvailabilities((prev) =>
          prev.map((av) =>
            av.id === editingAvailability.id ? { ...av, ...timeBlock } : av
          )
        );
        setEditingAvailability(undefined);
      } else {
        // Add new availability
        const newAvailability: Availability = {
          id: Date.now(),
          doctorId: 0, // Will be set by backend
          dayOfWeek: selectedDay,
          startTime: timeBlock.startTime,
          endTime: timeBlock.endTime,
          consultationDuration: timeBlock.consultationDuration,
          consultationType: timeBlock.consultationType,
          consultationFee: timeBlock.consultationFee,
          maxPatients: timeBlock.maxPatients,
          isAvailable: true,
          isInvalidated: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setAvailabilities((prev) => [...prev, newAvailability]);
      }

      setShowTimeBlockBuilder(false);
    },
    [editingAvailability, selectedDay]
  );

  // Handle add session
  const handleAddSession = useCallback((dayOfWeek: number) => {
    setSelectedDay(dayOfWeek);
    setEditingAvailability(undefined);
    setShowTimeBlockBuilder(true);
  }, []);

  // Handle edit session
  const handleEditSession = useCallback((availability: Availability) => {
    setEditingAvailability(availability);
    setSelectedDay(availability.dayOfWeek);
    setShowTimeBlockBuilder(true);
  }, []);

  // Handle delete session
  const handleDeleteSession = useCallback((availability: Availability) => {
    setAvailabilities((prev) => prev.filter((av) => av.id !== availability.id));
    toast.success("Session removed from schedule");
  }, []);

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
      {/* Header */}
      <AvailabilityHeader
        totalSessions={availabilities.length}
        onRefresh={loadAvailabilities}
        onBulkSave={saveAvailabilities}
      />

      {/* Stats */}
      <AvailabilityStats stats={stats} />

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <WeeklyCalendar
            availabilities={availabilities}
            onAddSession={handleAddSession}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
          />
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <AvailabilityOverview availabilities={availabilities} />
        </TabsContent>
      </Tabs>

      {/* Time Block Builder Modal */}
      {showTimeBlockBuilder && (
        <TimeBlockBuilder
          isOpen={showTimeBlockBuilder}
          onClose={() => setShowTimeBlockBuilder(false)}
          onSave={handleTimeBlockSave}
          existingAvailabilities={availabilities}
          editingAvailability={editingAvailability}
        />
      )}

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
    </div>
  );
};
