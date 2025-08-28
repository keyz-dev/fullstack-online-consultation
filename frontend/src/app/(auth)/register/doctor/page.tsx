"use client";

import React from "react";
import { useDoctorApplication } from "@/contexts/DoctorApplicationContext";
import DoctorSidebar from "@/components/onboarding/doctor/DoctorSidebar";
import { DoctorApplicationProvider } from "@/contexts/DoctorApplicationContext";
import { BaseSpecialtyProvider } from "@/contexts/BaseSpecialtyContext";
import RouteProtection from "@/components/auth/RouteProtection";

// Import step components
import {
  Step1_BasicUserInfo,
  Step2_EmailVerification,
  Step3_ProfessionalInfo,
  Step4_Specialties,
  Step5_AddressLocation,
  Step6_Documents,
  Step7_PaymentSetup,
  Step8_Review,
  Step9_Success,
} from "@/components/onboarding/doctor/steps";

// This is the main component that renders the correct step
const DoctorApplicationFlow = () => {
  const { activeStep, STEPS, visitedSteps } = useDoctorApplication();

  const renderStep = () => {
    switch (activeStep) {
      case STEPS.BASIC_USER_INFO:
        return <Step1_BasicUserInfo />;
      case STEPS.EMAIL_VERIFICATION:
        return <Step2_EmailVerification />;
      case STEPS.PROFESSIONAL_INFO:
        return <Step3_ProfessionalInfo />;
      case STEPS.SPECIALTIES:
        return <Step4_Specialties />;
      case STEPS.ADDRESS_LOCATION:
        return <Step5_AddressLocation />;
      case STEPS.DOCUMENTS:
        return <Step6_Documents />;
      case STEPS.PAYMENT_SETUP:
        return <Step7_PaymentSetup />;
      case STEPS.REVIEW:
        return <Step8_Review />;
      case STEPS.SUCCESS:
        return <Step9_Success />;
      default:
        return <Step1_BasicUserInfo />;
    }
  };

  return (
    <section className="flex flex-col lg:flex-row bg-white dark:bg-gray-900 max-h-[90vh]">
      {/* Don't show the sidebar on the success page */}
      {activeStep !== STEPS.SUCCESS && (
        <DoctorSidebar currentStep={activeStep} visitedSteps={visitedSteps} />
      )}
      <main
        className={`flex-1 grid sm:place-items-center overflow-y-auto overflow-auto scrollbar-hide max-h-[90vh] ${
          activeStep === STEPS.SUCCESS ? "w-full" : ""
        }`}
      >
        {renderStep()}
      </main>
    </section>
  );
};

// The wrapper that provides the context
const DoctorApplicationPage = () => {
  return (
    <BaseSpecialtyProvider>
      <DoctorApplicationProvider>
        <RouteProtection
          allowedRoles={["patient", "incomplete_doctor", "pending_doctor"]}
          restrictedRoles={["doctor", "admin", "pharmacy", "pending_pharmacy"]}
          redirectTo="/doctor/application-status"
        >
          <DoctorApplicationFlow />
        </RouteProtection>
      </DoctorApplicationProvider>
    </BaseSpecialtyProvider>
  );
};

export default DoctorApplicationPage;
