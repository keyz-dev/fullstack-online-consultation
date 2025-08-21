"use client";

import React from "react";
import {
  BaseSpecialtyProvider,
  useBaseSpecialty,
} from "../../../contexts/BaseSpecialtyContext";
import HeroSection from "../../../components/ui/HeroSection";
import SearchAndFilters from "../../../components/specialties/SearchAndFilters";
import SpecialtyGrid from "../../../components/specialties/SpecialtyGrid";

const SpecialtiesContent = () => {
  const {
    specialties,
    loading,
    error,
    hasMore,
    filters,
    handleSearch,
    handleSortChange,
    handleLoadMore,
    resetFilters,
  } = useBaseSpecialty();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection
        title="Areas of Expertise"
        subtitle="Discover our comprehensive range of medical specialties and find the right doctor for your needs"
        breadcrumbs={["Home", "Specialties"]}
        backgroundImage="/images/hero/specialties.jpg"
      >
        {/* Optional: Add hero content like featured specialties or stats */}
        <div className="mt-8">
          <p className="text-white/80 text-sm">
            {specialties.length} specialties available
          </p>
        </div>
      </HeroSection>

      {/* Search and Filters */}
      <SearchAndFilters
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        searchValue={filters.search}
        sortBy={filters.sortBy}
      />

      {/* Filter Stats */}
      {filters.search && (
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-4">
                <span>Showing {specialties.length} specialties</span>
                <span className="bg-accent text-white px-2 py-1 rounded-full text-xs">
                  Search active
                </span>
              </div>
              <button
                onClick={resetFilters}
                className="text-accent hover:text-accent/80 underline text-sm"
              >
                Clear search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Specialties Grid */}
      <SpecialtyGrid
        specialties={specialties}
        loading={loading}
        error={error}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};

const SpecialtiesPage = () => {
  return (
    <BaseSpecialtyProvider>
      <SpecialtiesContent />
    </BaseSpecialtyProvider>
  );
};

export default SpecialtiesPage;
