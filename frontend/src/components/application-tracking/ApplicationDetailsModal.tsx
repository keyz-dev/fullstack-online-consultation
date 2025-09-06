import React from "react";
import { ModalWrapper, FormHeader } from "@/components/ui";
import { X } from "lucide-react";

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: unknown; // Using any for now, can be properly typed later
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  if (!isOpen || !application) return null;

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

  return (
    <ModalWrapper>
      <div className="p-2 lg:p-6 w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <FormHeader
          title="Application Details"
          description="View your complete application information"
        />

        <div className="space-y-6 mt-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Basic Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Application Type
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">
                    {application.applicationType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {getStatusText(application.status)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Version
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {application.applicationVersion}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Submitted
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {application.submittedAt
                      ? new Date(application.submittedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          {application.doctor && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Doctor Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      License Number
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {application.doctor.licenseNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Experience
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {application.doctor.experience} years
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Bio
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {application.doctor.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pharmacy Information */}
          {application.pharmacy && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Pharmacy Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Pharmacy Name
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {application.pharmacy.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      License Number
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {application.pharmacy.licenseNumber}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {application.pharmacy.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Notes */}
          {application.adminNotes && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Admin Notes
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-900 dark:text-white">
                  {application.adminNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ApplicationDetailsModal;
