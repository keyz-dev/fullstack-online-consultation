import React, { useState, useRef, useEffect } from "react";
import { FileText, Download } from "lucide-react";
import PDFViewer from "./PDFViewer";

interface DocumentData {
  id: string;
  url?: string;
  file?: File;
  name?: string;
  documentName?: string;
  originalName?: string;
  fileType?: string;
  type?: string;
  size?: number;
  preview?: string;
}

interface DocumentContentProps {
  documentData: DocumentData;
  isImage: boolean;
  isPDF: boolean;
  isDocument: boolean;
  isCloudinaryURL: boolean;
  currentPage: number;
  zoom: number;
  rotation: number;
  isLoading: boolean;
  error: string | null;
  onPDFLoad: (data: { totalPages: number }) => void;
  onIframeLoad: () => void;
  onIframeError: () => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
}

const DocumentContent: React.FC<DocumentContentProps> = ({
  documentData,
  isImage,
  isPDF,
  isDocument,
  isCloudinaryURL,
  currentPage,
  zoom,
  rotation,
  isLoading,
  error,
  onPDFLoad,
  onIframeLoad,
  onIframeError,
  onError,
  onLoading,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState(false);

  // Utility function to handle Cloudinary URLs based on file type
  const getCloudinaryUrl = (url: string, fileType?: string) => {
    if (!url || !isCloudinaryURL) return url;

    try {
      const urlParts = url.split("/upload/");
      if (urlParts.length !== 2) return url;

      const baseUrl = urlParts[0] + "/upload/";
      const publicId = urlParts[1];

      // Handle different file types
      if (fileType?.startsWith("image/")) {
        // Images: optimize for web display
        return `${baseUrl}f_auto,q_auto,w_auto/${publicId}`;
      } else if (fileType === "application/pdf") {
        // PDFs: force download for better compatibility
        return `${baseUrl}fl_attachment/${publicId}`;
      } else {
        // Other documents: use original URL
        return url;
      }
    } catch (error) {
      console.error("Error processing Cloudinary URL:", error);
      return url;
    }
  };

  // Process URLs for different file types
  const getOptimizedUrl = () => {
    if (!documentData?.url) return null;

    return getCloudinaryUrl(documentData.url, documentData.fileType);
  };

  const handleImageLoad = () => {
    onLoading(false);
  };

  const handleImageError = () => {
    onLoading(false);
    onError("Image failed to load");
  };

  const handleIframeLoad = () => {
    onLoading(false);
    setIframeError(false);
  };

  const handleIframeError = () => {
    onLoading(false);
    setIframeError(true);
    onError("PDF preview not available. Please download to view.");
  };

  const handleDownload = async () => {
    try {
      // If we have a file object, use it
      if (documentData.file) {
        const url = URL.createObjectURL(documentData.file);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          documentData.documentName || documentData.name || "document";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }

      // If we have a URL, fetch and download
      if (documentData.url) {
        const response = await fetch(documentData.url);
        if (!response.ok) throw new Error("Failed to fetch file");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download =
          documentData.documentName ||
          documentData.originalName ||
          documentData.name ||
          "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      if (documentData.url) {
        window.open(documentData.url, "_blank");
      }
    }
  };

  // Reset iframe error when document changes - SIMPLIFIED like frontend_reference
  useEffect(() => {
    setIframeError(false);
    onLoading(true); // Set loading to true when document changes

    // Simple approach like frontend_reference - no URL accessibility check
    // Let the browser handle loading naturally
  }, [documentData, onLoading, isImage, isPDF, isDocument]);

  return (
    <div className="h-full overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Loading document...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10">
          <div className="text-center">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">{error}</p>
            {(documentData.url || documentData.file) && (
              <div className="space-y-2">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Download size={16} />
                  Try Download
                </button>
                {documentData.url && (
                  <button
                    onClick={() => window.open(documentData.url, "_blank")}
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <FileText size={16} />
                    Open in New Tab
                  </button>
                )}
                {isCloudinaryURL && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <p>
                      This document is stored on Cloudinary. If it&apos;s not
                      accessible, it may have been moved or deleted.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="h-full overflow-auto bg-gray-100 dark:bg-gray-900">
        {isImage ? (
          <div className="flex items-center justify-center min-h-full p-4">
            <img
              src={
                // For local files, use preview URL first, then fallback to optimized URL
                documentData.preview ||
                getOptimizedUrl() ||
                documentData.url ||
                (documentData.file
                  ? URL.createObjectURL(documentData.file)
                  : undefined)
              }
              alt={
                documentData.documentName ||
                documentData.originalName ||
                documentData.name
              }
              className="max-w-full max-h-full object-contain shadow-lg"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: "transform 0.2s ease-in-out",
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        ) : isPDF ? (
          <div className="w-full h-full">
            {/* Simple iframe approach for PDFs like frontend_reference */}
            <iframe
              ref={iframeRef}
              src={
                // For local files, use preview URL first, then fallback to optimized URL
                documentData.preview ||
                getOptimizedUrl() ||
                documentData.url ||
                (documentData.file
                  ? URL.createObjectURL(documentData.file)
                  : undefined)
              }
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={
                documentData.documentName ||
                documentData.originalName ||
                documentData.name
              }
            />

            {/* Fallback for Cloudinary PDFs that can't be displayed */}
            {isCloudinaryURL && !iframeError && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10"
                style={{ display: isLoading ? "flex" : "none" }}
              >
                <div className="text-center">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Loading PDF...
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    If preview doesn&apos;t load, use download link below
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : isDocument ? (
          <div className="w-full h-full">
            <iframe
              ref={iframeRef}
              src={
                // For local files, use preview URL first, then fallback to URL
                documentData.preview ||
                documentData.url ||
                (documentData.file
                  ? URL.createObjectURL(documentData.file)
                  : undefined)
              }
              className="w-full h-full"
              onLoad={onIframeLoad}
              onError={onIframeError}
              title={
                documentData.documentName ||
                documentData.originalName ||
                documentData.name
              }
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Preview not available for this file type
              </p>
              {(documentData.url || documentData.file) && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Download size={16} />
                  Download to view
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentContent;
