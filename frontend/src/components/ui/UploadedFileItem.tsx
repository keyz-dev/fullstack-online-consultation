import React, { useState } from "react";
import { X, FileText, Image as LucideImage, Eye } from "lucide-react";
import { Input } from "./index";

interface UploadedFileItemProps {
  file: {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    preview?: string;
    documentName: string;
  };
  documentName: string;
  error?: string;
  onNameChange: (documentId: string, name: string) => void;
  onRemove: (documentId: string) => void;
  onPreview: (file: unknown) => void;
  isNewlyUploaded?: boolean;
}

const UploadedFileItem: React.FC<UploadedFileItemProps> = ({
  file,
  documentName,
  error,
  onNameChange,
  onRemove,
  onPreview,
  isNewlyUploaded = false,
}) => {
  const [isEditing, setIsEditing] = useState(isNewlyUploaded);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = () => {
    if (file.type.startsWith("image/")) {
      return <LucideImage size={20} className="text-blue-500" />;
    }
    return <FileText size={20} className="text-gray-500" />;
  };

  const handleNameChange = (value: string) => {
    onNameChange(file.id, value);
  };

  const handleRemove = () => {
    onRemove(file.id);
  };

  const handlePreview = () => {
    onPreview(file);
  };

  return (
    <div
      className={`border rounded-lg p-4 ${
        error
          ? "border-red-300 dark:border-red-600"
          : "border-gray-200 dark:border-gray-600"
      } ${isNewlyUploaded ? "ring-2 ring-blue-200 dark:ring-blue-800" : ""}`}
    >
      <div className="flex items-start space-x-3">
        {/* File Icon */}
        <div className="flex-shrink-0">{getFileIcon()}</div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {file.name}
            </p>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePreview}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Preview file"
              >
                <Eye size={16} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
                title="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {formatFileSize(file.size)} • {file.type}
          </p>

          {/* Document Name Input */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Document Name *
            </label>
            <Input
              value={documentName}
              onChangeHandler={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Medical License, Certification, etc."
              error={error}
              additionalClasses="text-sm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadedFileItem;
