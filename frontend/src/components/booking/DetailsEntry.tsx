import React, { useState, useCallback, useEffect } from "react";
import { useBooking } from "@/contexts/BookingContext";
import {
  EnhancedFileDropzone,
  EnhancedUploadedFileItem,
  DocumentPreview,
  DocumentData,
  DocumentFile,
  TextArea,
} from "../ui";
import { AlertCircle } from "lucide-react";

const DetailsEntry: React.FC = () => {
  const { state, dispatch } = useBooking();
  const [notes, setNotes] = useState(state.notes || "");
  const [previewDocument, setPreviewDocument] = useState<DocumentData | null>(
    null
  );
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [newlyUploadedFiles, setNewlyUploadedFiles] = useState(
    new Set<string>()
  );

  // Initialize notes from booking context
  useEffect(() => {
    if (state.notes) {
      setNotes(state.notes);
    }
  }, [state.notes]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up all object URLs when component unmounts
      if (state.medicalDocuments) {
        state.medicalDocuments.forEach((doc: any) => {
          if (doc.preview && doc.preview.startsWith("blob:")) {
            URL.revokeObjectURL(doc.preview);
          }
        });
      }
    };
  }, []);

  // Cleanup preview document blob URL when it changes
  useEffect(() => {
    return () => {
      if (
        previewDocument?.preview &&
        previewDocument.preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previewDocument.preview);
      }
    };
  }, [previewDocument]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);

    // Update booking state and mark step as completed
    dispatch({
      type: "UPDATE_STEP_DATA",
      payload: {
        stepIndex: 3,
        data: {
          notes: e.target.value,
          medicalDocuments: state.medicalDocuments,
        },
      },
    });

    // Mark step as completed (this step is optional)
    dispatch({
      type: "SET_STEP_COMPLETED",
      payload: { stepIndex: 3, completed: true },
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newDocuments: DocumentFile[] = acceptedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
        documentName: "",
      }));

      dispatch({
        type: "ADD_MEDICAL_DOCUMENTS",
        payload: newDocuments,
      });

      // Track newly uploaded files for UX focus
      const newFileIds = newDocuments.map((doc) => doc.id);
      setNewlyUploadedFiles((prev) => new Set([...prev, ...newFileIds]));
    },
    [dispatch]
  );

  const handleRemoveFile = (documentId: string) => {
    // Find the document to get its preview URL for cleanup
    const documentToRemove = state.medicalDocuments.find(
      (doc: any) => doc.id === documentId
    );

    // Clean up the object URL if it exists
    if (
      documentToRemove?.preview &&
      documentToRemove.preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(documentToRemove.preview);
    }

    const updatedDocuments = state.medicalDocuments.filter(
      (doc: any) => doc.id !== documentId
    );
    dispatch({
      type: "SET_MEDICAL_DOCUMENTS",
      payload: updatedDocuments,
    });

    // Clear local errors for this document
    const newLocalErrors = { ...localErrors };
    delete newLocalErrors[documentId];
    setLocalErrors(newLocalErrors);

    // Remove from newly uploaded files
    setNewlyUploadedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(documentId);
      return newSet;
    });
  };

  const handleDocumentNameChange = (documentId: string, name: string) => {
    const updatedDocuments = state.medicalDocuments.map((doc: any) =>
      doc.id === documentId ? { ...doc, documentName: name } : doc
    );
    dispatch({
      type: "SET_MEDICAL_DOCUMENTS",
      payload: updatedDocuments,
    });
  };

  const handlePreview = (file: DocumentFile) => {
    // Ensure we have a valid preview URL
    const previewUrl =
      file.preview || (file.file ? URL.createObjectURL(file.file) : undefined);

    const documentData = {
      id: file.id,
      file: file.file,
      name: file.name,
      documentName: file.documentName,
      fileType: file.type, // This should be the MIME type like "image/jpeg"
      type: file.type, // Add this for compatibility
      size: file.size,
      preview: previewUrl, // This is the URL.createObjectURL() result
    };

    setPreviewDocument(documentData);
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
        <TextArea
          value={notes}
          required={false}
          label="Notes (Optional)"
          onChangeHandler={handleNotesChange}
          placeholder="Describe your symptoms, concerns, or any additional information you'd like to share with your doctor..."
          additionalClasses="border border-line_clr"
          rows={4}
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

        <EnhancedFileDropzone
          onDrop={onDrop}
          accept={{
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [".docx"],
          }}
          maxSize={5 * 1024 * 1024} // 5MB
          disabled={false}
        />

        {/* Document List */}
        {state.medicalDocuments && state.medicalDocuments.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploaded Documents ({state.medicalDocuments.length}/5)
            </h4>

            {state.medicalDocuments.map((doc: any) => (
              <EnhancedUploadedFileItem
                key={doc.id}
                file={doc}
                documentName={doc.documentName || ""}
                onRemove={handleRemoveFile}
                onNameChange={handleDocumentNameChange}
                isNewlyUploaded={newlyUploadedFiles.has(doc.id)}
                error={localErrors[doc.id]}
                onPreview={handlePreview}
              />
            ))}
          </div>
        )}

        {/* Document Preview Modal */}
        {previewDocument && (
          <DocumentPreview
            document={previewDocument}
            isOpen={!!previewDocument}
            onClose={() => {
              // Clean up the preview blob URL if it was created in handlePreview
              if (
                previewDocument.preview &&
                previewDocument.preview.startsWith("blob:")
              ) {
                URL.revokeObjectURL(previewDocument.preview);
              }
              setPreviewDocument(null);
            }}
          />
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
    </div>
  );
};

export default DetailsEntry;
