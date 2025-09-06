"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePatientAppointments } from "@/contexts/PatientAppointmentContext";
import {
  PatientAppointmentStatSection,
  PatientAppointmentListView,
} from "@/components/dashboard/patient/appointments";
import PatientAppointmentDetailsModal from "@/components/dashboard/patient/appointments/PatientAppointmentDetailsModal";
import {
  Button,
  AdvancedFilters,
  Pagination,
  EmptyState,
  FadeInContainer,
  DeleteModal,
} from "@/components/ui";
import { PatientAppointment } from "@/api/appointments";
import { Plus } from "lucide-react";
import { useBookingPayment } from "@/hooks/useBookingPayment";
import { toast } from "react-toastify";

const PatientAppointmentsPage: React.FC = () => {
  const router = useRouter();
  const [selectedAppointment, setSelectedAppointment] =
    useState<PatientAppointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { appointments, loading, error, stats, filters, pagination, actions } =
    usePatientAppointments();

  const { retryPayment } = useBookingPayment();

  // Handle appointment actions
  const handleViewAppointment = (appointment: PatientAppointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleCancelAppointment = (appointment: PatientAppointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleRescheduleAppointment = (appointment: PatientAppointment) => {
    // TODO: Open reschedule modal or navigate to booking with pre-filled data
    console.log("Reschedule appointment:", appointment.id);
  };

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return;

    setCancelLoading(true);
    try {
      // TODO: Call cancel appointment API
      console.log("Cancelling appointment:", selectedAppointment.id);
      await actions.refreshAppointments();
      setShowCancelModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleBookAppointment = () => {
    router.push("/booking");
  };

  // Handle payment retry
  const handleRetryPayment = async (appointment: PatientAppointment) => {
    try {
      // Get patient's phone number from the appointment or user context
      const phoneNumber = appointment.patient?.user?.phoneNumber || "";

      if (!phoneNumber) {
        toast.error(
          "Phone number is required for payment retry. Please update your profile."
        );
        return;
      }

      await retryPayment(phoneNumber);
      toast.success("Payment retry initiated successfully!");

      // Refresh appointments to get updated status
      await actions.refreshAppointments();

      // Close the details modal
      setShowDetailsModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Failed to retry payment:", error);
      toast.error("Failed to retry payment. Please try again.");
    }
  };

  // Filter configurations
  const filterConfigs = [
    {
      key: "status",
      label: "Status",
      defaultValue: "all",
      colorClass:
        "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      options: [
        { value: "all", label: "All Statuses" },
        { value: "confirmed", label: "Confirmed" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "no_show", label: "No Show" },
        { value: "pending_payment", label: "Pending Payment" },
        { value: "paid", label: "Paid" },
      ],
    },
    {
      key: "consultationType",
      label: "Type",
      defaultValue: "all",
      colorClass:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      options: [
        { value: "all", label: "All Types" },
        { value: "online", label: "Online" },
        { value: "physical", label: "In Person" },
      ],
    },
    {
      key: "sortBy",
      label: "Sort By",
      defaultValue: "date",
      colorClass:
        "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      options: [
        { value: "date", label: "Date" },
        { value: "doctor", label: "Doctor" },
        { value: "status", label: "Status" },
        { value: "createdAt", label: "Created Date" },
      ],
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Error Loading Appointments"
          description={error}
          action={
            <Button
              onClickHandler={actions.refreshAppointments}
              additionalClasses="primarybtn"
              text="Try Again"
            />
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      {/* Appointment Statistics */}
      <FadeInContainer delay={200} duration={600}>
        <PatientAppointmentStatSection stats={stats} loading={loading} />
      </FadeInContainer>

      <div className="flex items-center justify-end">
        <Button
          onClickHandler={handleBookAppointment}
          additionalClasses="primarybtn"
          text="Book Appointment"
          leadingIcon={<Plus className="w-4 h-4 mr-2" />}
        />
      </div>
      {/* Consultation Types Info
      <FadeInContainer delay={400} duration={600}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Consultation Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
              <Video className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Online
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Video consultation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  In Person
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Physical consultation
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeInContainer> */}

      {/* Advanced Search and Filters */}
      <FadeInContainer delay={600} duration={600}>
        <AdvancedFilters
          filters={filters}
          onFilterChange={(key, value) => actions.setFilter(key, value)}
          onSearch={actions.setSearch}
          onClearAll={actions.clearFilters}
          refreshFunction={actions.refreshAppointments}
          filterConfigs={filterConfigs}
          searchPlaceholder="Search appointments by doctor name, specialty..."
        />
      </FadeInContainer>

      {/* Appointments List */}
      <FadeInContainer delay={800} duration={600}>
        <PatientAppointmentListView
          appointments={appointments}
          loading={loading}
          onView={handleViewAppointment}
          onCancel={handleCancelAppointment}
          onReschedule={handleRescheduleAppointment}
          onRetryPayment={handleRetryPayment}
        />
      </FadeInContainer>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <FadeInContainer delay={1000} duration={600}>
          <div className="flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={actions.setPage}
              total={pagination.total}
              limit={pagination.limit}
            />
          </div>
        </FadeInContainer>
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
        message={`Are you sure you want to cancel your appointment with Dr. ${selectedAppointment?.doctor.user.name} on ${selectedAppointment?.timeSlot.date}?`}
        confirmText="Cancel Appointment"
        loading={cancelLoading}
      />

      {/* Appointment Details Modal */}
      <PatientAppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedAppointment(null);
        }}
        onRetryPayment={handleRetryPayment}
      />
    </div>
  );
};

export default PatientAppointmentsPage;
