"use client";

import React, { useState } from "react";
import { AdvancedFilters, FadeInContainer } from "@/components/ui";
import {
  ApplicationList,
  ApplicationStatSection,
  ApplicationReviewModal,
  ApplicationDetailModal,
} from "@/components/dashboard/admin/applications";
import { useAdminApplications } from "@/hooks/useAdminApplications";
import { Application } from "@/api/admin";

const AdminApplicationsPage: React.FC = () => {
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null
  );

  const {
    applications,
    loading,
    error,
    stats,
    statsLoading,
    pagination,
    filters,
    setPage,
    setFilter,
    setSearch,
    clearFilters,
    refreshApplications,
  } = useAdminApplications();

  const handleReview = (
    application: Application,
    action: "approve" | "reject"
  ) => {
    setSelectedApplication(application);
    setReviewAction(action);
    setShowReviewModal(true);
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleReviewSuccess = () => {
    // Refresh the applications list after successful review
    refreshApplications();
  };

  const filterConfigs = [
    {
      key: "status",
      label: "Status",
      defaultValue: "",
      colorClass:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200",
      options: [
        { value: "", label: "All Statuses" },
        { value: "pending", label: "Pending" },
        { value: "under_review", label: "Under Review" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
        { value: "suspended", label: "Suspended" },
      ],
    },
    {
      key: "applicationType",
      label: "Application Type",
      defaultValue: "",
      colorClass:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200",
      options: [
        { value: "", label: "All Types" },
        { value: "doctor", label: "Doctors" },
        { value: "pharmacy", label: "Pharmacies" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <FadeInContainer delay={300} duration={600}>
        <ApplicationStatSection stats={stats} loading={statsLoading} />
      </FadeInContainer>

      {/* Filters */}
      <FadeInContainer delay={400} duration={600}>
        <AdvancedFilters
          filters={filters}
          onFilterChange={(key, value) => setFilter(key, value)}
          onSearch={setSearch}
          onClearAll={clearFilters}
          filterConfigs={filterConfigs}
          searchPlaceholder="Search by business name, location..."
          loading={loading}
        />
      </FadeInContainer>

      {/* Applications List */}
      <FadeInContainer delay={600} duration={600}>
        <ApplicationList
          applications={applications}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={setPage}
          onViewDetails={handleViewDetails}
          onReview={handleReview}
        />
      </FadeInContainer>

      {/* Details Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedApplication(null);
        }}
        onReview={handleReview}
      />

      {/* Review Modal */}
      <ApplicationReviewModal
        application={selectedApplication}
        action={reviewAction!}
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedApplication(null);
          setReviewAction(null);
        }}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
};

export default AdminApplicationsPage;
