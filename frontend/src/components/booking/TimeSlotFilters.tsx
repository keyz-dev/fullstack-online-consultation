import React from "react";
import { Filter, X } from "lucide-react";
import {
  TimeSlotFilters as Filters,
  FilterOptions,
} from "@/hooks/useTimeSlotFilters";

interface TimeSlotFiltersProps {
  filters: Filters;
  filterOptions: FilterOptions;
  onFilterChange: (key: keyof Filters, value: string | boolean) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  formatDate: (date: string) => string;
}

const TimeSlotFilters: React.FC<TimeSlotFiltersProps> = ({
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
  formatDate,
}) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <select
            value={filters.date}
            onChange={(e) => onFilterChange("date", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Dates</option>
            {filterOptions.availableDates.map((date) => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
        </div>

        {/* Consultation Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Consultation Type
          </label>
          <select
            value={filters.consultationType}
            onChange={(e) => onFilterChange("consultationType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="online">Online</option>
            <option value="physical">Physical</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Min Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Min Fee (XAF)
          </label>
          <input
            type="number"
            value={filters.minFee}
            onChange={(e) => onFilterChange("minFee", e.target.value)}
            placeholder={`Min: ${filterOptions.feeRange.min}`}
            min={filterOptions.feeRange.min}
            max={filterOptions.feeRange.max}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Max Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Fee (XAF)
          </label>
          <input
            type="number"
            value={filters.maxFee}
            onChange={(e) => onFilterChange("maxFee", e.target.value)}
            placeholder={`Max: ${filterOptions.feeRange.max}`}
            min={filterOptions.feeRange.min}
            max={filterOptions.feeRange.max}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() =>
            onFilterChange("showOnlyAvailable", !filters.showOnlyAvailable)
          }
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            filters.showOnlyAvailable
              ? "bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300"
              : "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          }`}
        >
          Available Only
        </button>
        <button
          onClick={() =>
            onFilterChange("showOnlyToday", !filters.showOnlyToday)
          }
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            filters.showOnlyToday
              ? "bg-green-100 border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
              : "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          }`}
        >
          Today Only
        </button>
        <button
          onClick={() =>
            onFilterChange("showOnlyTomorrow", !filters.showOnlyTomorrow)
          }
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            filters.showOnlyTomorrow
              ? "bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-300"
              : "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          }`}
        >
          Tomorrow Only
        </button>
      </div>

      {/* Fee Range Display */}
      {filterOptions.feeRange.max > 0 && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Fee range: {filterOptions.feeRange.min} - {filterOptions.feeRange.max}{" "}
          XAF
        </div>
      )}
    </div>
  );
};

export default TimeSlotFilters;
