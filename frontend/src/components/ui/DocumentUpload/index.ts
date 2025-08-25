export { default as EnhancedFileDropzone } from "./EnhancedFileDropzone";
export { default as EnhancedUploadedFileItem } from "./EnhancedUploadedFileItem";

// Export types
export interface DocumentFile {
  id: string;
  file?: File;
  name?: string;
  size?: number;
  type?: string;
  preview?: string;
  documentName?: string;
  url?: string;
  fileType?: string;
}
