import React from "react";
import {
  FileText,
  Download,
  Eye,
  File,
  FileImage,
  FileVideo,
  FileArchive,
} from "lucide-react";
import { PatientAppointment } from "@/api/appointments";

interface PatientAppointmentDocumentsTabProps {
  appointment: PatientAppointment;
  onPreviewDocument: (document: {
    id: string;
    url: string;
    name: string;
    documentName: string;
    fileType?: string;
    size?: number;
  }) => void;
}

const PatientAppointmentDocumentsTab: React.FC<
  PatientAppointmentDocumentsTabProps
> = ({ appointment, onPreviewDocument }) => {
  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File className="w-5 h-5" />;

    if (fileType.startsWith("image/")) return <FileImage className="w-5 h-5" />;
    if (fileType.startsWith("video/")) return <FileVideo className="w-5 h-5" />;
    if (fileType.includes("pdf")) return <FileText className="w-5 h-5" />;
    if (fileType.includes("zip") || fileType.includes("rar"))
      return <FileArchive className="w-5 h-5" />;

    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";

    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDownload = (document: unknown) => {
    const link = document.createElement("a");
    link.href = document.fileUrl;
    link.download = document.fileName || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (document: unknown) => {
    onPreviewDocument({
      id: document.id.toString(),
      url: document.fileUrl,
      name: document.fileName,
      documentName: document.documentType,
      fileType: document.mimeType,
      size: document.fileSize,
    });
  };

  // Check if appointment has documents
  const hasDocuments =
    appointment.documents && appointment.documents.length > 0;

  if (!hasDocuments) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <FileText
          size={64}
          className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
        />
        <p className="text-lg font-medium mb-2">No documents uploaded</p>
        <p className="text-sm">
          No documents have been uploaded for this appointment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Documents Header */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText size={20} className="text-blue-600 dark:text-blue-400" />
          Appointment Documents
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Documents uploaded for this appointment. You can preview or download
          them.
        </p>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {appointment.documents.map((document) => (
          <div
            key={document.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="text-blue-500 dark:text-blue-400">
                  {getFileIcon(document.mimeType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-900 dark:text-white truncate">
                    {document.fileName}
                  </h5>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{document.documentType}</span>
                    <span>•</span>
                    <span>{formatFileSize(document.fileSize)}</span>
                    <span>•</span>
                    <span>{document.mimeType}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePreview(document)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Preview document"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleDownload(document)}
                  className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  title="Download document"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Types Summary */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 dark:text-white mb-3">
          Document Summary
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              Total Documents:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {appointment.documents.length}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              Total Size:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {formatFileSize(
                appointment.documents.reduce(
                  (total, doc) => total + (doc.fileSize || 0),
                  0
                )
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Types:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {
                new Set(appointment.documents.map((doc) => doc.documentType))
                  .size
              }
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Uploaded:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {new Date(appointment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointmentDocumentsTab;
