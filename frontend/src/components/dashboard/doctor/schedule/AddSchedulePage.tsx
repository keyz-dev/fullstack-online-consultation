"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Card, Button } from "@/components/ui";
import {
  DaySelectionStep,
  DurationSelectionStep,
  TimeSessionsStep,
  ReviewStep,
} from "./AvailabilityWizard";
import { Availability, TimeBlock } from "@/types/availability";
import { availabilityApi } from "@/api/availability";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface AddSchedulePageProps {
  setView: (view: string) => void;
}

type WizardStep = "days" | "duration" | "sessions" | "review";

export const AddSchedulePage: React.FC<AddSchedulePageProps> = ({
  setView,
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("days");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [consultationDuration, setConsultationDuration] = useState<number>(30);
  const [timeSessions, setTimeSessions] = useState<Record<number, TimeBlock[]>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if a specific day was pre-selected
  useEffect(() => {
    const preSelectedDay = localStorage.getItem("selectedDay");
    if (preSelectedDay) {
      const dayOfWeek = parseInt(preSelectedDay);
      setSelectedDays([dayOfWeek]);
      localStorage.removeItem("selectedDay"); // Clear after use
      
      // Skip to sessions step if only one day is selected
      setCurrentStep("duration");
    }
  }, []);

  // Step navigation
  const steps: { key: WizardStep; title: string; description: string }[] = [
    {
      key: "days",
      title: "Select Days",
      description: "Choose which days you're available",
    },
    {
      key: "duration",
      title: "Set Duration",
      description: "How long is each consultation?",
    },
    {
      key: "sessions",
      title: "Time Sessions",
      description: "Set your available time slots",
    },
    {
      key: "review",
      title: "Review & Save",
      description: "Review your schedule before saving",
    },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  const handleNext = useCallback(() => {
    if (currentStep === "days" && selectedDays.length === 0) return;
    if (currentStep === "duration" && consultationDuration === 0) return;
    if (currentStep === "sessions") {
      // Validate that all selected days have at least one time session
      const hasAllSessions = selectedDays.every(
        (day) => timeSessions[day] && timeSessions[day].length > 0
      );
      if (!hasAllSessions) return;
    }

    const nextSteps: Record<WizardStep, WizardStep> = {
      days: "duration",
      duration: "sessions",
      sessions: "review",
      review: "review",
    };

    setCurrentStep(nextSteps[currentStep]);
  }, [currentStep, selectedDays, consultationDuration, timeSessions]);

  const handlePrevious = useCallback(() => {
    const prevSteps: Record<WizardStep, WizardStep> = {
      days: "days",
      duration: "days",
      sessions: "duration",
      review: "sessions",
    };

    setCurrentStep(prevSteps[currentStep]);
  }, [currentStep]);

  const handleSave = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const availabilities: Availability[] = [];

      selectedDays.forEach((dayOfWeek) => {
        const daySessions = timeSessions[dayOfWeek] || [];
        daySessions.forEach((session) => {
          availabilities.push({
            dayOfWeek,
            startTime: session.startTime,
            endTime: session.endTime,
            consultationDuration,
            consultationType: session.consultationType,
            consultationFee: session.consultationFee,
            maxPatients: session.maxPatients,
          });
        });
      });

      await availabilityApi.createAvailabilities({ availabilities });
      toast.success("Availability schedule saved successfully");
      setView("main");
    } catch (error) {
      console.error("Failed to save availability:", error);
      toast.error("Failed to save availability schedule");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedDays, timeSessions, consultationDuration, setView]);

  const handleClose = useCallback(() => {
    setCurrentStep("days");
    setSelectedDays([]);
    setConsultationDuration(30);
    setTimeSessions({});
    setView("main");
  }, [setView]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "days":
        return (
          <DaySelectionStep
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
          />
        );
      case "duration":
        return (
          <DurationSelectionStep
            duration={consultationDuration}
            onDurationChange={setConsultationDuration}
          />
        );
      case "sessions":
        return (
          <TimeSessionsStep
            selectedDays={selectedDays}
            consultationDuration={consultationDuration}
            timeSessions={timeSessions}
            onTimeSessionsChange={setTimeSessions}
          />
        );
      case "review":
        return (
          <ReviewStep
            selectedDays={selectedDays}
            consultationDuration={consultationDuration}
            timeSessions={timeSessions}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "days":
        return selectedDays.length > 0;
      case "duration":
        return consultationDuration > 0;
      case "sessions":
        return selectedDays.every(
          (day) => timeSessions[day] && timeSessions[day].length > 0
        );
      case "review":
        return true;
      default:
        return false;
    }
  };

  return (
    <section className="container mx-auto">
      {/* Header */}
      <Button
        onClickHandler={handleClose}
        leadingIcon={<ArrowLeft className="w-4 h-4" />}
        text="Back to Schedule"
      />
      <div className="flex flex-col items-center justify-center mb-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Set Your Availability
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your weekly consultation schedule
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStepIndex
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-10 sm:w-16 h-1 mx-2 ${
                    index < currentStepIndex
                      ? "bg-primary"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        {renderCurrentStep()}
        {/* Footer */}
        <div className="flex items-center justify-between mt-8">
          <Button
            onClickHandler={handlePrevious}
            isDisabled={currentStep === "days"}
            additionalClasses="secondarybtn"
            leadingIcon={<ChevronLeft className="w-4 h-4" />}
            text="Previous"
          />

          <div className="flex items-center space-x-3">
            {/* <Button
            onClickHandler={handleClose}
            additionalClasses="secondarybtn"
            text="Cancel"
          /> */}
            {currentStep === "review" ? (
              <Button
                onClickHandler={handleSave}
                isDisabled={isSubmitting}
                additionalClasses="primarybtn"
                text={isSubmitting ? "Saving..." : "Save Schedule"}
                leadingIcon={
                  isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : undefined
                }
              />
            ) : (
              <Button
                onClickHandler={handleNext}
                isDisabled={!canProceed()}
                additionalClasses="primarybtn"
                text="Next"
                trailingIcon={<ChevronRight className="w-4 h-4" />}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
