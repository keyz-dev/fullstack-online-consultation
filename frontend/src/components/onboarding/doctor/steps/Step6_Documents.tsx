import React, { useState, useCallback, useEffect } from "react";
import { useDoctorApplication } from "../../../../contexts/DoctorApplicationContext";
import {
  EnhancedFileDropzone,
  EnhancedUploadedFileItem,
  DocumentPreview,
  DocumentData,
  DocumentFile,
  StepNavButtons,
} from "../../../ui";
import { ChevronDown, ChevronUp } from "lucide-react";

const Step6_Documents = () => {
  const { doctorData, updateField, nextStep, prevStep, isLoading } =
    useDoctorApplication();

  const [previewDocument, setPreviewDocument] = useState<DocumentData | null>(
    null
  );
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [newlyUploadedFiles, setNewlyUploadedFiles] = useState(
    new Set<string>()
  );
  const [showTips, setShowTips] = useState(false);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up all object URLs when component unmounts
      if (doctorData.documents) {
        doctorData.documents.forEach((doc) => {
          if (doc.preview && doc.preview.startsWith("blob:")) {
            URL.revokeObjectURL(doc.preview);
          }
        });
      }
    };
  }, []);

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

      updateField("documents", [
        ...(doctorData.documents || []),
        ...newDocuments,
      ]);

      // Track newly uploaded files for UX focus
      const newFileIds = newDocuments.map((doc) => doc.id);
      setNewlyUploadedFiles((prev) => new Set([...prev, ...newFileIds]));
    },
    [doctorData.documents, updateField]
  );

  const handleRemoveFile = (documentId: string) => {
    // Find the document to get its preview URL for cleanup
    const documentToRemove = doctorData.documents.find(
      (doc) => doc.id === documentId
    );

    // Clean up the object URL if it exists
    if (
      documentToRemove?.preview &&
      documentToRemove.preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(documentToRemove.preview);
    }

    const updatedDocuments = doctorData.documents.filter(
      (doc) => doc.id !== documentId
    );
    updateField("documents", updatedDocuments);

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
    const updatedDocuments = doctorData.documents.map((doc) =>
      doc.id === documentId ? { ...doc, documentName: name } : doc
    );
    updateField("documents", updatedDocuments);

    // Clear error when name is provided
    if (name.trim()) {
      const newLocalErrors = { ...localErrors };
      delete newLocalErrors[documentId];
      setLocalErrors(newLocalErrors);

      // Remove from newly uploaded files when user starts typing
      setNewlyUploadedFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const handlePreview = (file: DocumentFile) => {
    setPreviewDocument({
      id: file.id,
      file: file.file,
      name: file.name,
      documentName: file.documentName,
      fileType: file.type, // This should be the MIME type like "image/jpeg"
      type: file.type, // Add this for compatibility
      size: file.size,
      preview: file.preview, // This is the URL.createObjectURL() result
    });
  };

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    doctorData.documents.forEach((doc) => {
      if (!doc.documentName.trim()) {
        newErrors[doc.id] = "Please provide a document name.";
        hasErrors = true;
      }
    });

    setLocalErrors(newErrors);

    if (!hasErrors && doctorData.documents.length > 0) {
      nextStep();
    }
  };

  const canContinue =
    doctorData.documents.length > 0 &&
    doctorData.documents.every((doc) => doc.documentName.trim());

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Medical Verification Documents
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mt-2">
          Upload your medical documents for verification. Accepted formats:
          Images (JPG, PNG, GIF, WebP) and PDF files.
        </p>
      </div>

      {/* File Dropzone */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Upload Documents
        </h2>
        <EnhancedFileDropzone onDrop={onDrop} />
      </div>

      {/* Uploaded Documents */}
      {doctorData.documents && doctorData.documents.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Uploaded Documents ({doctorData.documents.length})
          </h2>
          <div className="space-y-4">
            {doctorData.documents.map((doc) => (
              <EnhancedUploadedFileItem
                key={doc.id}
                file={doc}
                documentName={doc.documentName}
                error={localErrors[doc.id]}
                onNameChange={handleDocumentNameChange}
                onRemove={handleRemoveFile}
                onPreview={handlePreview}
                isNewlyUploaded={newlyUploadedFiles.has(doc.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Document Tips - Collapsible */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Document Upload Tips
          </h3>
          {showTips ? (
            <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
          )}
        </button>

        {showTips && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Ensure documents are clear and legible</li>
              <li>• Upload high-resolution scans or photos</li>
              <li>• Include all pages of multi-page documents</li>
              <li>• Verify document names match the content</li>
              <li>• Keep file sizes under 10MB each</li>
              <li>
                • Accepted formats: Images (JPG, PNG, GIF, WebP), PDF, DOC,
                DOCX, TXT
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8">
        <StepNavButtons
          onBack={prevStep}
          onContinue={handleContinue}
          canContinue={canContinue}
          isLoading={isLoading}
          onBackText="Back"
          onContinueText="Continue"
        />
      </div>

      {/* Enhanced Document Preview Modal */}
      {previewDocument && (
        <DocumentPreview
          document={previewDocument}
          isOpen={true}
          onClose={() => setPreviewDocument(null)}
        />
      )}
    </div>
  );
};

export default Step6_Documents;
