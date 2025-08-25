import React from "react";
import { Eye, Download, FileText } from "lucide-react";
import { TextArea } from "@/components/ui";
import { ApplicationDocument, DocumentReview } from "@/api/admin";

interface DocumentReviewCardProps {
  document: ApplicationDocument;
  action: "approve" | "reject";
  formData: {
    documentReviews: DocumentReview[];
  };
  onDocumentReview: (
    documentId: number,
    isApproved: boolean,
    remarks: string
  ) => void;
  onPreview: (document: ApplicationDocument) => void;
}

const DocumentReviewCard: React.FC<DocumentReviewCardProps> = ({
  document,
  action,
  formData,
  onDocumentReview,
  onPreview,
}) => {
  const isImage =
    document.mimeType?.startsWith("image/") ||
    document.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  const currentReview = formData.documentReviews.find(
    (doc) => doc.documentId === document.id
  );

  // Check if document URL is accessible (basic check)
  const isUrlAccessible = document.fileUrl && !document.fileUrl.includes("404");

  const handleDownload = async () => {
    try {
      const response = await fetch(document.fileUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = window.document.createElement("a");
      link.href = url;
      link.download = document.fileName || "document";
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(document.fileUrl, "_blank");
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-start gap-4">
        {/* Document Preview */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
            {isImage ? (
              <img
                src={document.fileUrl}
                alt={document.fileName}
                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onPreview(document)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onPreview(document)}
              >
                <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {document.fileName}
                </h4>
                {!isUrlAccessible && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
                    Not Accessible
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {document.documentType} •{" "}
                {document.fileSize
                  ? `${(document.fileSize / 1024 / 1024).toFixed(2)} MB`
                  : "Unknown size"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => onPreview(document)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Preview document"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={handleDownload}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Download document"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => window.open(document.fileUrl, "_blank")}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Open in new tab"
              >
                <FileText size={16} />
              </button>
            </div>
          </div>

          {/* Document Review Actions */}
          <div className="flex gap-2 mb-3">
            {!isUrlAccessible && (
              <div className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                ⚠️ Document not accessible - review with caution
              </div>
            )}
            {action === "approve" ? (
              // For approval, only show approve button
              <button
                onClick={() =>
                  onDocumentReview(
                    document.id,
                    true,
                    currentReview?.remarks || ""
                  )
                }
                disabled={!isUrlAccessible}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  currentReview?.isApproved === true
                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                    : !isUrlAccessible
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-600 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-600"
                }`}
              >
                ✓ Approve
              </button>
            ) : (
              // For rejection, show both approve and reject
              <>
                <button
                  onClick={() =>
                    onDocumentReview(
                      document.id,
                      true,
                      currentReview?.remarks || ""
                    )
                  }
                  disabled={!isUrlAccessible}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    currentReview?.isApproved === true
                      ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                      : !isUrlAccessible
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-600 cursor-not-allowed"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    onDocumentReview(
                      document.id,
                      false,
                      currentReview?.remarks || ""
                    )
                  }
                  disabled={!isUrlAccessible}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    currentReview?.isApproved === false
                      ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                      : !isUrlAccessible
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-600 cursor-not-allowed"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  Reject
                </button>
              </>
            )}
          </div>

          {/* Review Notes */}
          {currentReview && (
            <TextArea
              value={currentReview.remarks || ""}
              onChangeHandler={(e) =>
                onDocumentReview(
                  document.id,
                  currentReview.isApproved,
                  e.target.value
                )
              }
              placeholder="Add notes about this document (optional)..."
              additionalClasses="text-xs border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={2}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentReviewCard;
