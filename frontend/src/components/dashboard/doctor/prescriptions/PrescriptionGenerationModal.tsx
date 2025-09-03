import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { usePrescriptions } from "@/hooks/usePrescriptions";
import { CreatePrescriptionData } from "@/api/prescriptions";
import { ProgressSteps, StepNavButtons, ModalWrapper } from "@/components/ui";
import {
  Step1_PatientInfo,
  Step2_Diagnosis,
  Step3_Medications,
  Step4_Instructions,
  Step5_Review,
} from "./steps";
import { toast } from "react-toastify";

interface PrescriptionGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: number;
  patientInfo: {
    name: string;
    age: number;
    gender: string;
    contactNumber: string;
  };
  consultationNotes?: string;
}

type PrescriptionStep =
  | "patient-info"
  | "diagnosis"
  | "medications"
  | "instructions"
  | "review";

const PrescriptionGenerationModal: React.FC<
  PrescriptionGenerationModalProps
> = ({ isOpen, onClose, consultationId, patientInfo, consultationNotes }) => {
  const [currentStep, setCurrentStep] =
    useState<PrescriptionStep>("patient-info");
  const [prescriptionData, setPrescriptionData] =
    useState<CreatePrescriptionData>({
      consultationId,
      diagnosis: "",
      medications: [],
      instructions: "",
      dosage: {},
      duration: 7,
      refills: 0,
      notes: consultationNotes || "",
      sideEffects: [],
      contraindications: [],
    });

  const { createPrescription, loading } = usePrescriptions();

  const steps = [
    {
      key: "patient-info",
      label: "Patient Info",
      description: "Review patient details",
    },
    {
      key: "diagnosis",
      label: "Diagnosis",
      description: "Enter diagnosis and notes",
    },
    {
      key: "medications",
      label: "Medications",
      description: "Add medications and dosages",
    },
    {
      key: "instructions",
      label: "Instructions",
      description: "Set duration and instructions",
    },
    {
      key: "review",
      label: "Review",
      description: "Review and generate prescription",
    },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  const handleNext = () => {
    const stepOrder: PrescriptionStep[] = [
      "patient-info",
      "diagnosis",
      "medications",
      "instructions",
      "review",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: PrescriptionStep[] = [
      "patient-info",
      "diagnosis",
      "medications",
      "instructions",
      "review",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    const stepOrder: PrescriptionStep[] = [
      "patient-info",
      "diagnosis",
      "medications",
      "instructions",
      "review",
    ];
    setCurrentStep(stepOrder[stepIndex]);
  };

  const updatePrescriptionData = (updates: Partial<CreatePrescriptionData>) => {
    setPrescriptionData((prev) => ({ ...prev, ...updates }));
  };

  const handleGeneratePrescription = async () => {
    try {
      // Start prescription creation (this now handles PDF generation in background)
      const result = await createPrescription(prescriptionData);

      if (result.success) {
        // Close modal immediately
        onClose();
      }
    } catch (error) {
      console.error("Failed to create prescription:", error);
      toast.error("Failed to start prescription creation. Please try again.");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "patient-info":
        return true; // Always true as it's pre-populated
      case "diagnosis":
        return prescriptionData.diagnosis.trim().length > 0;
      case "medications":
        // Check if there's at least one medication with all required fields
        return (
          prescriptionData.medications.length > 0 &&
          prescriptionData.medications.every(
            (med) =>
              med.name &&
              med.name.trim().length > 0 &&
              med.dosage &&
              med.dosage.trim().length > 0 &&
              med.frequency &&
              med.frequency.trim().length > 0 &&
              med.duration &&
              med.duration.trim().length > 0
          )
        );
      case "instructions":
        return true; // Step 4 is completely optional
      case "review":
        return true;
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "patient-info":
        return (
          <Step1_PatientInfo
            patientInfo={patientInfo}
            onContinue={handleNext}
          />
        );
      case "diagnosis":
        return (
          <Step2_Diagnosis
            diagnosis={prescriptionData.diagnosis}
            notes={prescriptionData.notes}
            onUpdate={updatePrescriptionData}
            onContinue={handleNext}
          />
        );
      case "medications":
        return (
          <Step3_Medications
            medications={prescriptionData.medications}
            onUpdate={updatePrescriptionData}
            onContinue={handleNext}
          />
        );
      case "instructions":
        return (
          <Step4_Instructions
            instructions={prescriptionData.instructions}
            duration={prescriptionData.duration}
            refills={prescriptionData.refills}
            onUpdate={updatePrescriptionData}
            onContinue={handleNext}
          />
        );
      case "review":
        return (
          <Step5_Review
            prescriptionData={prescriptionData}
            patientInfo={patientInfo}
            onGenerate={handleGeneratePrescription}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Generate Prescription
            </h2>
            <p className="text-gray-600 mt-1">
              Create a prescription for {patientInfo.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Progress Steps - Fixed */}
        <div className="px-6 py-4 border-b flex-shrink-0">
          <ProgressSteps
            steps={steps}
            currentStep={currentStepIndex}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Step Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">{renderCurrentStep()}</div>

        {/* Navigation - Fixed */}
        {currentStep !== "review" && (
          <div className="px-6 py-4 border-t flex-shrink-0">
            <StepNavButtons
              onBack={currentStep !== "patient-info" ? handleBack : null}
              onContinue={handleNext}
              canContinue={canProceed()}
              isLoading={loading}
              onBackText="Back"
              onContinueText="Continue"
            />
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

export default PrescriptionGenerationModal;
