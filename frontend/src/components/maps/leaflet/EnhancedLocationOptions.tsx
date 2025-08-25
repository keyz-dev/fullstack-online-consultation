import React from "react";
import { Navigation, Edit3 } from "lucide-react";

interface EnhancedLocationOptionsProps {
  visible: boolean;
  onUseLocation: () => void;
  onManualEntry: () => void;
  loading: boolean;
}

const EnhancedLocationOptions: React.FC<EnhancedLocationOptionsProps> = ({
  visible,
  onUseLocation,
  onManualEntry,
  loading,
}) => {
  if (!visible) return null;

  const handleManualEntryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onManualEntry();
  };

  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 mt-1">
      <button
        onClick={onUseLocation}
        disabled={loading}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 disabled:opacity-50 border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-300"
      >
        <Navigation className="h-5 w-5 text-blue-500" />
        <span className="flex items-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              Getting your location...
            </>
          ) : (
            "Use current location"
          )}
        </span>
      </button>

      <button
        onClick={handleManualEntryClick}
        disabled={loading}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 disabled:opacity-50 text-gray-700 dark:text-gray-300"
      >
        <Edit3 className="h-5 w-5 text-green-500" />
        <span>Enter address manually</span>
      </button>
    </div>
  );
};

export default EnhancedLocationOptions;
