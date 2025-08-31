import React, { useCallback, useState } from 'react';
import { Upload, FileText, Image, X, Download, Eye } from 'lucide-react';
import Button from '../ui/Button';

interface SharedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface FileSharePanelProps {
  sharedFiles: SharedFile[];
  onFileUpload: (files: FileList) => void;
  onFileRemove: (fileId: string) => void;
  userRole: string;
  isUploading: boolean;
}

export const FileSharePanel: React.FC<FileSharePanelProps> = ({
  sharedFiles,
  onFileUpload,
  onFileRemove,
  userRole,
  isUploading,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files);
    }
  }, [onFileUpload]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          File Sharing
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Share medical documents, images, and reports
        </p>
      </div>

      {/* Upload Area */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop files here, or click to select
          </p>
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label htmlFor="file-upload">
            <Button
              additionalClasses="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer"
              isLoading={isUploading}
              text={isUploading ? "Uploading..." : "Select Files"}
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Supports: Images, PDF, Word documents (Max 10MB each)
          </p>
        </div>
      </div>

      {/* Shared Files List */}
      <div className="flex-1 overflow-y-auto p-4">
        {sharedFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No files shared yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sharedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-shrink-0 mr-3">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)} • Shared by {file.uploadedBy} • {' '}
                    {new Date(file.uploadedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    title="View file"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <a
                    href={file.url}
                    download={file.name}
                    className="p-1 text-green-600 hover:text-green-800 dark:text-green-400"
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  {(userRole === 'doctor' || file.uploadedBy === userRole) && (
                    <button
                      onClick={() => onFileRemove(file.id)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
