import React, { useState } from "react";
import { useDoctorApplication } from "../../../../contexts/DoctorApplicationContext";
import { Input, StepNavButtons } from "../../../ui";

const Step5_PaymentSetup = () => {
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
    paymentMethods: "",
  });

  const paymentMethodOptions = [
    { id: "cash", label: "Cash", description: "In-person cash payments" },
    { id: "card", label: "Card", description: "Credit/Debit card payments" },
    {
      id: "mobile_money",
      label: "Mobile Money",
      description: "Mobile money transfers",
    },
    {
      id: "bank_transfer",
      label: "Bank Transfer",
      description: "Direct bank transfers",
    },
    {
      id: "wallet",
      label: "Digital Wallet",
      description: "Platform wallet payments",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateField(name, value);

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePaymentMethodChange = (methodId: string, checked: boolean) => {
    const currentMethods = doctorData.paymentMethods || [];
    let updatedMethods: string[];

    if (checked) {
      updatedMethods = [...currentMethods, methodId];
    } else {
      updatedMethods = currentMethods.filter((method) => method !== methodId);
    }

    updateField("paymentMethods", updatedMethods);

    // Clear error when user makes a selection
    if (errors.paymentMethods) {
      setErrors((prev) => ({ ...prev, paymentMethods: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      consultationFee: "",
      paymentMethods: "",
    };
    let isValid = true;

    if (!doctorData.consultationFee) {
      newErrors.consultationFee = "Consultation fee is required";
      isValid = false;
    } else if (parseFloat(doctorData.consultationFee) <= 0) {
      newErrors.consultationFee = "Consultation fee must be greater than 0";
      isValid = false;
    }

    if (!doctorData.paymentMethods || doctorData.paymentMethods.length === 0) {
      newErrors.paymentMethods = "At least one payment method is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleContinue = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  const canContinue =
    !!doctorData.consultationFee &&
    doctorData.paymentMethods &&
    doctorData.paymentMethods.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Consultation Duration (minutes)
            </label>
            <select
              name="consultationDuration"
              value={doctorData.consultationDuration}
              onChange={(e) =>
                updateField("consultationDuration", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Standard duration for each consultation session
            </p>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Accepted Payment Methods *
            </label>
            <div className="space-y-3">
              {paymentMethodOptions.map((method) => (
                <label
                  key={method.id}
                  className="flex items-start space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={
                      doctorData.paymentMethods?.includes(method.id) || false
                    }
                    onChange={(e) =>
                      handlePaymentMethodChange(method.id, e.target.checked)
                    }
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {method.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {method.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.paymentMethods && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.paymentMethods}
              </p>
            )}
          </div>

          {/* Information Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Payment Information:
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Consultation fees are charged per session</li>
              <li>• Payment is processed securely through our platform</li>
              <li>
                • You'll receive payment within 24-48 hours after consultation
              </li>
              <li>• Platform fees may apply (typically 5-10%)</li>
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

export default Step5_PaymentSetup;
