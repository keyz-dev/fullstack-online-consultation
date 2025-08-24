import React from "react";
import { X, Download } from "lucide-react";
import { Button } from "./index";

interface FilePreviewModalProps {
  file: {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    preview?: string;
    documentName: string;
  } | null;
  onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
}) => {
  if (!file) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(file.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderPreview = () => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="flex justify-center">
          <img
            src={file.preview || URL.createObjectURL(file.file)}
            alt={file.name}
            className="max-w-full max-h-96 object-contain rounded-lg"
          />
        </div>
      );
    }

    if (file.type === "application/pdf") {
      return (
        <div className="flex justify-center">
          <iframe
            src={file.preview || URL.createObjectURL(file.file)}
            className="w-full h-96 border rounded-lg"
            title={file.name}
          />
        </div>
      );
    }

    // For other file types, show file info
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {file.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatFileSize(file.size)} • {file.type}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Preview not available for this file type
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {file.documentName || file.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)} • {file.type}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleDownload}
                additionalClasses="secondarybtn"
                type="button"
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">{renderPreview()}</div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
