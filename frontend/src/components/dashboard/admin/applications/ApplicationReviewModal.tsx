import React, { useState } from "react";
import { X, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button, TextArea } from "@/components/ui";
import { adminApi, Application, DocumentReview } from "@/api/admin";
import DocumentReviewCard from "./DocumentReviewCard";
import { toast } from "react-toastify";

interface ApplicationReviewModalProps {
  application: Application | null;
  action: "approve" | "reject";
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ApplicationReviewModal: React.FC<ApplicationReviewModalProps> = ({
  application,
  action,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<
    Application["documents"][0] | null
  >(null);
  const [formData, setFormData] = useState({
    remarks: "",
    documentReviews: [] as DocumentReview[],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentReview = (
    documentId: number,
    isApproved: boolean,
    remarks: string
  ) => {
    setFormData((prev) => {
      const existing = prev.documentReviews.find(
        (doc) => doc.documentId === documentId
      );
      const updated = existing
        ? prev.documentReviews.map((doc) =>
            doc.documentId === documentId
              ? { ...doc, isApproved, remarks }
              : doc
          )
        : [...prev.documentReviews, { documentId, isApproved, remarks }];

      return {
        ...prev,
        documentReviews: updated,
      };
    });
  };

  const handleSubmit = async () => {
    if (!application) return;

    if (action === "reject" && !formData.remarks.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        status: action === "approve" ? "approved" : "rejected",
        remarks: formData.remarks,
        ...(action === "reject" && {
          rejectionReason: formData.remarks,
        }),
        ...(formData.documentReviews.length > 0 && {
          documentReviews: formData.documentReviews,
        }),
      };

      await adminApi.reviewApplication(application.id, reviewData);

      toast.success(`Application ${action}d successfully`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Review submission failed:", error);
      toast.error(
        error.response?.data?.message || `Failed to ${action} application`
      );
    } finally {
      setLoading(false);
    }
  };

  const getActionConfig = () => {
    if (action === "approve") {
      return {
        title: "Approve Application",
        icon: CheckCircle,
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-800",
        textColor: "text-green-800 dark:text-green-200",
        buttonColor:
          "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600",
        iconColor: "text-green-600 dark:text-green-400",
      };
    } else {
      return {
        title: "Reject Application",
        icon: XCircle,
        bgColor: "bg-red-50 dark:bg-red-900/20",
        borderColor: "border-red-200 dark:border-red-800",
        textColor: "text-red-800 dark:text-red-200",
        buttonColor:
          "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
        iconColor: "text-red-600 dark:text-red-400",
      };
    }
  };

  const config = getActionConfig();
  const Icon = config.icon;

  // Check if submit button should be disabled
  const isSubmitDisabled =
    loading || (action === "reject" && !formData.remarks.trim());

  if (!isOpen || !application) return null;

  const getBusinessName = () => {
    if (application.applicationType === "doctor") {
      return application.doctor?.licenseNumber || "Doctor Application";
    } else {
      return application.pharmacy?.name || "Pharmacy Application";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div
            className={`${config.bgColor} ${config.borderColor} border-b px-6 py-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon size={24} className={config.iconColor} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {config.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getBusinessName()} • {application.applicationType}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 flex-1 overflow-y-auto">
            <div className="space-y-6 flex flex-col min-h-0">
              {/* Remarks Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {action === "approve"
                    ? "General Remarks"
                    : "Rejection Reason"}
                  {action === "reject" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <TextArea
                  value={formData.remarks}
                  onChangeHandler={(e) =>
                    handleInputChange("remarks", e.target.value)
                  }
                  placeholder={
                    action === "approve"
                      ? "Provide any additional feedback or instructions for the new provider (optional)..."
                      : "Please provide a clear reason for rejecting this application..."
                  }
                  additionalClasses={`max-h-32 overflow-y-auto ${
                    action === "reject" && !formData.remarks.trim()
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  error={
                    action === "reject" && !formData.remarks.trim()
                      ? "Rejection reason is required"
                      : ""
                  }
                  rows={3}
                  required={action === "reject"}
                />
              </div>

              {/* Document Reviews */}
              {application.documents && application.documents.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Document Reviews
                  </label>
                  <div className="space-y-4">
                    {application.documents.map((document, index) => (
                      <DocumentReviewCard
                        key={index}
                        document={document}
                        action={action}
                        formData={formData}
                        onDocumentReview={handleDocumentReview}
                        onPreview={setPreviewDocument}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Warning for rejections */}
              {action === "reject" && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      size={16}
                      className="text-yellow-600 dark:text-yellow-400"
                    />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Important
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Rejecting this application will prevent the user from
                    becoming a {application.applicationType}. They will need to
                    submit a new application if they wish to try again.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClickHandler={onClose}
              additionalClasses="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              isDisabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClickHandler={handleSubmit}
              additionalClasses={`flex-1 ${
                isSubmitDisabled
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : config.buttonColor
              } text-white`}
              isDisabled={isSubmitDisabled}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {action === "approve" ? "Approving..." : "Rejecting..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Icon size={16} />
                  {action === "approve"
                    ? "Approve Application"
                    : "Reject Application"}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Document Preview
                  </h3>
                  <button
                    onClick={() => setPreviewDocument(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {previewDocument.mimeType?.startsWith("image/") ? (
                  <img
                    src={previewDocument.fileUrl}
                    alt={previewDocument.fileName}
                    className="max-w-full h-auto mx-auto"
                  />
                ) : (
                  <iframe
                    src={previewDocument.fileUrl}
                    className="w-full h-96 border border-gray-200 dark:border-gray-700 rounded-lg"
                    title={previewDocument.fileName}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationReviewModal;
