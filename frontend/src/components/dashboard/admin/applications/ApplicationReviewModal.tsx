import React, { useState } from "react";
import { X, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import {
  Button,
  TextArea,
  ModalWrapper,
  FadeInContainer,
  DocumentPreview,
} from "@/components/ui";
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
        status:
          action === "approve" ? ("approved" as const) : ("rejected" as const),
        remarks: formData.remarks,
        ...(action === "reject" && {
          rejectionReason: formData.remarks,
        }),
        ...(formData.documentReviews.length > 0 && {
          documentReviews: formData.documentReviews,
        }),
      };

      await adminApi.reviewApplication(application.id, reviewData);

      // clear the form data
      setFormData({
        remarks: "",
        documentReviews: [],
      });
      // clear the preview document
      setPreviewDocument(null);

      toast.success(`Application ${action}d successfully`);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Review submission failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to ${action} application`;
      toast.error(errorMessage);
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
    <ModalWrapper>
      <div className="w-full max-w-2xl min-w-sm lg:min-w-lg mx-auto max-h-[90vh] flex flex-col p-2 lg:py-4">
        {/* Header - Fixed */}
        <div
          className={`${config.bgColor} ${config.borderColor} border-b px-6 py-4 flex-shrink-0`}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <FadeInContainer delay={200} duration={600}>
            <div className="space-y-6">
              {/* Remarks Field - Dynamic based on action */}
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
                  additionalClasses={` ${
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
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-sm p-4">
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
          </FadeInContainer>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
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

      {/* Document Preview Modal */}
      {previewDocument && (
        <DocumentPreview
          document={{
            id: previewDocument.id.toString(),
            url: previewDocument.fileUrl,
            name: previewDocument.fileName,
            documentName: previewDocument.fileName,
            fileType: previewDocument.mimeType,
            size: previewDocument.fileSize,
          }}
          isOpen={!!previewDocument}
          onClose={() => setPreviewDocument(null)}
        />
      )}
    </ModalWrapper>
  );
};

export default ApplicationReviewModal;
