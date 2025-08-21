import React, { useState } from "react";
import { Search, Filter, SortAsc } from "lucide-react";

const SearchAndFilters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a doctor..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xs leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm"
            />
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <SortAsc className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
              </label>
              <select className="block pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="name">Name (A-Z)</option>
                <option value="experience">Experience</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchAndFilters;
