import { useState, useCallback } from "react";
import { PaymentMethod } from "@/api";

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

export const usePaymentMethods = (initialState?: PaymentMethodsState) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodsState>(
    initialState || {
      OM: {
        enabled: false,
        accountNumber: "",
        accountName: "",
        isSaved: false,
      },
      MoMo: {
        enabled: false,
        accountNumber: "",
        accountName: "",
        isSaved: false,
      },
    }
  );

  const [errors, setErrors] = useState<PaymentMethodsErrors>({});

  // Toggle payment method on/off
  const togglePaymentMethod = useCallback(
    (method: keyof PaymentMethodsState) => {
      setPaymentMethods((prev) => ({
        ...prev,
        [method]: {
          ...prev[method],
          enabled: !prev[method].enabled,
        },
      }));

      // Clear errors when toggling
      if (method === "OM") {
        setErrors((prev) => ({ ...prev, omNumber: "", omAccountName: "" }));
      } else if (method === "MoMo") {
        setErrors((prev) => ({ ...prev, momoNumber: "", momoAccountName: "" }));
      }
    },
    []
  );

  // Update payment method field
  const updatePaymentMethod = useCallback(
    (
      method: keyof PaymentMethodsState,
      field: keyof PaymentMethodData,
      value: string
    ) => {
      setPaymentMethods((prev) => ({
        ...prev,
        [method]: {
          ...prev[method],
          [field]: value,
          isSaved: false, // Reset saved state when user makes changes
        },
      }));

      // Clear error when user types
      if (method === "OM") {
        if (field === "accountNumber") {
          setErrors((prev) => ({ ...prev, omNumber: "" }));
        } else if (field === "accountName") {
          setErrors((prev) => ({ ...prev, omAccountName: "" }));
        }
      } else if (method === "MoMo") {
        if (field === "accountNumber") {
          setErrors((prev) => ({ ...prev, momoNumber: "" }));
        } else if (field === "accountName") {
          setErrors((prev) => ({ ...prev, momoAccountName: "" }));
        }
      }
    },
    []
  );

  // Validate phone number format (Cameroon)
  const validatePhoneNumber = useCallback((phone: string): boolean => {
    // Remove all spaces and special characters
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

    // Cameroon phone number patterns:
    // +237 6XXXXXXXX or +237 9XXXXXXXX
    // 237 6XXXXXXXX or 237 9XXXXXXXX
    // 6XXXXXXXX or 9XXXXXXXX
    const phoneRegex = /^(\+?237\s*)?[69]\d{8}$/;
    return phoneRegex.test(cleanPhone);
  }, []);

  // Check if a payment method can be saved
  const canSavePaymentMethod = useCallback(
    (method: keyof PaymentMethodsState): boolean => {
      const methodData = paymentMethods[method];
      if (!methodData.enabled) return false;

      const hasAccountNumber = methodData.accountNumber.trim().length > 0;
      const hasAccountName = methodData.accountName.trim().length > 0;

      // Only require basic fields to be filled to enable save button
      // Phone validation will be done when actually saving
      return hasAccountNumber && hasAccountName;
    },
    [paymentMethods]
  );

  // Save a payment method (validate and mark as saved)
  const savePaymentMethod = useCallback(
    (method: keyof PaymentMethodsState) => {
      const methodData = paymentMethods[method];
      const newErrors: PaymentMethodsErrors = { ...errors };

      // Validate account number
      if (!methodData.accountNumber.trim()) {
        if (method === "OM") {
          newErrors.omNumber = "Account number is required";
        } else if (method === "MoMo") {
          newErrors.momoNumber = "Account number is required";
        }
      } else if (!validatePhoneNumber(methodData.accountNumber)) {
        if (method === "OM") {
          newErrors.omNumber = "Please enter a valid Cameroon phone number";
        } else if (method === "MoMo") {
          newErrors.momoNumber = "Please enter a valid Cameroon phone number";
        }
      }

      // Validate account name
      if (!methodData.accountName.trim()) {
        if (method === "OM") {
          newErrors.omAccountName = "Account name is required";
        } else if (method === "MoMo") {
          newErrors.momoAccountName = "Account name is required";
        }
      }

      setErrors(newErrors);

      // Check if there are any errors for this specific method
      const hasMethodErrors =
        (method === "OM" && (newErrors.omNumber || newErrors.omAccountName)) ||
        (method === "MoMo" &&
          (newErrors.momoNumber || newErrors.momoAccountName));

      if (!hasMethodErrors) {
        // Mark as saved
        setPaymentMethods((prev) => ({
          ...prev,
          [method]: {
            ...prev[method],
            isSaved: true,
          },
        }));
      }

      return !hasMethodErrors;
    },
    [paymentMethods, errors, validatePhoneNumber]
  );

  // Convert to API format
  const getPaymentMethodsForAPI = useCallback((): PaymentMethod[] => {
    const apiMethods: PaymentMethod[] = [];

    if (
      paymentMethods.OM.enabled &&
      paymentMethods.OM.accountNumber.trim() &&
      paymentMethods.OM.accountName.trim() &&
      validatePhoneNumber(paymentMethods.OM.accountNumber)
    ) {
      apiMethods.push({
        method: "OM", // Use the correct schema value
        value: {
          accountNumber: paymentMethods.OM.accountNumber,
          accountName: paymentMethods.OM.accountName,
        },
      });
    }

    if (
      paymentMethods.MoMo.enabled &&
      paymentMethods.MoMo.accountNumber.trim() &&
      paymentMethods.MoMo.accountName.trim() &&
      validatePhoneNumber(paymentMethods.MoMo.accountNumber)
    ) {
      apiMethods.push({
        method: "MoMo", // Use the correct schema value
        value: {
          accountNumber: paymentMethods.MoMo.accountNumber,
          accountName: paymentMethods.MoMo.accountName,
        },
      });
    }

    return apiMethods;
  }, [paymentMethods, validatePhoneNumber]);

  // Check if at least one payment method is configured
  const hasValidPaymentMethods = useCallback((): boolean => {
    return getPaymentMethodsForAPI().length > 0;
  }, [getPaymentMethodsForAPI]);

  return {
    paymentMethods,
    errors,
    togglePaymentMethod,
    updatePaymentMethod,
    canSavePaymentMethod,
    savePaymentMethod,
    getPaymentMethodsForAPI,
    hasValidPaymentMethods,
  };
};
