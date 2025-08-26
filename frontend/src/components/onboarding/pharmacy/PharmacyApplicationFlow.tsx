import React from "react";
import {
  usePharmacyApplication,
  STEPS,
} from "../../../contexts/PharmacyApplicationContext";
import {
  Step1_BasicUserInfo,
  Step2_EmailVerification,
  Step3_PharmacyInfo,
  Step4_AddressLocation,
  Step5_Documents,
  Step6_Images,
} from "./steps";
import PharmacySidebar from "./PharmacySidebar";

const PharmacyApplicationFlow = () => {
  const { activeStep } = usePharmacyApplication();

  const renderStep = () => {
    return <Step6_Images />;
    switch (activeStep) {
      case STEPS.BASIC_USER_INFO:
        return <Step1_BasicUserInfo />;
      case STEPS.EMAIL_VERIFICATION:
        return <Step2_EmailVerification />;
      case STEPS.PHARMACY_INFO:
        return <Step3_PharmacyInfo />;
      case STEPS.ADDRESS_LOCATION:
        return <Step4_AddressLocation />;
      case STEPS.DOCUMENTS:
        return <Step5_Documents />;
      case STEPS.IMAGES:
        return <Step6_Images />;
      case STEPS.PAYMENT_DELIVERY:
        return <div>Payment & Delivery Step (Coming Soon)</div>;
      case STEPS.REVIEW_SUBMIT:
        return <div>Review & Submit Step (Coming Soon)</div>;
      default:
        return <Step1_BasicUserInfo />;
    }
  };

  return (
    <section className="flex flex-col lg:flex-row bg-white dark:bg-gray-900 max-h-[90vh]">
      {/* Sidebar */}
      <div className="hidden lg:block lg:w-80 xl:w-96">
        <PharmacySidebar />
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 grid sm:place-items-center overflow-y-auto overflow-auto scrollbar-hide max-h-[90vh]`}
      >
        {renderStep()}
      </main>
    </section>
  );
};

export default PharmacyApplicationFlow;
