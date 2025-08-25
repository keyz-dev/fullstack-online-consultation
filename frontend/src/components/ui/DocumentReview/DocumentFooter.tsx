import React from "react";

const DocumentFooter: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <span className="mr-4">Press ESC to close</span>
        <span className="mr-4">Use arrow keys to navigate</span>
        <span className="mr-4">+/- to zoom</span>
        <span>R to rotate</span>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        Document Viewer
      </div>
    </div>
  );
};

export default DocumentFooter;
