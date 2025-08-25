import React from "react";
import { X, Download, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../index";

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

interface DocumentHeaderProps {
  documentData: DocumentData;
  isFullscreen: boolean;
  onFullscreen: () => void;
  onClose: () => void;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  documentData,
  isFullscreen,
  onFullscreen,
  onClose,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

  const getFileType = () => {
    if (documentData.fileType) return documentData.fileType;
    if (documentData.type) return documentData.type;
    if (documentData.name) {
      const ext = documentData.name.split(".").pop()?.toLowerCase();
      switch (ext) {
        case "pdf":
          return "application/pdf";
        case "jpg":
        case "jpeg":
          return "image/jpeg";
        case "png":
          return "image/png";
        case "gif":
          return "image/gif";
        case "webp":
          return "image/webp";
        case "doc":
          return "application/msword";
        case "docx":
          return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        default:
          return "application/octet-stream";
      }
    }
    return "application/octet-stream";
  };

  const getFileSize = () => {
    if (documentData.size) return documentData.size;
    if (documentData.file) return documentData.file.size;
    return 0;
  };

  const getFileName = () => {
    return (
      documentData.documentName ||
      documentData.originalName ||
      documentData.name ||
      "Document"
    );
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {getFileName()}
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{getFileType()}</span>
          <span>•</span>
          <span>{formatFileSize(getFileSize())}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        <Button
          onClick={handleDownload}
          additionalClasses="secondarybtn"
          type="button"
        >
          <Download size={16} className="mr-2" />
          Download
        </Button>

        <button
          onClick={onFullscreen}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>

        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default DocumentHeader;
