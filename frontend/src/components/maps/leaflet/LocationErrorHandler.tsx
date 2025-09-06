import React from "react";
import { AlertTriangle, MapPin, Edit3 } from "lucide-react";

interface LocationError {
  code: number;
  message?: string;
}

interface LocationErrorHandlerProps {
  error: LocationError | null;
  onRetry: () => void;
  onManualEntry: (addressData: unknown) => void;
  onDismiss: () => void;
}

const LocationErrorHandler: React.FC<LocationErrorHandlerProps> = ({
  error,
  onRetry,
  onManualEntry,
  onDismiss,
}) => {
  if (!error) return null;

  const getErrorMessage = (errorCode: number) => {
    switch (errorCode) {
      case 1:
        return "Location access was denied. Please enable location permissions or use manual entry.";
      case 2:
        return "Location unavailable. Please try again or use manual entry.";
      case 3:
        return "Location request timed out. Please try again or use manual entry.";
      default:
        return "Could not get your location. Please try again or use manual entry.";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-md max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="text-yellow-500" size={24} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Location Error
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {getErrorMessage(error.code)}
        </p>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <MapPin size={16} />
            <span>Try Again</span>
          </button>

          <button
            onClick={() => onManualEntry({})}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Edit3 size={16} />
            <span>Enter Manually</span>
          </button>

          <button
            onClick={onDismiss}
            className="w-full px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationErrorHandler;
