"use client";

import React from "react";
import HeroSection from "../../../components/ui/HeroSection";
import SearchAndFilters from "../../../components/doctors/SearchAndFilters";
import DoctorGrid from "../../../components/doctors/DoctorGrid";

const DoctorsPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection
        title="Find Your Doctor"
        subtitle="Connect with qualified healthcare professionals for personalized medical care"
        breadcrumbs={["Home", "Doctors"]}
        backgroundImage="/images/hero/doctors.webp"
      >
        {/* Optional: Add hero content like featured doctors or stats */}
        <div className="mt-8">
          <p className="text-white/80 text-sm">
            Browse through our network of certified medical professionals
          </p>
        </div>
      </HeroSection>

      {/* Search and Filters */}
      <SearchAndFilters />

      {/* Doctors Grid */}
      <DoctorGrid />
    </div>
  );
};

export default DoctorsPage;
