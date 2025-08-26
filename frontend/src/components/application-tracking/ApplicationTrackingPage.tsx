"use client";

import React, { useState } from "react";
import { useUserApplication } from "@/hooks/useUserApplication";
import { User, Building, RefreshCw } from "lucide-react";
import { Button, FadeInContainer, LoadingSpinner } from "@/components/ui";
import ApplicationStatusCard from "./ApplicationStatusCard";
import ApplicationActionsCard from "./ApplicationActionsCard";
import ApplicationDocumentsCard from "./ApplicationDocumentsCard";
import ApplicationStatsCard from "./ApplicationStatsCard";
import ApplicationDetailsModal from "./ApplicationDetailsModal";
import ApplicationTimelineModal from "./ApplicationTimelineModal";

interface ApplicationTrackingPageProps {
  userType: "doctor" | "pharmacy";
}

const ApplicationTrackingPage: React.FC<ApplicationTrackingPageProps> = ({
  userType,
}) => {
  const {
    application,
    loading,
    refreshing,
    activating,
    reapplying,
    error,
    timeline,
    stats,
    refreshStatus,
    activateAccount,
    reapplyApplication,
    downloadDocument,
    clearError,
    canActivate,
    canReapply,
    canRefresh,
  } = useUserApplication();

  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);

  const handleDownloadDocument = async (
    documentId: number,
    fileName: string
  ) => {
    await downloadDocument(documentId, fileName);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-4">
            Error Loading Application
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            {error}
          </p>
          <Button onClick={clearError} className="w-full" variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">
            No Application Found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            You don&apos;t have any {userType} applications submitted yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FadeInContainer>
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  {userType === "doctor" ? (
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userType === "doctor" ? "Doctor" : "Pharmacy"} Application
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Track your application status and manage your account
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {canRefresh && (
                  <Button
                    onClick={refreshStatus}
                    disabled={refreshing}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        refreshing ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Status Card */}
          <ApplicationStatusCard
            status={application.status}
            submittedAt={application.submittedAt}
          />

          {/* Action Buttons */}
          <ApplicationActionsCard
            onViewApplication={() => setShowApplicationModal(true)}
            onViewTimeline={() => setShowTimelineModal(true)}
            canActivate={canActivate}
            canReapply={canReapply}
            onActivate={activateAccount}
            onReapply={reapplyApplication}
            activating={activating}
            reapplying={reapplying}
          />

          {/* Documents Section */}
          <ApplicationDocumentsCard
            documents={application.documents}
            onDownload={handleDownloadDocument}
          />

          {/* Statistics */}
          {stats && <ApplicationStatsCard stats={stats} />}
        </FadeInContainer>

        {/* Modals */}
        <ApplicationDetailsModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          application={application}
        />

        <ApplicationTimelineModal
          isOpen={showTimelineModal}
          onClose={() => setShowTimelineModal(false)}
          timeline={timeline}
        />
      </div>
    </div>
  );
};

export default ApplicationTrackingPage;
