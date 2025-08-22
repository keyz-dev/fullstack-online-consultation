"use client";

import React from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Building2,
} from "lucide-react";

const PendingPharmacyPage: React.FC = () => {
  // Mock data - replace with actual API call
  const applicationStatus = {
    status: "pending", // pending, under_review, approved, rejected
    submittedAt: "2025-01-20T10:30:00Z",
    businessName: "MedCare Pharmacy",
    applicationId: "PHAR-2025-001",
    documents: [
      {
        name: "Pharmacy License",
        status: "pending",
        uploadedAt: "2025-01-20T10:30:00Z",
      },
      {
        name: "Business Registration",
        status: "pending",
        uploadedAt: "2025-01-20T10:30:00Z",
      },
      {
        name: "Insurance Certificate",
        status: "pending",
        uploadedAt: "2025-01-20T10:30:00Z",
      },
    ],
    estimatedReviewTime: "3-5 business days",
  };

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
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Application Status
            </h1>
            <p className="text-gray-600 mt-1">
              Track your pharmacy application progress
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Building2 className="h-6 w-6 text-blue-500" />
            {getStatusIcon(applicationStatus.status)}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                applicationStatus.status
              )}`}
            >
              {getStatusText(applicationStatus.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Application Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Application ID:</span>
              <span className="font-medium">
                {applicationStatus.applicationId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business Name:</span>
              <span className="font-medium">
                {applicationStatus.businessName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Submitted:</span>
              <span className="font-medium">
                {new Date(applicationStatus.submittedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Review:</span>
              <span className="font-medium">
                {applicationStatus.estimatedReviewTime}
              </span>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Application Timeline
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Application Submitted
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(applicationStatus.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  applicationStatus.status === "pending" ||
                  applicationStatus.status === "under_review" ||
                  applicationStatus.status === "approved"
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Under Review
                </p>
                <p className="text-xs text-gray-500">
                  {applicationStatus.status === "pending"
                    ? "Pending"
                    : applicationStatus.status === "under_review"
                    ? "In Progress"
                    : "Completed"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  applicationStatus.status === "approved"
                    ? "bg-green-500"
                    : applicationStatus.status === "rejected"
                    ? "bg-red-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Decision</p>
                <p className="text-xs text-gray-500">
                  {applicationStatus.status === "pending" ||
                  applicationStatus.status === "under_review"
                    ? "Pending"
                    : applicationStatus.status === "approved"
                    ? "Approved"
                    : "Rejected"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Submitted Documents
        </h2>
        <div className="space-y-3">
          {applicationStatus.documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    doc.status
                  )}`}
                >
                  {getStatusText(doc.status)}
                </span>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
        <p className="text-blue-800 mb-4">
          If you have any questions about your application or need to update
          your information, please contact our support team.
        </p>
        <div className="flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
          <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Update Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingPharmacyPage;
