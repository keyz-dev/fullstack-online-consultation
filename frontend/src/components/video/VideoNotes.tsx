"use client";

import React from "react";

interface VideoNotesProps {
  isVisible: boolean;
  notes: string;
  onNotesChange: (notes: string) => void;
}

const VideoNotes: React.FC<VideoNotesProps> = ({
  isVisible,
  notes,
  onNotesChange,
}) => {
  if (!isVisible) return null;

  return (
    <div className="flex-1 p-4">
      <h3 className="font-medium text-gray-900 dark:text-white mb-3">
        Consultation Notes
      </h3>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Enter consultation notes here..."
        className="w-full h-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default VideoNotes;