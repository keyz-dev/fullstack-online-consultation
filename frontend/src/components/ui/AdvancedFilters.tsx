import React, { useState, useCallback, useEffect } from "react";
import { Search, Filter, X, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";

interface FilterConfig {
  key: string;
  label: string;
  defaultValue?: string;
  colorClass?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

interface AdvancedFiltersProps {
  filters: Record<string, string>;
  onFilterChange: (filterType: string, value: string) => void;
  onSearch: (searchTerm: string) => void;
  onClearAll?: () => void;
  filterConfigs?: FilterConfig[];
  searchPlaceholder?: string;
  className?: string;
  loading?: boolean;
  debounceMs?: number;
  onSearchingChange?: (searching: boolean) => void;
  refreshFunction?: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onClearAll,
  filterConfigs = [],
  searchPlaceholder = "Search...",
  className = "",
  loading = false,
  debounceMs = 300,
  onSearchingChange,
  refreshFunction,
}) => {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Debounced search effect
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        // Only show loading if there's actually a search term
        if (searchValue.trim()) {
          setIsSearching(true);
        }
        onSearch(searchValue);
        // Reset searching state after a longer delay to prevent flickering
        const resetTimer = setTimeout(() => {
          setIsSearching(false);
        }, 1500);
        setSearchTimeout(resetTimer);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchValue, filters.search, onSearch, debounceMs, searchTimeout]);

  // Notify parent component when searching state changes
  useEffect(() => {
    if (onSearchingChange) {
      onSearchingChange(isSearching);
    }
  }, [isSearching, onSearchingChange]);

  // Initialize search value from filters on mount
  useEffect(() => {
    if (!searchValue && filters.search) {
      setSearchValue(filters.search);
    }
  }, []); // Only run on mount

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearFilters = useCallback(() => {
    setSearchValue("");
    setIsSearching(false); // Immediately hide loader when clearing
    if (onClearAll) {
      onClearAll();
    } else {
      // Fallback: Clear all filters to their default values
      filterConfigs.forEach((config) => {
        onFilterChange(config.key, config.defaultValue || "all");
      });
      onSearch("");
    }
  }, [onClearAll, filterConfigs, onFilterChange, onSearch]);

  const hasActiveFilters = () => {
    const hasFilterActive = filterConfigs.some((config) => {
      const currentValue = filters[config.key];
      const defaultValue = config.defaultValue || "all";
      return (
        currentValue &&
        currentValue !== defaultValue &&
        currentValue !== "" &&
        currentValue !== "all"
      );
    });
    return hasFilterActive || (searchValue && searchValue.trim() !== "");
  };

  const getFilterLabel = (config: FilterConfig) => {
    const value = filters[config.key];
    const defaultValue = config.defaultValue || "all";
    if (!value || value === defaultValue || value === "" || value === "all")
      return null;

    const option = config.options?.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      onFilterChange(key, value);
    },
    [onFilterChange]
  );

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="w-full sm:flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-xs outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-white dark:bg-gray-800 text-primary dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={loading}
            />
            {isSearching && searchValue.trim() && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-gray-400 dark:text-gray-500 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-1 md:justify-start lg:justify-end md:flex-wrap gap-4">
          {filterConfigs.map((config, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center space-x-2 space-y-1"
            >
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {config.label}:
              </label>
              <select
                value={filters[config.key] || config.defaultValue || "all"}
                onChange={(e) => handleFilterChange(config.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xs outline-none text-sm focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-primary dark:text-white"
                disabled={loading}
              >
                {config.options?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {typeof refreshFunction === "function" && (
          <Button
            onClick={refreshFunction}
            variant="secondary"
            size="sm"
            className="min-w-fit min-h-fit text-blue-600 dark:text-blue-400"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        )}

        {/* Clear Filters */}
        {hasActiveFilters() && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Filters:
            </span>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {filterConfigs.map((config, index) => {
                const label = getFilterLabel(config);
                if (!label) return null;

                return (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      config.colorClass ||
                      "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    }`}
                  >
                    {config.label}: {label}
                    <button
                      onClick={() =>
                        handleFilterChange(
                          config.key,
                          config.defaultValue || "all"
                        )
                      }
                      className="ml-1 hover:opacity-70"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              {searchValue && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-primary dark:text-white">
                  Search: &quot;{searchValue}&quot;
                  <button
                    onClick={() => {
                      setSearchValue("");
                      setIsSearching(false);
                    }}
                    className="ml-1 hover:text-gray-600 dark:hover:text-gray-400"
                    disabled={loading}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
