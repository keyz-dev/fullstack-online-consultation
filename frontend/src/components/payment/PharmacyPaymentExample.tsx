import React from "react";
import { PaymentMethodsSection } from "./";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";

// Example of how pharmacies can use the same payment system
const PharmacyPaymentExample = () => {
  const {
    paymentMethods,
    errors,
    togglePaymentMethod,
    updatePaymentMethod,
    canSavePaymentMethod,
    savePaymentMethod,
    getPaymentMethodsForAPI,
    hasValidPaymentMethods,
  } = usePaymentMethods();

  const handleSavePaymentMethod = (method: "OM" | "MoMo") => {
    const isValid = savePaymentMethod(method);
    if (isValid) {
      console.log("Payment method saved:", method);
      console.log("All payment methods:", getPaymentMethodsForAPI());
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Pharmacy Payment Setup
      </h2>

      <PaymentMethodsSection
        paymentMethods={paymentMethods}
        errors={errors}
        onTogglePaymentMethod={togglePaymentMethod}
        onPaymentMethodChange={updatePaymentMethod}
        onSavePaymentMethod={handleSavePaymentMethod}
        canSavePaymentMethod={canSavePaymentMethod}
      />

      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
          Reusability Benefits:
        </h3>
        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
          <li>✅ Same payment components used by doctors and pharmacies</li>
          <li>✅ Consistent UI/UX across the platform</li>
          <li>✅ Shared validation logic and error handling</li>
          <li>✅ Easy to maintain and update</li>
          <li>✅ TypeScript support with proper interfaces</li>
        </ul>
      </div>
    </div>
  );
};

export default PharmacyPaymentExample;
