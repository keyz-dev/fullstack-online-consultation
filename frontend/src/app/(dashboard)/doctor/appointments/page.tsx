"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDoctorAppointments } from "@/contexts/DoctorAppointmentContext";
import {
  DoctorAppointmentStatSection,
  DoctorAppointmentListView,
} from "@/components/dashboard/doctor/appointments";
import {
  Button,
  AdvancedFilters,
  Pagination,
  EmptyState,
  FadeInContainer,
  DeleteModal,
} from "@/components/ui";
import { DoctorAppointment } from "@/api/appointments";
import { Plus, Video, Phone, MessageSquare, MapPin } from "lucide-react";

const DoctorAppointmentsPage: React.FC = () => {
  const router = useRouter();
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorAppointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const {
    appointments,
    stats,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    setPagination,
    refreshAppointments,
  } = useDoctorAppointments();

  // Filter configurations
  const filterConfigs = [
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "all", label: "All Statuses" },
        { value: "confirmed", label: "Confirmed" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "no_show", label: "No Show" },
      ],
    },
    {
      key: "consultationType",
      label: "Consultation Type",
      type: "select" as const,
      options: [
        { value: "all", label: "All Types" },
        { value: "online", label: "Online" },
        { value: "physical", label: "In Person" },
      ],
    },
    {
      key: "dateFrom",
      label: "From Date",
      type: "date" as const,
    },
    {
      key: "dateTo",
      label: "To Date",
      type: "date" as const,
    },
    {
      key: "search",
      label: "Search Patients",
      type: "text" as const,
      placeholder: "Search by patient name...",
    },
  ];

  // Sort options
  const sortOptions = [
    { value: "date", label: "Date" },
    { value: "patient", label: "Patient" },
    { value: "status", label: "Status" },
  ];

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    setPagination({ page });
  };

  // Handle appointment actions
  const handleViewAppointment = (appointment: DoctorAppointment) => {
    // TODO: Navigate to appointment details page
    console.log("View appointment:", appointment.id);
  };

  const handleStartConsultation = (appointment: DoctorAppointment) => {
    // TODO: Navigate to consultation page
    console.log("Start consultation:", appointment.id);
  };

  const handleRescheduleAppointment = (appointment: DoctorAppointment) => {
    // TODO: Open reschedule modal
    console.log("Reschedule appointment:", appointment.id);
  };

  const handleCancelAppointment = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return;

    try {
      // TODO: Call cancel appointment API
      console.log("Cancelling appointment:", selectedAppointment.id);

      // Close modal and refresh
      setShowCancelModal(false);
      setSelectedAppointment(null);
      refreshAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  // Handle schedule management
  const handleManageSchedule = () => {
    router.push("/doctor/schedule");
  };

  // Handle view calendar
  const handleViewCalendar = () => {
    // TODO: Navigate to calendar view
    console.log("View calendar");
  };

  return (
    <FadeInContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-end">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleViewCalendar}>
              <MapPin className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
            <Button variant="outline" onClick={handleManageSchedule}>
              <Plus className="w-4 h-4 mr-2" />
              Manage Schedule
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <DoctorAppointmentStatSection stats={stats} />

        {/* Filters */}
        <AdvancedFilters
          filters={filters}
          filterConfigs={filterConfigs}
          sortOptions={sortOptions}
          onFilterChange={handleFilterChange}
          onSortChange={(sortBy) => setFilters({ sortBy })}
        />

        {/* Appointments List */}
        {loading ? (
          <EmptyState
            title="Loading appointments..."
            description="Please wait while we fetch your appointments."
            loading={true}
          />
        ) : error ? (
          <EmptyState
            title="Error loading appointments"
            description={error}
            action={{
              label: "Try Again",
              onClick: refreshAppointments,
            }}
          />
        ) : appointments.length === 0 ? (
          <EmptyState
            title="No appointments found"
            description="You don't have any appointments yet. Patients will appear here once they book appointments with you."
            icon={Video}
          />
        ) : (
          <>
            <DoctorAppointmentListView
              appointments={appointments}
              onViewAppointment={handleViewAppointment}
              onStartConsultation={handleStartConsultation}
              onRescheduleAppointment={handleRescheduleAppointment}
              onCancelAppointment={handleCancelAppointment}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {/* Cancel Appointment Modal */}
        <DeleteModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedAppointment(null);
          }}
          onConfirm={handleCancelConfirm}
          title="Cancel Appointment"
          description={`Are you sure you want to cancel the appointment with ${selectedAppointment?.patient.user.name}? This action cannot be undone.`}
          confirmText="Cancel Appointment"
          cancelText="Keep Appointment"
        />
      </div>
    </FadeInContainer>
  );
};

export default DoctorAppointmentsPage;
