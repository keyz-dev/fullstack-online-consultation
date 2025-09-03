"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDoctorConsultations } from "@/contexts/DoctorConsultationContext";
import {
  DoctorConsultationViewToggle,
  DoctorConsultationStatSection,
  ConsultationDetailsModal,
} from "@/components/dashboard/doctor/consultations";
import PrescriptionGenerationModal from "@/components/dashboard/doctor/prescriptions/PrescriptionGenerationModal";
import {
  Button,
  AdvancedFilters,
  Pagination,
  EmptyState,
  FadeInContainer,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Consultation } from "@/types";
import { Video, MessageSquare, Plus, Filter } from "lucide-react";

const DoctorConsultationsPage: React.FC = () => {
  const router = useRouter();
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const {
    consultations,
    activeConsultations,
    loading,
    error,
    stats,
    filters,
    pagination,
    actions,
  } = useDoctorConsultations();

  // Combine active and regular consultations, with active ones first
  const allConsultations = [
    ...activeConsultations,
    ...consultations.filter(
      (c) => !activeConsultations.some((ac) => ac.id === c.id)
    ),
  ];

  // Filter configurations
  const filterConfigs = [
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "all", label: "All Statuses" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "not_started", label: "Not Started" },
      ],
    },
    {
      key: "type",
      label: "Type",
      type: "select" as const,
      options: [
        { value: "all", label: "All Types" },
        { value: "video_call", label: "Video Call" },
        { value: "voice_call", label: "Voice Call" },
        { value: "chat", label: "Chat" },
        { value: "in_person", label: "In Person" },
      ],
    },
  ];

  // Sort options
  const sortOptions = [
    { value: "date", label: "Date" },
    { value: "patient", label: "Patient" },
    { value: "status", label: "Status" },
    { value: "duration", label: "Duration" },
  ];

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    actions.setFilters(newFilters);
  };

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    actions.setPagination({ page });
  };

  // Handle consultation actions
  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setShowDetailsModal(true);
  };

  const handleJoinConsultation = (consultation: Consultation) => {
    if (consultation.roomId) {
      router.push(
        `/doctor/consultation/${consultation.id}/video?roomId=${consultation.roomId}`
      );
    }
  };

  const handleViewNotes = (consultation: Consultation) => {
    router.push(`/doctor/consultations/${consultation.id}?tab=notes`);
  };

  // Handle prescription generation
  const handleGeneratePrescription = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setShowPrescriptionModal(true);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <EmptyState
          title="Error Loading Consultations"
          description={error}
          icon="alert"
          action={
            <button
              onClick={actions.refreshConsultations}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <DoctorConsultationStatSection stats={stats} loading={loading} />

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            All Consultations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <AdvancedFilters
              filters={filters}
              onFiltersChange={handleFilterChange}
              filterConfigs={filterConfigs}
              sortOptions={sortOptions}
              searchPlaceholder="Search by patient name..."
            />

            {/* Consultation List */}
            <FadeInContainer>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : allConsultations.length === 0 ? (
                <EmptyState
                  title="No Consultations Found"
                  description="You haven't conducted any consultations yet, or none match your current filters."
                  icon="search"
                  action={
                    <button
                      onClick={() => router.push("/doctor/appointments")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Appointments
                    </button>
                  }
                />
              ) : (
                <>
                  <DoctorConsultationViewToggle
                    consultations={allConsultations}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onViewConsultation={handleViewConsultation}
                    onJoinConsultation={handleJoinConsultation}
                    onViewNotes={handleViewNotes}
                    onGeneratePrescription={handleGeneratePrescription}
                  />

                  {/* Pagination */}
                  {pagination.total > pagination.limit && (
                    <div className="flex justify-center mt-6">
                      <Pagination
                        currentPage={pagination.page}
                        totalPages={Math.ceil(
                          pagination.total / pagination.limit
                        )}
                        onPageChange={handlePageChange}
                        showPageInfo={true}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.limit}
                      />
                    </div>
                  )}
                </>
              )}
            </FadeInContainer>
          </div>
        </CardContent>
      </Card>

      {/* Consultation Details Modal */}
      <ConsultationDetailsModal
        consultation={selectedConsultation}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedConsultation(null);
        }}
      />

      {/* Prescription Generation Modal */}
      {selectedConsultation && (
        <PrescriptionGenerationModal
          isOpen={showPrescriptionModal}
          onClose={() => {
            setShowPrescriptionModal(false);
            setSelectedConsultation(null);
          }}
          consultationId={parseInt(selectedConsultation.id)}
          patientInfo={{
            name: selectedConsultation.patient?.user?.name || "",
            age: selectedConsultation.patient?.age || 0,
            gender: selectedConsultation.patient?.gender || "",
            contactNumber:
              selectedConsultation.patient?.user?.phoneNumber || "",
          }}
          consultationNotes={selectedConsultation.notes || ""}
        />
      )}
    </div>
  );
};

export default DoctorConsultationsPage;
