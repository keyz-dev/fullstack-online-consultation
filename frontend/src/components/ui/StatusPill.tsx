import React from "react";
import { StatusPillProps } from "@/types";

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  // Handle undefined/null status
  if (!status) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700">
        <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mr-1.5"></div>
        Unknown
      </span>
    );
  }

  const statusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "in_stock":
      case "approved":
      case "completed":
      case "delivered":
      case "paid":
      case "successful":
      case "success":
      case "confirmed":
      case "accepted":
        return {
          bg: "bg-green-100 dark:bg-green-900/20",
          text: "text-green-800 dark:text-green-300",
          dot: "bg-green-400 dark:bg-green-500",
        };
      case "inactive":
      case "out_of_stock":
      case "rejected":
      case "invalid":
      case "unavailable":
      case "expired":
      case "cancelled":
      case "failed":
      case "refunded":
      case "declined":
        return {
          bg: "bg-red-100 dark:bg-red-900/20",
          text: "text-red-800 dark:text-red-300",
          dot: "bg-red-400 dark:bg-red-500",
        };
      case "pending":
      case "available":
      case "limited_stock":
      case "under_maintenance":
      case "processing":
      case "under_review":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/20",
          text: "text-blue-800 dark:text-blue-300",
          dot: "bg-blue-400 dark:bg-blue-500",
        };
      case "not_submitted":
        return {
          bg: "bg-gray-100 dark:bg-gray-700",
          text: "text-gray-800 dark:text-gray-300",
          dot: "bg-gray-400 dark:bg-gray-500",
        };
      default:
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/20",
          text: "text-yellow-800 dark:text-yellow-300",
          dot: "bg-yellow-400 dark:bg-yellow-500",
        };
    }
  };

  // Normalize status text for display
  const getDisplayText = (status: string) => {
    // Additional safety check
    if (!status || typeof status !== "string") {
      return "Unknown";
    }

    switch (status.toLowerCase()) {
      case "successful":
        return "Paid";
      case "paid":
        return "Paid";
      case "failed":
        return "Failed";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      case "accepted":
        return "Accepted";
      case "ready":
        return "Ready";
      case "delivered":
        return "Delivered";
      case "under_review":
        return "Under Review";
      case "not_submitted":
        return "Not Submitted";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const text = getDisplayText(status);

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        statusStyles(status).text
      } ${statusStyles(status).bg}`}
    >
      <div
        className={`w-1.5 h-1.5 ${
          statusStyles(status).dot
        } rounded-full mr-1.5`}
      ></div>
      {text}
    </span>
  );
};

export default StatusPill;
