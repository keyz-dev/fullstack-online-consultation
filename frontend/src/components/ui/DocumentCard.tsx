import React from "react";
import { Eye, Download, FileText } from "lucide-react";

interface Document {
  url?: string;
  preview?: string;
  documentName?: string;
  originalName?: string;
  name?: string;
  fileType?: string;
  type?: string;
  size?: number;
  adminRemarks?: string;
}

interface DocumentCardProps {
  document: Document;
  status?: "approved" | "rejected" | "pending";
  onPreview?: (document: Document) => void;
  showActions?: boolean;
  showStatus?: boolean;
  compact?: boolean;
  className?: string;
}

export default function DocumentCard({
  document,
  status,
  onPreview,
  showActions = true,
  showStatus = true,
  compact = false,
  className = "",
}: DocumentCardProps) {
  const isImage =
    document.fileType?.startsWith("image/") ||
    document.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
    document.type?.startsWith("image/");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${className}`}
    >
      <div className={`flex items-start gap-4 ${compact ? "gap-3" : "gap-4"}`}>
        {/* Document Preview */}
        <div className="flex-shrink-0">
          <div
            className={`bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity ${
              compact ? "w-12 h-12" : "w-16 h-16"
            }`}
          >
            {isImage ? (
              <img
                src={document.url || document.preview}
                alt={
                  document.documentName ||
                  document.originalName ||
                  document.name
                }
                className="w-full h-full object-cover"
                onClick={() => onPreview?.(document)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const nextSibling = target.nextSibling as HTMLElement;
                  if (nextSibling) {
                    nextSibling.style.display = "flex";
                  }
                }}
              />
            ) : (
              <FileText size={compact ? 20 : 24} className="text-gray-400" />
            )}
            {/* Fallback for failed images */}
            <div className="hidden items-center justify-center w-full h-full">
              <FileText size={compact ? 16 : 20} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4
                className={`font-medium text-gray-900 truncate ${
                  compact ? "text-sm" : "text-sm"
                }`}
              >
                {document.documentName ||
                  document.originalName ||
                  document.name}
              </h4>
              <p className={`text-gray-500 ${compact ? "text-xs" : "text-xs"}`}>
                {document.fileType} •{" "}
                {document.size
                  ? `${(document.size / 1024 / 1024).toFixed(2)} MB`
                  : ""}
              </p>
            </div>
            {showStatus && status && (
              <span
                className={`ml-2 px-2 py-1 text-xs rounded-full border ${getStatusColor(
                  status
                )}`}
              >
                {status}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex items-center gap-2">
              {onPreview && (
                <button
                  onClick={() => onPreview(document)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition-colors"
                >
                  <Eye size={12} />
                  Preview
                </button>
              )}
              {document.url && (
                <a
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  <Download size={12} />
                  Download
                </a>
              )}
            </div>
          )}

          {/* Admin Remarks */}
          {document.adminRemarks && (
            <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
              <strong>Admin Note:</strong> {document.adminRemarks}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
