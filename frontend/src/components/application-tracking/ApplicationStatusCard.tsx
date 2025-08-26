import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ApplicationStatusCardProps {
  status: string;
  submittedAt?: string;
}

const ApplicationStatusCard: React.FC<ApplicationStatusCardProps> = ({
  status,
  submittedAt,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "under_review":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "suspended":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "suspended":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "under_review":
        return "Under Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "suspended":
        return "Suspended";
      default:
        return "Unknown";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Your application has been submitted and is waiting for review.";
      case "under_review":
        return "Your application is currently being reviewed by our team.";
      case "approved":
        return "Congratulations! Your application has been approved.";
      case "rejected":
        return "Your application was not approved. You can reapply.";
      case "suspended":
        return "Your account has been suspended. Please contact support.";
      default:
        return "Application status is unknown.";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Application Status
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            status
          )}`}
        >
          {getStatusText(status)}
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        {getStatusIcon(status)}
        <div>
          <p className="text-gray-900 dark:text-white font-medium">
            {getStatusText(status)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {getStatusDescription(status)}
          </p>
        </div>
      </div>

      {submittedAt && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>
            Submitted {formatDistanceToNow(new Date(submittedAt))} ago
          </span>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatusCard;
