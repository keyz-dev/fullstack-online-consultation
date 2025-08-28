import { useState, useEffect, useCallback } from "react";
import {
  userApplicationsAPI,
  UserApplicationData,
} from "@/api/userApplications";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export const useUserApplication = () => {
  const [application, setApplication] = useState<UserApplicationData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activating, setActivating] = useState(false);
  const [reapplying, setReapplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<
    Array<{
      id: number;
      action: string;
      description: string;
      timestamp: string;
      status: string;
    }>
  >([]);
  const [stats, setStats] = useState<{
    totalApplications: number;
    currentStatus: string;
    daysSinceSubmission: number;
    estimatedReviewTime: string;
    lastUpdated: string;
  } | null>(null);

  const router = useRouter();
  const { updateUser } = useAuth();

  // Fetch user's application
  const fetchApplication = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userApplicationsAPI.getMyApplication();

      if (response.success && response.data) {
        setApplication(response.data);
      } else {
        setError(response.error || "Failed to fetch application");
        toast.error(response.error || "Failed to fetch application");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch application";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh application status
  const refreshStatus = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      const response = await userApplicationsAPI.refreshApplicationStatus();

      if (response.success && response.data) {
        // Update the application status
        if (application) {
          setApplication({
            ...application,
            status: response.data.status,
          });
        }
        toast.success("Application status refreshed successfully");

        // Refetch the full application to get any updates
        await fetchApplication();
      } else {
        setError(response.error || "Failed to refresh application status");
        toast.error(response.error || "Failed to refresh application status");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to refresh application status";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, [application, fetchApplication]);

  // Activate account (when approved)
  const activateAccount = useCallback(async () => {
    setActivating(true);
    setError(null);

    try {
      const response = await userApplicationsAPI.activateAccount();

      if (response.success && response.data) {
        // Update the user's role in the frontend state
        if (updateUser && response.data?.role) {
          // Get current user from localStorage
          const currentUser = localStorage.getItem("userData");
          if (currentUser) {
            const userData = JSON.parse(currentUser);
            updateUser({
              ...userData,
              role: response.data.role,
            });
          }
        }

        // Redirect to the appropriate dashboard based on the new role
        setTimeout(() => {
          router.push(
            response.data?.redirectUrl ||
              `/${response.data?.role.toLowerCase()}` ||
              "/"
          );
        }, 2000);
      } else {
        setError(response.error || "Failed to activate account");
        toast.error(response.error || "Failed to activate account");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to activate account";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setActivating(false);
    }
  }, [router, updateUser]);

  // Reapply for application (when rejected)
  const reapplyApplication = useCallback(async () => {
    setReapplying(true);
    setError(null);

    try {
      const response = await userApplicationsAPI.reapplyApplication();

      if (response.success && response.data) {
        toast.success("Application resubmitted successfully");

        // Refetch the application to get the new version
        await fetchApplication();
      } else {
        setError(response.error || "Failed to reapply for application");
        toast.error(response.error || "Failed to reapply for application");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to reapply for application";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setReapplying(false);
    }
  }, [fetchApplication]);

  // Fetch application timeline
  const fetchTimeline = useCallback(async () => {
    try {
      const response = await userApplicationsAPI.getApplicationTimeline();

      if (response.success && response.data) {
        setTimeline(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch application timeline:", err);
    }
  }, []);

  // Fetch application statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await userApplicationsAPI.getApplicationStats();

      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch application statistics:", err);
    }
  }, []);

  // Download document
  const downloadDocument = useCallback(
    async (documentId: number, fileName: string) => {
      try {
        const blob = await userApplicationsAPI.downloadDocument(documentId);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Document downloaded successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to download document";
        toast.error(errorMessage);
      }
    },
    []
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchApplication();
    fetchTimeline();
    fetchStats();
  }, [fetchApplication, fetchTimeline, fetchStats]);

  return {
    // State
    application,
    loading,
    refreshing,
    activating,
    reapplying,
    error,
    timeline,
    stats,

    // Actions
    fetchApplication,
    refreshStatus,
    activateAccount,
    reapplyApplication,
    fetchTimeline,
    fetchStats,
    downloadDocument,
    clearError,

    // Computed values
    isPending: application?.status === "pending",
    isUnderReview: application?.status === "under_review",
    isApproved: application?.status === "approved",
    isRejected: application?.status === "rejected",
    isSuspended: application?.status === "suspended",
    canActivate: application?.status === "approved",
    canReapply: application?.status === "rejected",
    canRefresh:
      application?.status === "pending" ||
      application?.status === "under_review",
  };
};
