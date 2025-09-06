import React from "react";
import { FileText, FileCheck, AlertTriangle } from "lucide-react";
import { DoctorAppointment } from "@/api/appointments";
import { formatDate } from "@/utils/dateUtils";

interface AppointmentDocumentsTabProps {
  appointment: DoctorAppointment;
  onPreviewDocument: (document: {
    id: string;
    url: string;
    name: string;
    documentName: string;
    fileType?: string;
    size?: number;
  }) => void;
}

const AppointmentDocumentsTab: React.FC<AppointmentDocumentsTabProps> = ({
  appointment,
  onPreviewDocument,
}) => {
  if (
    !appointment.patient?.documents ||
    appointment.patient.documents.length === 0
  ) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <FileText
          size={64}
          className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
        />
        <p className="text-lg font-medium mb-2">No documents uploaded</p>
        <p className="text-sm">
          This appointment doesn&apos;t have any supporting documents.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
          Patient Documents
        </h4>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FileCheck size={16} />
          {appointment.patient.documents.length} documents
        </div>
      </div>

      {appointment.patient.documents &&
      appointment.patient.documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointment.patient.documents.map((document, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-xs p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() =>
                onPreviewDocument({
                  id: document.id.toString(),
                  url: document.fileUrl,
                  name: document.fileName,
                  documentName: document.fileName,
                  fileType: document.mimeType,
                  size: document.fileSize,
                })
              }
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {document.fileName}
                  </h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {document.documentType}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {document.fileSize
                        ? `${(document.fileSize / 1024 / 1024).toFixed(2)} MB`
                        : "Unknown size"}
                    </span>
                  </div>
                  {document.expiryDate && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle size={12} className="text-yellow-500" />
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">
                        Expires: {formatDate(document.expiryDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <FileText
            size={64}
            className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
          />
          <p className="text-lg font-medium mb-2">No documents uploaded</p>
          <p className="text-sm">
            This appointment doesn&apos;t have any supporting documents.
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentDocumentsTab;
