import React, { useEffect } from "react";
import { X, Eye, Save, FileText, Image as ImageIcon } from "lucide-react";
import { Input } from "../index";

interface DocumentFile {
  id: string;
  file?: File;
  name?: string;
  size?: number;
  type?: string;
  preview?: string;
  documentName?: string;
  url?: string;
  fileType?: string;
}

interface EnhancedUploadedFileItemProps {
  file: DocumentFile;
  documentName?: string;
  error?: string;
  onNameChange: (fileId: string, name: string) => void;
  onRemove: (fileId: string) => void;
  onPreview: (file: DocumentFile) => void;
  isNewlyUploaded?: boolean;
  showPreview?: boolean;
  showRemove?: boolean;
  showSave?: boolean;
  className?: string;
}

const EnhancedUploadedFileItem: React.FC<EnhancedUploadedFileItemProps> = ({
  file,
  documentName,
  error,
  onNameChange,
  onRemove,
  onPreview,
  isNewlyUploaded = false,
  showPreview = true,
  showRemove = true,
  showSave = true,
  className = "",
}) => {
  // Focus the input when newly uploaded
  useEffect(() => {
    if (isNewlyUploaded) {
      const inputElement = document.getElementById(`docName-${file.id}`);
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [isNewlyUploaded, file.id]);

  const getFileIcon = (fileType?: string) => {
    if (fileType?.startsWith("image/")) {
      return <ImageIcon size={24} className="text-green-500" />;
    }
    return <FileText size={24} className="text-blue-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileSize = () => {
    if (file.size) return file.size;
    if (file.file) return file.file.size;
    return 0;
  };

  const getFileName = () => {
    return file.name || file.file?.name || "Unknown file";
  };

  const getFileType = () => {
    return (
      file.type ||
      file.fileType ||
      file.file?.type ||
      "application/octet-stream"
    );
  };

  return (
    <div
      className={`bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          {getFileIcon(getFileType())}
        </div>

        <div className="flex-grow min-w-0">
          <p className="font-semibold text-gray-800 dark:text-white truncate">
            {getFileName()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatFileSize(getFileSize())} • {getFileType()}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {showPreview && (
            <button
              type="button"
              onClick={() => onPreview(file)}
              className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Preview document"
            >
              <Eye size={16} />
            </button>
          )}

          {showRemove && (
            <button
              type="button"
              onClick={() => onRemove(file.id)}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Remove document"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <Input
              label="Document Name"
              type="text"
              name={`docName-${file.id}`}
              id={`docName-${file.id}`}
              placeholder="e.g. Medical License, Tax Certificate, etc."
              additionalClasses="border border-gray-300 dark:border-gray-600"
              value={documentName || ""}
              onChangeHandler={(e) => onNameChange(file.id, e.target.value)}
              error={
                isNewlyUploaded && !documentName
                  ? "Please specify which document this is."
                  : error
              }
              required={true}
              autoFocus={isNewlyUploaded}
            />
          </div>

          {showSave && (
            <button
              type="button"
              disabled={!documentName?.trim()}
              className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              title="Save document name"
            >
              <Save size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedUploadedFileItem;
