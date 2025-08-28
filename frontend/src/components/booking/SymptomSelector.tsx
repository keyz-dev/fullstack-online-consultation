"use client";

import React, { useState, useEffect } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { useSymptom } from "@/contexts/SymptomContext";
import { useBaseSpecialty } from "@/contexts/BaseSpecialtyContext";
import { Symptom } from "@/api/symptoms";
import { Search, X, Check } from "lucide-react";
import { Loader, Select } from "@/components/ui";

const SymptomSelector: React.FC = () => {
  const { state, dispatch } = useBooking();
  const {
    symptoms,
    loading: symptomsLoading,
    filters,
    setFilters,
  } = useSymptom();
  const { specialties } = useBaseSpecialty();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<number[]>([]);

  // Initialize selected symptoms from state
  useEffect(() => {
    if (state.symptomIds && state.symptomIds.length > 0) {
      setSelectedSymptomIds(state.symptomIds);
    }
  }, [state.symptomIds]);

  // Filter symptoms based on search and specialty
  const filteredSymptoms = symptoms.filter((symptom) => {
    const matchesSearch =
      symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symptom.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      filters.specialtyId === "all" ||
      symptom.specialtyId === parseInt(filters.specialtyId);
    return matchesSearch && matchesSpecialty;
  });

  // Handle symptom selection
  const handleSymptomToggle = (symptom: Symptom) => {
    const newSelectedIds = selectedSymptomIds.includes(symptom.id)
      ? selectedSymptomIds.filter((id) => id !== symptom.id)
      : [...selectedSymptomIds, symptom.id];

    setSelectedSymptomIds(newSelectedIds);

    // Update booking state
    dispatch({ type: "SET_SYMPTOM_IDS", payload: newSelectedIds });

    // Mark step as completed (this step is optional)
    dispatch({
      type: "SET_STEP_COMPLETED",
      payload: { stepIndex: 0, completed: true },
    });
  };

  // Handle specialty filter change
  const handleSpecialtyFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const specialtyId = e.target.value;
    setFilters("specialtyId", specialtyId);

    // Update booking state with specialty
    if (specialtyId !== "all") {
      dispatch({ type: "SET_SPECIALTY_ID", payload: parseInt(specialtyId) });

      // Mark step as completed (this step is optional)
      dispatch({
        type: "SET_STEP_COMPLETED",
        payload: { stepIndex: 0, completed: true },
      });
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  if (symptomsLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Select Your Symptoms
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the symptoms you&apos;re experiencing to help us find the right
          doctor for you.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xs outline-none bg-white dark:bg-gray-700 text-primary dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Specialty Filter */}
        <Select
          options={[
            { label: "All Specialties", value: "all" },
            ...specialties.map((specialty) => ({
              label: specialty.name,
              value: specialty.id,
            })),
          ]}
          value={filters.specialtyId}
          onChange={handleSpecialtyFilterChange}
          label="Filter by Specialty"
        />
      </div>

      {/* Selected Symptoms Summary */}
      {selectedSymptomIds.length > 0 && (
        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h3 className="text-sm font-medium text-primary mb-2">
            Selected Symptoms ({selectedSymptomIds.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedSymptomIds.map((symptomId) => {
              const symptom = symptoms.find((s) => s.id === symptomId);
              if (!symptom) return null;
              return (
                <span
                  key={symptom.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-white"
                >
                  {symptom.name}
                  <button
                    onClick={() => handleSymptomToggle(symptom)}
                    className="ml-2 hover:bg-primary/80 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Symptoms Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSymptoms.map((symptom) => {
          const isSelected = selectedSymptomIds.includes(symptom.id);
          return (
            <div
              key={symptom.id}
              onClick={() => handleSymptomToggle(symptom)}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {symptom.name}
                  </h3>
                  {symptom.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {symptom.description}
                    </p>
                  )}
                  {symptom.specialty && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                      {symptom.specialty.name}
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  {isSelected ? (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredSymptoms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No symptoms found matching your search criteria.
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
          💡 Tip
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Select all symptoms you're experiencing. This helps us match you with
          the most appropriate doctor for your condition.
        </p>
      </div>
    </div>
  );
};

export default SymptomSelector;
