import React from "react";
import { FileCheck, Download } from "lucide-react";
import { Button } from "@/components/ui";

interface Document {
  id: number;
  documentType: string;
  fileName: string;
}

interface ApplicationDocumentsCardProps {
  documents: Document[];
  onDownload: (documentId: number, fileName: string) => void;
}

const ApplicationDocumentsCard: React.FC<ApplicationDocumentsCardProps> = ({
  documents,
  onDownload,
}) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Documents
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <FileCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {document.documentType}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {document.fileName}
                </p>
              </div>
            </div>
            <Button
              onClick={() => onDownload(document.id, document.fileName)}
              variant="ghost"
              size="sm"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationDocumentsCard;
