import React from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { Button } from "../index";

interface EnhancedFileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

const defaultAccept = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
};

const EnhancedFileDropzone: React.FC<EnhancedFileDropzoneProps> = ({
  onDrop,
  accept = defaultAccept,
  maxSize = 10485760, // 10MB
  multiple = true,
  disabled = false,
  className = "",
}) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple,
      disabled,
    });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : isDragReject
          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
          : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <UploadCloud
          className={`w-12 h-12 mb-4 ${
            isDragActive
              ? "text-blue-500"
              : isDragReject
              ? "text-red-500"
              : "text-gray-400 dark:text-gray-500"
          }`}
        />

        <p
          className={`text-lg font-medium mb-2 ${
            isDragActive
              ? "text-blue-600 dark:text-blue-400"
              : isDragReject
              ? "text-red-600 dark:text-red-400"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {isDragActive
            ? "Drop the files here..."
            : isDragReject
            ? "Invalid file type"
            : "Drag and drop files here"}
        </p>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          or click to browse files
        </p>

        <Button
          type="button"
          additionalClasses="primarybtn"
          disabled={disabled}
        >
          Browse Files
        </Button>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>
            Accepted formats: Images (JPG, PNG, GIF, WebP), PDF, DOC, DOCX, TXT
          </p>
          <p>Maximum file size: {formatFileSize(maxSize)}</p>
          {multiple && <p>You can upload multiple files</p>}
        </div>
      </div>
    </div>
  );
};

export default EnhancedFileDropzone;
