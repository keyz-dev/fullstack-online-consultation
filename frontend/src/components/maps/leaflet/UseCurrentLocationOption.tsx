import React from "react";
import { Navigation } from "lucide-react";

interface UseCurrentLocationOptionProps {
  visible: boolean;
  onUseLocation: () => void;
  loading: boolean;
}

const UseCurrentLocationOption: React.FC<UseCurrentLocationOptionProps> = ({
  visible,
  onUseLocation,
  loading,
}) => {
  if (!visible) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 mt-1">
      <button
        onClick={onUseLocation}
        disabled={loading}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 disabled:opacity-50 text-gray-700 dark:text-gray-300"
      >
        <Navigation className="h-5 w-5 text-blue-500" />
        <span>
          {loading ? "Getting your location..." : "Use current location"}
        </span>
      </button>
    </div>
  );
};

export default UseCurrentLocationOption;
