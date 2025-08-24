"use client";

import React from "react";
import { useDoctorApplication } from "@/contexts/DoctorApplicationContext";
import DoctorSidebar from "@/components/onboarding/doctor/DoctorSidebar";
import { DoctorApplicationProvider } from "@/contexts/DoctorApplicationContext";

// Import step components
import {
  Step1_BasicInfo,
  Step2_Specialties,
  Step3_AddressLocation,
  Step4_Documents,
  Step5_PaymentSetup,
  Step6_Review,
  Step7_Success,
} from "@/components/onboarding/doctor/steps";

// This is the main component that renders the correct step
const DoctorApplicationFlow = () => {
  const { activeStep, STEPS, visitedSteps } = useDoctorApplication();

  const renderStep = () => {
    switch (activeStep) {
      case STEPS.BASIC_INFO:
        return <Step1_BasicInfo />;
      case STEPS.SPECIALTIES:
        return <Step2_Specialties />;
      case STEPS.ADDRESS_LOCATION:
        return <Step3_AddressLocation />;
      case STEPS.DOCUMENTS:
        return <Step4_Documents />;
      case STEPS.PAYMENT_SETUP:
        return <Step5_PaymentSetup />;
      case STEPS.REVIEW:
        return <Step6_Review />;
      case STEPS.SUCCESS:
        return <Step7_Success />;
      default:
        return <Step1_BasicInfo />;
    }
  };

  // Don't show the stepper on the success page
  if (activeStep === STEPS.SUCCESS) {
    return renderStep();
  }

  return (
    <section className="flex flex-col lg:flex-row bg-white dark:bg-gray-900 max-h-[90vh]">
      <DoctorSidebar currentStep={activeStep} visitedSteps={visitedSteps} />
      <main className="flex-1 grid sm:place-items-center overflow-y-auto h-screen overflow-auto scrollbar-hide max-h-[90vh]">
        {renderStep()}
      </main>
    </section>
  );
};

// The wrapper that provides the context
const DoctorApplicationPage = () => {
  return (
    <DoctorApplicationProvider>
      <DoctorApplicationFlow />
    </DoctorApplicationProvider>
  );
};

export default DoctorApplicationPage;
