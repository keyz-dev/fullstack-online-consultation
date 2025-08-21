import React, { useState, useEffect } from "react";
import { Search, Filter, SortAsc } from "lucide-react";
import { useBaseSpecialty } from "../../contexts/BaseSpecialtyContext";

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onSortChange: (sortBy: string) => void;
  searchValue: string;
  sortBy: string;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  onSearch,
  onSortChange,
  searchValue,
  sortBy,
}) => {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  return (
    <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search for a specialty..."
              className={`block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xs leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm transition-colors duration-200 ${
                isSearchFocused ? "ring-2 ring-accent/20" : ""
              }`}
            />
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <SortAsc className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <label
                htmlFor="sort"
                className="text-sm whitespace-nowrap font-medium text-gray-700 dark:text-gray-300"
              >
                Sort by:
              </label>
            </div>
            <select
              id="sort"
              value={sortBy}
              onChange={handleSortChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="name">Name (A-Z)</option>
              <option value="doctors">Most Doctors</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchAndFilters;
