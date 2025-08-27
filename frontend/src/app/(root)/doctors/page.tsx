"use client";

import React from "react";
import { DoctorProvider, useDoctor } from "../../../contexts/DoctorContext";
import HeroSection from "../../../components/ui/HeroSection";
import SearchAndFilters from "../../../components/doctors/SearchAndFilters";
import DoctorGrid from "../../../components/doctors/DoctorGrid";

const DoctorsContent = () => {
  const { doctors, filters } = useDoctor();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection
        title="Our Medical Crew"
        subtitle="Connect with qualified healthcare professionals for personalized medical care"
        breadcrumbs={["Home", "Doctors"]}
        backgroundImage="/images/hero/doctors.webp"
      >
        {/* Optional: Add hero content like featured doctors or stats */}
        <div className="mt-8">
          <p className="text-white/80 text-sm">
            Browse through our network of certified medical professionals
          </p>
          {doctors.length > 0 && (
            <p className="text-white/60 text-xs mt-2">
              {doctors.length} doctors available
            </p>
          )}
        </div>
      </HeroSection>

      {/* Search and Filters */}
      <SearchAndFilters />

      {/* Filter Stats */}
      {(filters.search ||
        filters.specialtyId ||
        filters.symptomId ||
        filters.experience ||
        filters.availability) && (
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-4">
                <span>Showing filtered results</span>
                <span className="bg-accent text-white px-2 py-1 rounded-full text-xs">
                  Filters active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Grid */}
      <DoctorGrid />
    </div>
  );
};

const DoctorsPage = () => {
  return (
    <DoctorProvider>
      <DoctorsContent />
    </DoctorProvider>
  );
};

export default DoctorsPage;
