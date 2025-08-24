import React from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { Button } from "./index";

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
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
};

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onDrop,
  accept = defaultAccept,
  maxSize = 10485760, // 10MB
  multiple = true,
  disabled = false,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
        disabled
          ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
          : isDragActive
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <UploadCloud className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          {isDragActive ? "Drop the files here ..." : "Drag and Drop"}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          or browse for Files
        </p>
        <Button
          type="button"
          additionalClasses="primarybtn"
          disabled={disabled}
        >
          Browse Files
        </Button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Accepted formats: JPG, PNG, GIF, WebP, PDF, DOC, DOCX (Max 10MB each)
        </p>
      </div>
    </div>
  );
};

export default FileDropzone;
