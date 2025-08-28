"use client";

import React, { useState, useEffect } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { Video, Monitor, CheckCircle } from "lucide-react";

interface ConsultationTypeOption {
  id: "online" | "physical";
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  textColor: string;
}

const ConsultationTypeSelector: React.FC = () => {
  const { state, dispatch } = useBooking();
  const [selectedType, setSelectedType] = useState<
    "online" | "physical" | null
  >(null);
  const [autoSelected, setAutoSelected] = useState(false);

  const consultationTypes: ConsultationTypeOption[] = [
    {
      id: "online",
      title: "Online Consultation",
      description: "Video call consultation from the comfort of your home",
      icon: Video,
      color:
        "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "physical",
      title: "Physical Consultation",
      description: "In-person consultation at the doctor's clinic",
      icon: Monitor,
      color:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700",
      textColor: "text-green-600 dark:text-green-400",
    },
  ];

  // Auto-select consultation type based on availability
  useEffect(() => {
    if (state.timeSlot) {
      const availabilityType = state.timeSlot.consultationType;

      if (availabilityType === "online") {
        setSelectedType("online");
        setAutoSelected(true);
      } else if (availabilityType === "physical") {
        setSelectedType("physical");
        setAutoSelected(true);
      } else if (availabilityType === "both") {
        // Check if user already selected a consultation type
        if (state.consultationType) {
          setSelectedType(state.consultationType);
          setAutoSelected(false);
        } else {
          setSelectedType("online"); // Default to online
          setAutoSelected(false);
        }
      }
    }
  }, [state.timeSlot, state.consultationType]);

  const handleTypeSelect = (type: "online" | "physical") => {
    setSelectedType(type);
    setAutoSelected(false);

    // Update booking state and mark step as completed
    dispatch({
      type: "SET_CONSULTATION_TYPE",
      payload: type,
    });

    dispatch({
      type: "SET_STEP_COMPLETED",
      payload: { stepIndex: 4, completed: true },
    });
  };

  if (!state.timeSlot) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Please select a time slot first.
        </p>
      </div>
    );
  }

  const availabilityType = state.timeSlot.consultationType;
  const doctorName = state.doctor?.user?.name || "the doctor";

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Consultation Type
      </h2>

      {/* Auto-selection message */}
      {autoSelected && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                You&apos;re about to book a {selectedType?.toUpperCase()}{" "}
                consultation with {doctorName}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                This time slot is only available for {selectedType}{" "}
                consultations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selection cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {consultationTypes.map((type) => {
          const IconComponent = type.icon;
          const isAvailable =
            availabilityType === "both" || availabilityType === type.id;
          const isSelected = selectedType === type.id;

          return (
            <div
              key={type.id}
              className={`p-6 rounded-xs border-2 cursor-pointer transition-all duration-200 ${
                !isAvailable
                  ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                  : isSelected
                  ? `${type.color} border-2 shadow-lg`
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md"
              } ${isAvailable ? "hover:scale-105" : ""}`}
              onClick={() => isAvailable && handleTypeSelect(type.id)}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-lg ${type.color} ${type.textColor}`}
                >
                  <IconComponent size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {type.description}
                  </p>
                  {!isAvailable && (
                    <p className="text-red-500 text-sm mt-2">
                      Not available for this time slot
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConsultationTypeSelector;
