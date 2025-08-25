"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Store,
  Calendar,
  RefreshCw,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui";
import { pharmacyAppApi, PharmacyApplicationData } from "@/api/pharmacyApp";
import { toast } from "react-toastify";

interface ApplicationStatus {
  id: number;
  status: "pending" | "under_review" | "approved" | "rejected" | "suspended";
  submittedAt: string;
  estimatedReviewTime: string;
  lastUpdated: string;
  adminNotes?: string;
  rejectionReason?: string;
}

const PharmacyApplicationStatusPage = () => {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch application status
  const fetchApplicationStatus = async () => {
    try {
      setLoading(true);
      const response = await pharmacyAppApi.getUserApplications();
      if (response.success && response.data) {
        setApplicationStatus({
          id: response.data.id,
          status: response.data.status,
          submittedAt: response.data.submittedAt,
          estimatedReviewTime: "5-7 business days",
          lastUpdated: response.data.reviewedAt || response.data.submittedAt,
          adminNotes: response.data.adminNotes,
          rejectionReason: response.data.rejectionReason,
        });
      }
    } catch (error: any) {
      console.error("Error fetching application status:", error);
      toast.error("Failed to fetch application status");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not a pending pharmacy
  useEffect(() => {
    if (user && !user.role.includes("pharmacy")) {
      router.push("/");
    }
  }, [user, router]);

  // Fetch application status on mount
  useEffect(() => {
    if (user) {
      fetchApplicationStatus();
    }
  }, [user]);

  if (!user || !user.role.includes("pharmacy")) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!applicationStatus) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Application Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have any pharmacy application submitted.
            </p>
            <Button
              onClickHandler={() => router.push("/register/pharmacy")}
              additionalClasses="primarybtn"
              text="Submit Application"
            />
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "rejected":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "under_review":
        return <FileText className="w-6 h-6 text-blue-500" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Application Approved";
      case "rejected":
        return "Application Rejected";
      case "under_review":
        return "Under Review";
      default:
        return "Pending Review";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "approved":
        return "Congratulations! Your pharmacy application has been approved. You can now access your pharmacy dashboard.";
      case "rejected":
        return "Your pharmacy application has been rejected. Please review the feedback and consider reapplying.";
      case "under_review":
        return "Your pharmacy application is currently being reviewed by our team. We'll notify you once a decision is made.";
      default:
        return "Your pharmacy application has been submitted and is waiting to be reviewed by our team.";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 dark:text-green-400";
      case "rejected":
        return "text-red-600 dark:text-red-400";
      case "under_review":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Store className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Pharmacy Application Status
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track the progress of your pharmacy application
              </p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            {getStatusIcon(applicationStatus.status)}
            <div className="flex-1">
              <h2
                className={`text-xl font-semibold ${getStatusColor(
                  applicationStatus.status
                )}`}
              >
                {getStatusText(applicationStatus.status)}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {getStatusDescription(applicationStatus.status)}
              </p>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Application Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Submitted
                </p>
                <p className="text-gray-900 dark:text-white">
                  {new Date(applicationStatus.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Estimated Review Time
                </p>
                <p className="text-gray-900 dark:text-white">
                  {applicationStatus.estimatedReviewTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Updated
                </p>
                <p className="text-gray-900 dark:text-white">
                  {new Date(applicationStatus.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Applicant
                </p>
                <p className="text-gray-900 dark:text-white">{user.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Notes (if any) */}
        {applicationStatus.adminNotes && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Admin Notes
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                {applicationStatus.adminNotes}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actions
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClickHandler={() => router.push("/profile")}
              additionalClasses="flex-1"
              text="Update Profile"
              variant="outline"
            />
            <Button
              onClickHandler={() => router.push("/contact")}
              additionalClasses="flex-1"
              text="Contact Support"
              variant="outline"
            />
            <Button
              onClickHandler={fetchApplicationStatus}
              additionalClasses="flex-1"
              text="Refresh Status"
              variant="outline"
              disabled={actionLoading}
              leadingIcon={
                <RefreshCw
                  className={`w-4 h-4 ${actionLoading ? "animate-spin" : ""}`}
                />
              }
            />
            {applicationStatus.status === "rejected" && (
              <Button
                onClickHandler={async () => {
                  try {
                    setActionLoading(true);
                    await pharmacyAppApi.reapplyApplication(
                      applicationStatus.id.toString()
                    );
                    toast.success("Application resubmitted successfully!");
                    fetchApplicationStatus();
                  } catch (error: any) {
                    const errorMessage =
                      error instanceof Error
                        ? error.message
                        : "Failed to resubmit application";
                    toast.error(errorMessage);
                  } finally {
                    setActionLoading(false);
                  }
                }}
                additionalClasses="flex-1"
                text="Reapply"
                variant="primary"
                disabled={actionLoading}
              />
            )}
            {applicationStatus.status === "approved" && (
              <Button
                onClickHandler={async () => {
                  try {
                    setActionLoading(true);
                    const response = await pharmacyAppApi.activateAccount(
                      applicationStatus.id.toString()
                    );
                    toast.success("Account activated successfully!");
                    if (updateUser && response.data?.role) {
                      updateUser({
                        ...user,
                        role: response.data.role as "pharmacy",
                      });
                    }
                    router.push("/dashboard/pharmacy");
                  } catch (error: any) {
                    const errorMessage =
                      error instanceof Error
                        ? error.message
                        : "Failed to activate account";
                    toast.error(errorMessage);
                  } finally {
                    setActionLoading(false);
                  }
                }}
                additionalClasses="flex-1"
                text="Activate Account"
                variant="primary"
                disabled={actionLoading}
                leadingIcon={<Play className="w-4 h-4" />}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyApplicationStatusPage;
