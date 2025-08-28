"use client";

import React from "react";
import { useBooking } from "@/contexts/BookingContext";
import { Check, Circle } from "lucide-react";

const BookingProgress: React.FC = () => {
  const { state } = useBooking();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {state.steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  index < state.currentStep
                    ? "bg-primary border-primary text-white"
                    : index === state.currentStep
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400"
                }`}
              >
                {index < state.currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-2 text-center max-w-24">
                <p
                  className={`text-xs font-medium transition-colors ${
                    index <= state.currentStep
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step.title}
                </p>
                <p
                  className={`text-xs hidden md:block mt-1 transition-colors ${
                    index <= state.currentStep
                      ? "text-gray-600 dark:text-gray-300"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < state.steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 transition-colors ${
                  index < state.currentStep
                    ? "bg-primary"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile Progress Bar */}
      <div className="mt-4 md:hidden">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((state.currentStep + 1) / state.steps.length) * 100}%`,
            }}
          />
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Step {state.currentStep + 1} of {state.steps.length}:{" "}
            {state.steps[state.currentStep]?.title}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingProgress;
