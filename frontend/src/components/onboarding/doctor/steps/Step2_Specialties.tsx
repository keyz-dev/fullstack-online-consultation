import React, { useState, useEffect } from "react";
import { useDoctorApplication } from "../../../../contexts/DoctorApplicationContext";
import { StepNavButtons, TagInput, Input } from "../../../ui";
import { Search } from "lucide-react";

const Step2_Specialties = () => {
  const {
    doctorData,
    updateField,
    nextStep,
    prevStep,
    getStepTitle,
    getStepSubtitle,
  } = useDoctorApplication();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSpecialties, setFilteredSpecialties] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    licenseNumber: "",
    experience: "",
  });

  // Common medical specialties
  const allSpecialties = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Family Medicine",
    "Gastroenterology",
    "General Surgery",
    "Hematology",
    "Infectious Disease",
    "Internal Medicine",
    "Neurology",
    "Obstetrics & Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Otolaryngology",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Rheumatology",
    "Urology",
    "Emergency Medicine",
    "Anesthesiology",
    "Pathology",
    "Physical Medicine & Rehabilitation",
    "Preventive Medicine",
    "Sports Medicine",
    "Geriatrics",
    "Pain Management",
    "Sleep Medicine",
    "Addiction Medicine",
    "Allergy & Immunology",
    "Clinical Genetics",
    "Critical Care Medicine",
    "Forensic Medicine",
    "Medical Genetics",
    "Nuclear Medicine",
    "Occupational Medicine",
    "Public Health",
    "Tropical Medicine",
  ];

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSpecialties(allSpecialties);
    } else {
      const filtered = allSpecialties.filter((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSpecialties(filtered);
    }
  }, [searchTerm]);

  const handleSpecialtyChange = (specialties: string[]) => {
    updateField("specialties", specialties);
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

    setErrors(newErrors);
    return isValid;
  };

  const handleContinue = () => {
    if (
      validateForm() &&
      doctorData.specialties &&
      doctorData.specialties.length > 0
    ) {
      nextStep();
    }
  };

  const canContinue =
    doctorData.specialties &&
    doctorData.specialties.length > 0 &&
    doctorData.licenseNumber &&
    doctorData.experience &&
    !errors.licenseNumber &&
    !errors.experience;

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

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search specialties..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Selected Specialties */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Selected Specialties
            </label>
            <TagInput
              value={doctorData.specialties}
              onChangeHandler={handleSpecialtyChange}
              placeholder="Add your medical specialties"
              suggestions={filteredSpecialties}
            />
          </div>

          {/* Available Specialties */}
          {searchTerm && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Available Specialties
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {filteredSpecialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => {
                      if (!doctorData.specialties.includes(specialty)) {
                        handleSpecialtyChange([
                          ...doctorData.specialties,
                          specialty,
                        ]);
                      }
                    }}
                    disabled={doctorData.specialties.includes(specialty)}
                    className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      doctorData.specialties.includes(specialty)
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 cursor-not-allowed"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <StepNavButtons
            onBack={prevStep}
            onContinue={handleContinue}
            canContinue={canContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default Step2_Specialties;
