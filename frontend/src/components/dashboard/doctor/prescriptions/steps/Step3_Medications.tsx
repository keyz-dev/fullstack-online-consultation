import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pill } from "lucide-react";
import { CreatePrescriptionData } from "../../../../../api/prescriptions";
import { usePharmacyMedications } from "../../../../../hooks/usePharmacyMedications";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  duration: string;
}

interface Step3_MedicationsProps {
  medications: any[];
  onUpdate: (updates: Partial<CreatePrescriptionData>) => void;
  onContinue: () => void;
}

const Step3_Medications: React.FC<Step3_MedicationsProps> = ({
  medications,
  onUpdate,
  onContinue,
}) => {
  const [localMedications, setLocalMedications] = useState<Medication[]>(
    medications.length > 0 ? medications : []
  );
  const [medicationSuggestions, setMedicationSuggestions] = useState<string[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState<
    Record<string, boolean>
  >({});

  const { medications: systemMedications } = usePharmacyMedications();

  // Get medication suggestions from system inventory
  useEffect(() => {
    if (systemMedications.length > 0) {
      const suggestions = systemMedications.map((med) => med.name);
      setMedicationSuggestions(suggestions);
    }
  }, [systemMedications]);

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "",
      instructions: "",
      duration: "",
    };
    const updatedMedications = [...localMedications, newMedication];

    console.log("updatedMedications", updatedMedications);
    setLocalMedications(updatedMedications);
    onUpdate({ medications: updatedMedications });
  };

  const removeMedication = (id: string) => {
    const updatedMedications = localMedications.filter((med) => med.id !== id);
    setLocalMedications(updatedMedications);
    onUpdate({ medications: updatedMedications });
  };

  const updateMedication = (
    id: string,
    field: keyof Medication,
    value: string
  ) => {
    const updatedMedications = localMedications.map((med) =>
      med.id === id ? { ...med, [field]: value } : med
    );
    setLocalMedications(updatedMedications);
    onUpdate({ medications: updatedMedications });
  };

  const handleMedicationNameChange = (id: string, value: string) => {
    updateMedication(id, "name", value);
    setShowSuggestions({ ...showSuggestions, [id]: value.length > 0 });
  };

  const selectSuggestion = (id: string, suggestion: string) => {
    updateMedication(id, "name", suggestion);
    setShowSuggestions({ ...showSuggestions, [id]: false });
  };

  const handleContinue = () => {
    onUpdate({ medications: localMedications });
    onContinue();
  };

  const canContinue =
    localMedications.length > 0 &&
    localMedications.every((med) => med.name.trim().length > 0);

  const filteredSuggestions = (medicationName: string) => {
    return medicationSuggestions
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(medicationName.toLowerCase())
      )
      .slice(0, 5);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Medications
        </h3>
        <p className="text-gray-600">
          Add medications with dosage and instructions
        </p>
      </div>

      <div className="space-y-4">
        {localMedications.map((medication, index) => (
          <div
            key={medication.id}
            className="bg-gray-50 rounded-lg p-4 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">
                  Medication {index + 1}
                </span>
              </div>
              {localMedications.length > 1 && (
                <button
                  onClick={() => removeMedication(medication.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Medication Name with Suggestions */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={medication.name}
                  onChange={(e) =>
                    handleMedicationNameChange(medication.id, e.target.value)
                  }
                  placeholder="Enter medication name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                {/* Suggestions Dropdown */}
                {showSuggestions[medication.id] &&
                  medication.name.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredSuggestions(medication.name).map(
                        (suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              selectSuggestion(medication.id, suggestion)
                            }
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                          >
                            {suggestion}
                          </button>
                        )
                      )}
                    </div>
                  )}
              </div>

              {/* Dosage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage *
                </label>
                <input
                  type="text"
                  value={medication.dosage}
                  onChange={(e) =>
                    updateMedication(medication.id, "dosage", e.target.value)
                  }
                  placeholder="e.g., 500mg, 1 tablet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency *
                </label>
                <select
                  value={medication.frequency}
                  onChange={(e) =>
                    updateMedication(medication.id, "frequency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <input
                  type="text"
                  value={medication.duration}
                  onChange={(e) =>
                    updateMedication(medication.id, "duration", e.target.value)
                  }
                  placeholder="e.g., 7 days, 2 weeks"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Special Instructions */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  value={medication.instructions}
                  onChange={(e) =>
                    updateMedication(
                      medication.id,
                      "instructions",
                      e.target.value
                    )
                  }
                  placeholder="e.g., Take with food, Take before bedtime..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Medication Button */}
        <button
          onClick={addMedication}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Another Medication</span>
        </button>
      </div>
    </div>
  );
};

export default Step3_Medications;
