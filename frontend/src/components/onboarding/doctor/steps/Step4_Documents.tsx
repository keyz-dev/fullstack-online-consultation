import React, { useState, useCallback } from "react";
import { useDoctorApplication } from "../../../../contexts/DoctorApplicationContext";
import {
  FileDropzone,
  UploadedFileItem,
  FilePreviewModal,
  StepNavButtons,
} from "../../../ui";

const Step4_Documents = () => {
  const { doctorData, updateField, nextStep, prevStep, isLoading } =
    useDoctorApplication();

  const [previewFile, setPreviewFile] = useState<any>(null);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [newlyUploadedFiles, setNewlyUploadedFiles] = useState(
    new Set<string>()
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newDocuments = acceptedFiles.map((file) => ({
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
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-4">
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
      <FileDropzone onDrop={onDrop} />

      {/* Uploaded Documents */}
      {doctorData.documents && doctorData.documents.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Uploaded Documents
          </h2>
          <div className="space-y-4">
            {doctorData.documents.map((doc) => (
              <UploadedFileItem
                key={doc.id}
                file={doc}
                documentName={doc.documentName}
                error={localErrors[doc.id]}
                onNameChange={handleDocumentNameChange}
                onRemove={handleRemoveFile}
                onPreview={setPreviewFile}
                isNewlyUploaded={newlyUploadedFiles.has(doc.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Document Requirements */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          Required Documents:
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Medical License</li>
          <li>• Medical Degree Certificate</li>
          <li>• Professional Certifications</li>
          <li>• Reference Letters (optional)</li>
          <li>• Any other relevant medical credentials</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <StepNavButtons
        onBack={prevStep}
        onContinue={handleContinue}
        canContinue={canContinue}
        isLoading={isLoading}
        onBackText="Back"
        onContinueText="Continue"
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};

export default Step4_Documents;
