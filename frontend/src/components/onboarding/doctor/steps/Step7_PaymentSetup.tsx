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
      console.log(`Payment method ${method} saved successfully:`, apiMethods);
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
            {getStepTitle(4)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(4)}
          </p>
        </div>

        <div className="space-y-6">
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Set your consultation fee in Central African CFA franc (XAF)
            </p>
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

          {/* Payment Methods Section */}
          <PaymentMethodsSection
            paymentMethods={paymentMethods}
            errors={paymentErrors}
            onTogglePaymentMethod={togglePaymentMethod}
            onPaymentMethodChange={updatePaymentMethod}
            onSavePaymentMethod={handleSavePaymentMethod}
            canSavePaymentMethod={canSavePaymentMethod}
          />

          {/* Information Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Payment Information:
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Consultation fees are charged per session</li>
              <li>• Payment is processed securely through our platform</li>
              <li>
                • You&apos;ll receive payment within 24-48 hours after
                consultation
              </li>
              <li>• Platform fees may apply (typically 5-10%)</li>
              <li>• At least one payment method is required</li>
            </ul>
          </div>

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
