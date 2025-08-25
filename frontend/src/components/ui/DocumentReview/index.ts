export { default as DocumentPreview } from "./DocumentPreview";
export { default as DocumentHeader } from "./DocumentHeader";
export { default as DocumentControls } from "./DocumentControls";
export { default as DocumentContent } from "./DocumentContent";
export { default as DocumentFooter } from "./DocumentFooter";
export { default as PDFViewer } from "./PDFViewer";

// Export types
export interface DocumentData {
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
