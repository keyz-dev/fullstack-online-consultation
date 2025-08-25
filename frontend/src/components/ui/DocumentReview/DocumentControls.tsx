import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Maximize2,
} from "lucide-react";

interface DocumentControlsProps {
  isDocument: boolean;
  isImage: boolean;
  currentPage: number;
  totalPages: number;
  zoom: number;
  onPageChange: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
}

const DocumentControls: React.FC<DocumentControlsProps> = ({
  isDocument,
  isImage,
  currentPage,
  totalPages,
  zoom,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onRotateLeft,
  onRotateRight,
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      {/* Left side - Page navigation for documents */}
      {isDocument && totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Previous page"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Center - Zoom controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onZoomOut}
          disabled={zoom <= 25}
          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Zoom out"
        >
          <ZoomOut size={20} />
        </button>

        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
          {zoom}%
        </span>

        <button
          onClick={onZoomIn}
          disabled={zoom >= 300}
          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Zoom in"
        >
          <ZoomIn size={20} />
        </button>

        <button
          onClick={onZoomReset}
          className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
          title="Reset zoom"
        >
          Reset
        </button>
      </div>

      {/* Right side - Rotation controls for images */}
      {isImage && (
        <div className="flex items-center space-x-2">
          <button
            onClick={onRotateLeft}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Rotate left"
          >
            <RotateCcw size={20} />
          </button>

          <button
            onClick={onRotateRight}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Rotate right"
          >
            <RotateCw size={20} />
          </button>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="hidden lg:block text-xs text-gray-500 dark:text-gray-400">
        <span className="mr-4">Use arrow keys to navigate</span>
        <span className="mr-4">+/- to zoom</span>
        <span className="mr-4">R to rotate</span>
        <span>F for fullscreen</span>
      </div>
    </div>
  );
};

export default DocumentControls;
