"use client";

import React from "react";
import HeroSection from "../../../components/ui/HeroSection";
import SearchAndFilters from "../../../components/pharmacies/SearchAndFilters";
import PharmacyGrid from "../../../components/pharmacies/PharmacyGrid";

const PharmaciesPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection
        title="Find Pharmacies"
        subtitle="Discover trusted pharmacies near you for all your medication needs"
        breadcrumbs={["Home", "Pharmacies"]}
        backgroundImage="/images/hero/pharmacy.webp"
      >
        {/* Optional: Add hero content like featured pharmacies or stats */}
        <div className="mt-8">
          <p className="text-white/80 text-sm">
            Access reliable pharmacies with certified medications and
            professional service
          </p>
        </div>
      </HeroSection>

      {/* Search and Filters */}
      <SearchAndFilters />

      {/* Pharmacies Grid */}
      <PharmacyGrid />
    </div>
  );
};

export default PharmaciesPage;
