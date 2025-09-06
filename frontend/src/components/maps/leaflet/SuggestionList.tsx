import React from "react";
import { MapPin } from "lucide-react";

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: unknown;
}

interface SuggestionListProps {
  suggestions: Suggestion[];
  visible: boolean;
  onSelect: (suggestion: Suggestion) => void;
  loading: boolean;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  visible,
  onSelect,
  loading,
}) => {
  if (!visible || (!suggestions.length && !loading)) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
      {loading && (
        <div className="px-4 py-3 text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span>Searching for addresses...</span>
        </div>
      )}
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0 text-gray-700 dark:text-gray-300"
        >
          <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <span className="text-sm">{suggestion.display_name}</span>
        </button>
      ))}
    </div>
  );
};

export default SuggestionList;
