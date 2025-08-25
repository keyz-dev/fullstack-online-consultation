import React from "react";
import { PaymentMethodContainer } from "./";
import { Input, PhoneInput } from "../ui";
import { CreditCard } from "lucide-react";

interface PaymentMethodData {
  enabled: boolean;
  accountNumber: string;
  accountName: string;
  isSaved?: boolean;
}

interface PaymentMethodsState {
  OM: PaymentMethodData;
  MoMo: PaymentMethodData;
}

interface PaymentMethodsErrors {
  omNumber?: string;
  omAccountName?: string;
  momoNumber?: string;
  momoAccountName?: string;
}

// Payment method icons - you can replace these with actual images
const MTNIcon = () => (
  <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-lg">MTN</span>
  </div>
);

const OMIcon = () => (
  <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-lg">OM</span>
  </div>
);

interface PaymentMethodsSectionProps {
  paymentMethods: PaymentMethodsState;
  errors: PaymentMethodsErrors;
  onTogglePaymentMethod: (method: keyof PaymentMethodsState) => void;
  onPaymentMethodChange: (
    method: keyof PaymentMethodsState,
    field: keyof PaymentMethodData,
    value: string
  ) => void;
  onSavePaymentMethod: (method: keyof PaymentMethodsState) => void;
  canSavePaymentMethod: (method: keyof PaymentMethodsState) => boolean;
}

const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({
  paymentMethods,
  errors,
  onTogglePaymentMethod,
  onPaymentMethodChange,
  onSavePaymentMethod,
  canSavePaymentMethod,
}) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="text-gray-700 dark:text-gray-300" size={24} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Methods
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {
              Object.values(paymentMethods).filter((method) => method.isSaved)
                .length
            }{" "}
            of {Object.keys(paymentMethods).length} configured
          </span>
          <div className="flex space-x-1">
            {Object.values(paymentMethods).map((method, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  method.isSaved
                    ? "bg-green-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Orange Money */}
        <PaymentMethodContainer
          icon={<OMIcon />}
          title="Orange Money, OM Cameroon"
          description="Receive payments via orange money."
          isEnabled={paymentMethods.OM.enabled}
          onToggle={() => onTogglePaymentMethod("OM")}
          onSave={() => onSavePaymentMethod("OM")}
          canSave={canSavePaymentMethod("OM")}
          isSaved={paymentMethods.OM.isSaved}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PhoneInput
              label="Orange Money Number"
              name="omNumber"
              value={paymentMethods.OM.accountNumber}
              onChangeHandler={(e) =>
                onPaymentMethodChange("OM", "accountNumber", e.target.value)
              }
              placeholder="Enter account number"
              required={true}
              error={errors.omNumber}
            />
            <Input
              label="Account Name"
              value={paymentMethods.OM.accountName}
              onChangeHandler={(e) =>
                onPaymentMethodChange("OM", "accountName", e.target.value)
              }
              placeholder="Enter account holder name"
              required={true}
              error={errors.omAccountName}
            />
          </div>
        </PaymentMethodContainer>

        {/* MTN Mobile Money */}
        <PaymentMethodContainer
          icon={<MTNIcon />}
          title="MTN Mobile Money, MoMo"
          description="Receive payments via Momo."
          isEnabled={paymentMethods.MoMo.enabled}
          onToggle={() => onTogglePaymentMethod("MoMo")}
          onSave={() => onSavePaymentMethod("MoMo")}
          canSave={canSavePaymentMethod("MoMo")}
          isSaved={paymentMethods.MoMo.isSaved}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PhoneInput
              label="Momo Number"
              name="momoNumber"
              value={paymentMethods.MoMo.accountNumber}
              onChangeHandler={(e) =>
                onPaymentMethodChange("MoMo", "accountNumber", e.target.value)
              }
              placeholder="Enter account number"
              required={true}
              error={errors.momoNumber}
            />
            <Input
              label="Account Name"
              value={paymentMethods.MoMo.accountName}
              onChangeHandler={(e) =>
                onPaymentMethodChange("MoMo", "accountName", e.target.value)
              }
              placeholder="Enter account holder name"
              required={true}
              error={errors.momoAccountName}
            />
          </div>
        </PaymentMethodContainer>
      </div>
    </section>
  );
};

export default PaymentMethodsSection;
