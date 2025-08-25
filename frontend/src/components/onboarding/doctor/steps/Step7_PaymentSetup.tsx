import React, { useState, useEffect } from "react";
import { useDoctorApplication } from "../../../../contexts/DoctorApplicationContext";
import { Input, Select, StepNavButtons } from "../../../ui";
import { PaymentMethodsSection } from "../../../payment";
import { usePaymentMethods } from "../../../../hooks/usePaymentMethods";
import { PaymentMethod } from "@/api";

const Step7_PaymentSetup = () => {
  const {
    doctorData,
    updateField,
    nextStep,
    prevStep,
    getStepTitle,
    getStepSubtitle,
  } = useDoctorApplication();

  const [errors, setErrors] = useState({
    consultationFee: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  // Initialize payment methods from existing data
  const initializePaymentMethods = () => {
    const existingMethods = doctorData.paymentMethods || [];
    const initialState = {
      OM: { enabled: false, accountNumber: "", accountName: "" },
      MoMo: { enabled: false, accountNumber: "", accountName: "" },
    };

    existingMethods.forEach((method: PaymentMethod) => {
      if (method.method === "OM") {
        initialState.OM = {
          enabled: true,
          accountNumber: method.value.accountNumber,
          accountName: method.value.accountName,
        };
      } else if (method.method === "MoMo") {
        initialState.MoMo = {
          enabled: true,
          accountNumber: method.value.accountNumber,
          accountName: method.value.accountName,
        };
      }
    });

    return initialState;
  };

  const {
    paymentMethods,
    errors: paymentErrors,
    togglePaymentMethod,
    updatePaymentMethod,
    canSavePaymentMethod,
    savePaymentMethod,
    getPaymentMethodsForAPI,
    hasValidPaymentMethods,
  } = usePaymentMethods(initializePaymentMethods());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateField(name, value);

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSavePaymentMethod = (method: "OM" | "MoMo") => {
    const isValid = savePaymentMethod(method);
    if (isValid) {
      // Update the context with the new payment methods
      const apiMethods = getPaymentMethodsForAPI();
      updateField("paymentMethods", apiMethods);
    } else {
      console.log(`Payment method ${method} validation failed`);
    }
  };

  const validateForm = () => {
    const newErrors = {
      consultationFee: "",
    };
    let isValid = true;

    if (!doctorData.consultationFee) {
      newErrors.consultationFee = "Consultation fee is required";
      isValid = false;
    } else if (parseFloat(doctorData.consultationFee) <= 0) {
      newErrors.consultationFee = "Consultation fee must be greater than 0";
      isValid = false;
    }

    if (!hasValidPaymentMethods()) {
      // This will be handled by the payment component validation
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Ensure payment methods are updated before proceeding
      updateField("paymentMethods", getPaymentMethodsForAPI());
      nextStep();
    }
  };

  const canContinue = !!doctorData.consultationFee && hasValidPaymentMethods();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getStepTitle(7)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(7)}
          </p>
        </div>

        <div className="space-y-6">
          {/* Consultation Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Consultation Fee */}
            <div>
              <Input
                label="Consultation Fee (XAF)"
                type="number"
                name="consultationFee"
                value={doctorData.consultationFee}
                error={errors.consultationFee}
                onChangeHandler={handleInputChange}
                required
                placeholder="Enter consultation fee in XAF"
                min="0"
                step="100"
              />
            </div>

            {/* Consultation Duration */}
            <Select
              label="Consultation Duration (minutes)"
              name="consultationDuration"
              value={doctorData.consultationDuration}
              onChange={(e) =>
                updateField("consultationDuration", e.target.value)
              }
              options={[
                { label: "15 minutes", value: "15" },
                { label: "30 minutes", value: "30" },
                { label: "45 minutes", value: "45" },
                { label: "60 minutes", value: "60" },
                { label: "90 minutes", value: "90" },
                { label: "120 minutes", value: "120" },
              ]}
            />
          </div>

          {/* Payment Methods Section */}
          <PaymentMethodsSection
            paymentMethods={paymentMethods}
            errors={paymentErrors}
            onTogglePaymentMethod={togglePaymentMethod}
            onPaymentMethodChange={updatePaymentMethod}
            onSavePaymentMethod={handleSavePaymentMethod}
            canSavePaymentMethod={canSavePaymentMethod}
          />

          {/* Collapsible Information Box */}
          {(() => {
            return (
              <div className="w-full">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
                  onClick={() => setIsOpen((prev) => !prev)}
                  aria-expanded={isOpen}
                  aria-controls="payment-info-box"
                >
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Payment Information
                  </span>
                  <svg
                    className={`w-5 h-5 text-blue-700 dark:text-blue-300 transform transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  id="payment-info-box"
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
                  }`}
                  aria-hidden={!isOpen}
                >
                  <ul className="p-4 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Consultation fees are charged per session</li>
                    <li>
                      • Payment is processed securely through our platform
                    </li>
                    <li>
                      • You&apos;ll receive payment within 24-48 hours after
                      consultation
                    </li>
                    <li>• Platform fees may apply (typically 5-10%)</li>
                    <li>• At least one payment method is required</li>
                  </ul>
                </div>
              </div>
            );
          })()}

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

export default Step7_PaymentSetup;
