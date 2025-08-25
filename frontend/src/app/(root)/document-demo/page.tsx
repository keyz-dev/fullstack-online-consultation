"use client";

import React, { useState, useCallback } from "react";
import {
  DocumentPreview,
  DocumentData,
  EnhancedFileDropzone,
  EnhancedUploadedFileItem,
  DocumentFile,
} from "@/components/ui";
import { ChevronDown, ChevronUp } from "lucide-react";

const DocumentDemoPage = () => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [previewDocument, setPreviewDocument] = useState<DocumentData | null>(
    null
  );
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [newlyUploadedFiles, setNewlyUploadedFiles] = useState(
    new Set<string>()
  );
  const [showTips, setShowTips] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newDocuments = acceptedFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      documentName: "",
    }));

    setDocuments((prev) => [...prev, ...newDocuments]);

    // Track newly uploaded files for UX focus
    const newFileIds = newDocuments.map((doc) => doc.id);
    setNewlyUploadedFiles((prev) => new Set([...prev, ...newFileIds]));
  }, []);

  const handleRemoveFile = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));

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
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, documentName: name } : doc
      )
    );

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
      fileType: file.type,
      size: file.size,
      preview: file.preview,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Document Review & Upload Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test the enhanced document review and upload components
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
        {documents.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Uploaded Documents ({documents.length})
            </h2>
            <div className="space-y-4">
              {documents.map((doc) => (
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

        {/* Demo Info - Collapsible */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Demo Features & Tips
            </h3>
            {showTips ? (
              <ChevronUp
                size={20}
                className="text-gray-500 dark:text-gray-400"
              />
            ) : (
              <ChevronDown
                size={20}
                className="text-gray-500 dark:text-gray-400"
              />
            )}
          </button>

          {showTips && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Features
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Drag & drop file upload</li>
                    <li>• File type validation</li>
                    <li>• Document naming with auto-focus</li>
                    <li>• Advanced document preview</li>
                    <li>• Zoom, rotate, and navigation controls</li>
                    <li>• Dark mode support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Test Files
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Images (JPG, PNG, GIF, WebP)</li>
                    <li>• PDF documents</li>
                    <li>• Word documents (DOC, DOCX)</li>
                    <li>• Text files (TXT)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Document Preview Modal */}
        {previewDocument && (
          <DocumentPreview
            document={previewDocument}
            isOpen={true}
            onClose={() => setPreviewDocument(null)}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentDemoPage;
