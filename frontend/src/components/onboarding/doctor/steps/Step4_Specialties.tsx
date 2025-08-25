import React, { useState, useEffect } from "react";
import { useDoctorApplication } from "../../../../contexts/DoctorApplicationContext";
import { useBaseSpecialty } from "../../../../contexts/BaseSpecialtyContext";
import { StepNavButtons, TagInput, Input } from "../../../ui";
import { Loader2 } from "lucide-react";

interface Specialty {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  doctorCount?: number;
}

const Step4_Specialties = () => {
  const {
    doctorData,
    updateField,
    nextStep,
    prevStep,
    getStepTitle,
    getStepSubtitle,
  } = useDoctorApplication();

  const {
    allSpecialties: backendSpecialties,
    loading: specialtiesLoading,
    error: specialtiesError,
  } = useBaseSpecialty();

  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<number[]>(
    []
  );
  const [tagInputValue, setTagInputValue] = useState("");
  const [errors, setErrors] = useState({
    licenseNumber: "",
    experience: "",
    specialties: "",
  });

  // Initialize selected specialties from context data
  useEffect(() => {
    if (doctorData.specialties && doctorData.specialties.length > 0) {
      // Ensure specialties are numbers
      const specialtyIds = doctorData.specialties
        .map((s) => (typeof s === "number" ? s : parseInt(s)))
        .filter((id) => !isNaN(id));
      setSelectedSpecialtyIds(specialtyIds);
    }
  }, [doctorData.specialties]);

  // Get all available specialty names for suggestions
  const getAvailableSpecialtyNames = (): string[] => {
    return backendSpecialties
      .filter(
        (specialty: Specialty) => !selectedSpecialtyIds.includes(specialty.id)
      )
      .map((specialty: Specialty) => specialty.name);
  };

  // Get selected specialty names for display
  const getSelectedSpecialtyNames = (): string[] => {
    return selectedSpecialtyIds.map((id: number) => {
      const specialty = backendSpecialties.find((s: Specialty) => s.id === id);
      return specialty ? specialty.name : `Specialty ${id}`;
    });
  };

  // Get available specialties for the list (filtered by TagInput value)
  const getAvailableSpecialties = (): Specialty[] => {
    let filtered = backendSpecialties.filter(
      (specialty: Specialty) => !selectedSpecialtyIds.includes(specialty.id)
    );

    // Apply filter based on TagInput value
    if (tagInputValue.trim()) {
      const searchLower = tagInputValue.toLowerCase();
      filtered = filtered.filter(
        (specialty: Specialty) =>
          specialty.name.toLowerCase().includes(searchLower) ||
          (specialty.description &&
            specialty.description.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  };

  const handleSpecialtyChange = (specialtyNames: string[]) => {
    // Convert specialty names back to IDs
    const specialtyIds = specialtyNames
      .map((name: string) => {
        const specialty = backendSpecialties.find(
          (s: Specialty) => s.name === name
        );
        return specialty ? specialty.id : null;
      })
      .filter((id: number | null) => id !== null) as number[];

    setSelectedSpecialtyIds(specialtyIds);
    updateField("specialties", specialtyIds);
  };

  const handleSpecialtySelect = (specialty: Specialty) => {
    if (!selectedSpecialtyIds.includes(specialty.id)) {
      const newSpecialtyIds = [...selectedSpecialtyIds, specialty.id];
      setSelectedSpecialtyIds(newSpecialtyIds);
      updateField("specialties", newSpecialtyIds);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    updateField(name, value);

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      licenseNumber: "",
      experience: "",
      specialties: "",
    };
    let isValid = true;

    if (!doctorData.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required";
      isValid = false;
    }

    if (!doctorData.experience) {
      newErrors.experience = "Years of experience is required";
      isValid = false;
    } else if (
      parseInt(doctorData.experience) < 0 ||
      parseInt(doctorData.experience) > 50
    ) {
      newErrors.experience = "Experience must be between 0 and 50 years";
      isValid = false;
    }

    if (selectedSpecialtyIds.length === 0) {
      newErrors.specialties = "At least one specialty is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleContinue = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  const canContinue =
    selectedSpecialtyIds.length > 0 &&
    doctorData.licenseNumber &&
    doctorData.experience &&
    !errors.licenseNumber &&
    !errors.experience &&
    errors.specialties === "";

  if (specialtiesLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="py-4 sm:py-6">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {getStepTitle(1)}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              {getStepSubtitle(1)}
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              Loading specialties...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (specialtiesError) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {getStepTitle(1)}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              {getStepSubtitle(1)}
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Failed to load specialties. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getStepTitle(1)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(1)}
          </p>
        </div>

        <div className="space-y-6">
          {/* License and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Medical License Number"
              name="licenseNumber"
              error={errors.licenseNumber}
              value={doctorData.licenseNumber}
              onChangeHandler={handleInputChange}
              required
              placeholder="Enter your medical license number"
            />

            <Input
              label="Years of Experience"
              type="number"
              name="experience"
              error={errors.experience}
              value={doctorData.experience}
              onChangeHandler={handleInputChange}
              required
              placeholder="Enter years of experience"
              min="0"
              max="50"
            />
          </div>

          {/* Specialties Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Medical Specialties
            </label>
            <TagInput
              value={getSelectedSpecialtyNames()}
              onChangeHandler={handleSpecialtyChange}
              placeholder="Type to search and add your medical specialties"
              suggestions={getAvailableSpecialtyNames()}
              showSuggestions={true}
              maxSuggestions={8}
              onInputChange={setTagInputValue}
            />
            {errors.specialties && (
              <p className="text-red-500 text-sm mt-1">{errors.specialties}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Type to filter specialties below. Click on specialties or use the
              dropdown to add them.
            </p>
          </div>

          {/* Available Specialties List (filtered by TagInput) */}
          {getAvailableSpecialties().length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {tagInputValue
                  ? "Filtered Specialties"
                  : "Available Specialties"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {getAvailableSpecialties().map((specialty) => (
                  <button
                    key={specialty.id}
                    onClick={() => handleSpecialtySelect(specialty)}
                    className="text-left px-3 py-2 rounded-md text-sm transition-colors bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="font-medium">{specialty.name}</div>
                    {specialty.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {specialty.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {tagInputValue && getAvailableSpecialties().length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">
                No specialties found matching &quot;{tagInputValue}&quot;
              </p>
            </div>
          )}

          {/* Navigation */}
          <StepNavButtons
            onBack={prevStep}
            onContinue={handleContinue}
            canContinue={canContinue as boolean}
          />
        </div>
      </div>
    </div>
  );
};

export default Step4_Specialties;
