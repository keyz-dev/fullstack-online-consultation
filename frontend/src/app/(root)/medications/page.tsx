"use client";

import React from "react";
import HeroSection from "../../../components/ui/HeroSection";
import SearchAndFilters from "../../../components/medications/SearchAndFilters";
import MedicationGrid from "../../../components/medications/MedicationGrid";

const MedicationsPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection
        title="Browse Medications"
        subtitle="Find and order prescription and over-the-counter medications from trusted sources"
        breadcrumbs={["Home", "Medications"]}
        backgroundImage="/images/hero/medications.jpg"
      >
        {/* Optional: Add hero content like featured medications or stats */}
        <div className="mt-8">
          <p className="text-white/80 text-sm">
            Access a comprehensive database of medications with detailed
            information
          </p>
        </div>
      </HeroSection>

      {/* Search and Filters */}
      <SearchAndFilters />

      {/* Medications Grid */}
      <MedicationGrid />
    </div>
  );
};

export default MedicationsPage;
