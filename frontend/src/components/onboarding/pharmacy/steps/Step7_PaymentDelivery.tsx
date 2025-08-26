import React, { useState, useEffect } from "react";
import { usePharmacyApplication } from "../../../../contexts/PharmacyApplicationContext";
import { StepNavButtons } from "../../../ui";
import { PaymentMethodsSection } from "../../../payment";
import { ShippingConfiguration } from "../../../shipping";
import { usePaymentMethods } from "../../../../hooks/usePaymentMethods";
import { PaymentMethod } from "@/api";
import { CreditCard, Truck, Info } from "lucide-react";

const Step7_PaymentDelivery = () => {
  const {
    pharmacyData,
    updateField,
    nextStep,
    prevStep,
    getStepTitle,
    getStepSubtitle,
  } = usePharmacyApplication();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPaymentInfoOpen, setIsPaymentInfoOpen] = useState(false);
  const [isShippingInfoOpen, setIsShippingInfoOpen] = useState(false);

  // Initialize payment methods from existing data
  const initializePaymentMethods = () => {
    const existingMethods = pharmacyData.paymentMethods || [];
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

  const handleShippingChange = (shipping: any) => {
    updateField("shipping", shipping);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate payment methods
    if (!hasValidPaymentMethods()) {
      newErrors.paymentMethods = "At least one payment method is required";
      isValid = false;
    }

    // Validate shipping configuration
    if (
      !pharmacyData.shipping.deliverLocally &&
      !pharmacyData.shipping.deliverNationally &&
      !pharmacyData.shipping.deliverInternationally
    ) {
      newErrors.shipping = "At least one delivery area must be selected";
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

  const canContinue =
    hasValidPaymentMethods() &&
    (pharmacyData.shipping.deliverLocally ||
      pharmacyData.shipping.deliverNationally ||
      pharmacyData.shipping.deliverInternationally);

  return (
    <div className="w-full max-w-4xl mx-auto">
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
          {/* Payment Methods Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <PaymentMethodsSection
              paymentMethods={paymentMethods}
              errors={paymentErrors}
              onTogglePaymentMethod={togglePaymentMethod}
              onPaymentMethodChange={updatePaymentMethod}
              onSavePaymentMethod={handleSavePaymentMethod}
              canSavePaymentMethod={canSavePaymentMethod}
            />

            {errors.paymentMethods && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.paymentMethods}
              </p>
            )}
          </div>

          {/* Shipping Configuration Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <ShippingConfiguration
              shipping={pharmacyData.shipping}
              onShippingChange={handleShippingChange}
              errors={errors}
            />

            {errors.shipping && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.shipping}
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Summary:
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>
                • Payment Methods: {pharmacyData.paymentMethods?.length || 0}{" "}
                configured
              </p>
              <p>
                • Delivery Areas:{" "}
                {[
                  pharmacyData.shipping.deliverLocally && "Local",
                  pharmacyData.shipping.deliverNationally && "National",
                  pharmacyData.shipping.deliverInternationally &&
                    "International",
                ]
                  .filter(Boolean)
                  .join(", ") || "None selected"}
              </p>
              <p>
                • Free Shipping: Orders above{" "}
                {pharmacyData.shipping.freeShippingThreshold.toLocaleString()}{" "}
                XAF
              </p>
              <p>
                • Cash on Delivery:{" "}
                {pharmacyData.shipping.allowCashOnDelivery
                  ? "Enabled"
                  : "Disabled"}
              </p>
            </div>
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

export default Step7_PaymentDelivery;
