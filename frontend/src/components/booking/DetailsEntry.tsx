import React, { useState, useRef } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { FileText, Upload, X, File, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

const DetailsEntry: React.FC = () => {
  const { state, dispatch } = useBooking();
  const [notes, setNotes] = useState(state.notes || "");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    state.medicalDocuments || []
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Validate file types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      toast.error(
        `Invalid file type(s): ${invalidFiles.map((f) => f.name).join(", ")}`
      );
      return;
    }

    // Validate file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error(
        `File(s) too large (max 5MB each): ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    // Validate total number of files (max 5)
    if (uploadedFiles.length + files.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }

    // Process files
    files.forEach((file) => {
      const fileId = `file_${Date.now()}_${Math.random()}`;
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
          setUploadedFiles((prev) => [...prev, uploadedFile]);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadedFiles((prev) => [...prev, uploadedFile]);
      }
    });

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    dispatch({
      type: "UPDATE_STEP_DATA",
      payload: {
        stepIndex: 3,
        data: {
          notes: notes,
          medicalDocuments: uploadedFiles,
        },
      },
    });

    dispatch({
      type: "SET_STEP_COMPLETED",
      payload: { stepIndex: 3, completed: true },
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return "🖼️";
    } else if (type === "application/pdf") {
      return "📄";
    } else if (type.includes("word")) {
      return "📝";
    } else {
      return "📎";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Additional Details
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Add notes and upload medical documents to help your doctor better
        understand your situation.
      </p>

      {/* Notes Section */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Describe your symptoms, concerns, or any additional information you'd like to share with your doctor..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {notes.length}/1000 characters
        </p>
      </div>

      {/* Medical Documents Section */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Medical Documents (Optional)
        </label>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            PDF, DOC, DOCX, JPG, PNG, WEBP (max 5MB each, up to 5 files)
          </p>

          <button
            onClick={handleUploadClick}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            Choose Files
          </button>
        </div>

        {/* File List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploaded Files ({uploadedFiles.length}/5)
            </h4>

            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getFileIcon(file.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Information Alert */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Privacy & Security
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              All uploaded documents are encrypted and securely stored. They
              will only be accessible to your doctor during the consultation.
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleContinue}
          className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default DetailsEntry;
