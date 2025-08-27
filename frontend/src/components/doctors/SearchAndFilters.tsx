import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, SortAsc, X } from "lucide-react";
import { useDoctor } from "../../contexts/DoctorContext";
import { useDebounce } from "../../hooks/useDebounce";

const SearchAndFilters: React.FC = () => {
  const {
    filters,
    specialties,
    symptoms,
    handleSearch,
    handleFilterChange,
    handleSortChange,
    resetFilters,
  } = useDoctor();

  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Update search when debounced term changes
  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, handleSearch]);

  // Update local search term when filters change
  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleFilterChange({
      specialtyId: value ? parseInt(value) : undefined,
    });
  };

  const handleSymptomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleFilterChange({
      symptomId: value ? parseInt(value) : undefined,
    });
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange({
      experience: e.target.value || undefined,
    });
  };

  const handleAvailabilityChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    handleFilterChange({
      availability: value
        ? (value as "online" | "physical" | "both")
        : undefined,
    });
  };

  const handleSortSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split("-");
    handleSortChange(sortBy, sortOrder as "ASC" | "DESC");
  };

  const clearFilters = () => {
    setSearchTerm("");
    resetFilters();
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.specialtyId ||
      filters.symptomId ||
      filters.experience ||
      filters.availability
    );
  };

  return (
    <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Search and Sort Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for a doctor by name..."
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
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={handleSortSelectChange}
                className="block pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="name-ASC">Name (A-Z)</option>
                <option value="name-DESC">Name (Z-A)</option>
                <option value="experience-DESC">Experience (High-Low)</option>
                <option value="experience-ASC">Experience (Low-High)</option>
                <option value="rating-DESC">Rating (High-Low)</option>
                <option value="fee-ASC">Fee (Low-High)</option>
                <option value="fee-DESC">Fee (High-Low)</option>
              </select>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                showFilters
                  ? "bg-accent text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Specialty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Specialty
                </label>
                <select
                  value={filters.specialtyId || ""}
                  onChange={handleSpecialtyChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Symptom Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Symptom
                </label>
                <select
                  value={filters.symptomId || ""}
                  onChange={handleSymptomChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Symptoms</option>
                  {symptoms.map((symptom) => (
                    <option key={symptom.id} value={symptom.id}>
                      {symptom.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience
                </label>
                <select
                  value={filters.experience || ""}
                  onChange={handleExperienceChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Any Experience</option>
                  <option value="1-5">1-5 Years</option>
                  <option value="5-10">5-10 Years</option>
                  <option value="10-15">10-15 Years</option>
                  <option value="15-20">15-20 Years</option>
                  <option value="20">20+ Years</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Consultation Type
                </label>
                <select
                  value={filters.availability || ""}
                  onChange={handleAvailabilityChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="online">Online</option>
                  <option value="physical">Physical</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters() && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchAndFilters;
