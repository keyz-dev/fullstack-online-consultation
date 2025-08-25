# Payment System Documentation

## Overview

This is a highly reusable payment system that can be used by doctors, pharmacies, and any other vendors in the platform. It provides a consistent UI/UX with proper validation and TypeScript support.

## Components

### 1. PaymentMethodContainer

A reusable container component that provides:

- Toggle switch for enabling/disabling payment methods
- Collapsible content area for input fields
- Individual save functionality
- Dark mode support

### 2. PaymentMethodsSection

A complete payment methods section that includes:

- Orange Money (OM) payment method
- MTN Mobile Money (MoMo) payment method
- Proper validation and error handling
- Responsive design

### 3. usePaymentMethods Hook

A custom hook that manages:

- Payment method state
- Validation logic
- Error handling
- API format conversion

## Usage

### For Doctors

```tsx
import { PaymentMethodsSection } from "@/components/payment";
import { usePaymentMethods } from "@/hooks";

const DoctorPaymentSetup = () => {
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
      // Update your context or state
      updateField("paymentMethods", getPaymentMethodsForAPI());
    }
  };

  return (
    <PaymentMethodsSection
      paymentMethods={paymentMethods}
      errors={errors}
      onTogglePaymentMethod={togglePaymentMethod}
      onPaymentMethodChange={updatePaymentMethod}
      onSavePaymentMethod={handleSavePaymentMethod}
      canSavePaymentMethod={canSavePaymentMethod}
    />
  );
};
```

### For Pharmacies

```tsx
import { PaymentMethodsSection } from "@/components/payment";
import { usePaymentMethods } from "@/hooks";

const PharmacyPaymentSetup = () => {
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

  // Same implementation as doctors
  // The components are completely reusable
};
```

## Features

### ✅ Validation

- Phone number format validation (Cameroon format)
- Required field validation
- Real-time error clearing

### ✅ User Experience

- Smooth animations and transitions
- Individual save buttons for each method
- Clear error messages
- Responsive design

### ✅ TypeScript Support

- Fully typed interfaces
- Proper error handling
- API format compliance

### ✅ Dark Mode

- Consistent dark mode support
- Proper contrast and readability

### ✅ Reusability

- Same components for all user types
- Consistent behavior across the platform
- Easy to maintain and update

## API Format

The system automatically converts to the correct API format:

```typescript
interface PaymentMethod {
  method: string; // "OM" or "MoMo"
  value: {
    accountNumber: string; // Phone number
    accountName: string; // Account holder name
  };
}
```

## Customization

### Adding New Payment Methods

1. Update the `PaymentMethodsState` interface
2. Add the new method to the `PaymentMethodsSection` component
3. Update validation logic in the hook
4. Add appropriate icons

### Styling

All components use Tailwind CSS classes and support dark mode. You can customize the styling by modifying the className props.

## Error Handling

The system provides comprehensive error handling:

- Field-level validation
- Real-time error clearing
- User-friendly error messages
- Proper TypeScript error types
