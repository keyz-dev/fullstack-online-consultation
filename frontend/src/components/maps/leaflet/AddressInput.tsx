import React, { useRef } from "react";
import { Search } from "lucide-react";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  loading?: boolean;
  searchLoading?: boolean;
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  loading = false,
  searchLoading = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Show location loading (spinner) or search loading (subtle indicator)
  const isLoading = loading || searchLoading;
  const isLocationLoading = loading;

  return (
    <div className="relative w-full mb-4">
      <div className="relative">
        {isLocationLoading ? (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              searchLoading
                ? "text-blue-500"
                : "text-gray-400 dark:text-gray-500"
            }`}
          />
        )}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={
            isLocationLoading
              ? "Getting your location..."
              : searchLoading
              ? "Searching addresses..."
              : "Search for an address..."
          }
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
            isLoading ? "bg-gray-50 dark:bg-gray-700" : ""
          }`}
          disabled={isLocationLoading}
        />
      </div>
    </div>
  );
};

export default AddressInput;
