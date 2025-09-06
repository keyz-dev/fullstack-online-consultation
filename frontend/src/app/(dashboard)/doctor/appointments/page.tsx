"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDoctorAppointments } from "@/contexts/DoctorAppointmentContext";
import {
  DoctorAppointmentListView,
  DoctorAppointmentStatSection,
  VideoCallInitiationModal,
} from "@/components/dashboard/doctor/appointments";
import { DoctorCallStatus } from "@/components/video/DoctorCallStatus";
import { useDoctorCallStatus } from "@/hooks/useDoctorCallStatus";
import { useConsultation } from "@/contexts";
import AppointmentDetailsModal from "@/components/dashboard/doctor/appointments/AppointmentDetailsModal";
import {
  Button,
  AdvancedFilters,
  Pagination,
  EmptyState,
  FadeInContainer,
  DeleteModal,
} from "@/components/ui";
import { DoctorAppointment } from "@/api/appointments";
import { Plus, MapPin } from "lucide-react";

const DoctorAppointmentsPage: React.FC = () => {
  const router = useRouter();
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorAppointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);

  // Call status management
  const {
    isCallStatusVisible,
    callStatus,
    callData,
    ringDuration,
    startCall,
    cancelCall,
    retryCall,
  } = useDoctorCallStatus();

  const { initiateVideoCall } = useConsultation();

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
  ];

  // Sort options
  const sortOptions = [
    { value: "date", label: "Date" },
    { value: "patient", label: "Patient" },
    { value: "status", label: "Status" },
  ];

  // Handle filter changes
  const handleFilterChange = (newFilters: unknown) => {
    setFilters(newFilters);
  };

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    setPagination({ page });
  };

  // Handle appointment actions
  const handleViewAppointment = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleStartVideoCall = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setShowVideoCallModal(true);
  };

  const handleCallInitiated = (roomId: string, consultationId: string, patientOnline: boolean = true) => {
    // Close the modal first
    setShowVideoCallModal(false);
    
    // Start call status tracking
    if (selectedAppointment) {
      startCall({
        consultationId,
        roomId,
        patientName: selectedAppointment.patient.user.name,
        patientEmail: selectedAppointment.patient.user.email,
      }, patientOnline);
    }
  };

  const handleStartChat = (appointment: DoctorAppointment) => {
    // TODO: Navigate to chat page
    console.log("Start chat:", appointment.id);
  };

  const handleInvalidateAppointment = (appointment: DoctorAppointment) => {
    // TODO: Open invalidate modal
    console.log("Invalidate appointment:", appointment.id);
  };

  const handleCancelAppointment = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleRetryCall = async () => {
    try {
      if (!callData) return;
      // Re-initiate the call via API which emits to the patient
      await initiateVideoCall(callData.consultationId);
      // Update local UI state to show ringing again
      retryCall();
    } catch (error) {
      console.error("Failed to retry call:", error);
    }
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
    <div className="space-y-6">
      <FadeInContainer>
        {/* Statistics */}
        <DoctorAppointmentStatSection stats={stats} />

        {/* Buttons */}
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

        {/* Filters */}
        <AdvancedFilters
          filters={filters}
          filterConfigs={filterConfigs}
          sortOptions={sortOptions}
          onFilterChange={handleFilterChange}
          onSortChange={(sortBy: string) => setFilters({ sortBy })}
        />

        {/* Appointments List */}
        {loading ? (
          <EmptyState
            title="Loading appointments..."
            description="Please wait while we fetch your appointments."
          />
        ) : error ? (
          <EmptyState
            title="Error loading appointments"
            description={error}
            action={{
              text: "Try Again",
              onClick: refreshAppointments,
            }}
          />
        ) : appointments.length === 0 ? (
          <EmptyState
            title="No appointments found"
            description="You don't have any appointments yet. Patients will appear here once they book appointments with you."
            icon="package"
          />
        ) : (
          <>
            <DoctorAppointmentListView
              appointments={appointments}
              onViewAppointment={handleViewAppointment}
              onStartVideoCall={handleStartVideoCall}
              onStartChat={handleStartChat}
              onCancelAppointment={handleCancelAppointment}
              onInvalidateAppointment={handleInvalidateAppointment}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  total={pagination.total}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </FadeInContainer>

      {/* Cancel Appointment Modal */}
      <DeleteModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleCancelConfirm}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel the appointment with ${selectedAppointment?.patient?.user.name}? This action cannot be undone.`}
        confirmText="Cancel Appointment"
        cancelText="Keep"
      />

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedAppointment(null);
        }}
      />

      {/* Video Call Initiation Modal */}
      <VideoCallInitiationModal
        appointment={selectedAppointment}
        isOpen={showVideoCallModal}
        onClose={() => {
          setShowVideoCallModal(false);
          setSelectedAppointment(null);
        }}
        onCallInitiated={handleCallInitiated}
      />

      {/* Doctor Call Status (Floating) */}
      <DoctorCallStatus
        isVisible={isCallStatusVisible}
        patientName={callData?.patientName || ''}
        patientEmail={callData?.patientEmail}
        callStatus={callStatus}
        ringDuration={ringDuration}
        onCancel={cancelCall}
        onRetry={handleRetryCall}
      />
    </div>
  );
};

export default DoctorAppointmentsPage;
