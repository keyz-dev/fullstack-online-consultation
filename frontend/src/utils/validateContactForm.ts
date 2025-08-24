interface ContactField {
  id: string;
  label: string;
  type: string;
  value: string;
}

interface ContactErrors {
  contactFields: string | Array<{ value: string }>;
}

export const validateContactForm = (
  contactFields: ContactField[],
  setErrors: (errors: ContactErrors) => void
): boolean => {
  const newErrors: ContactErrors = {
    contactFields: "",
  };

  let isValid = true;

  if (contactFields.length === 0) {
    newErrors.contactFields = "Please add at least one contact information";
    isValid = false;
  }

  // Validate each contact field
  const contactErrors = contactFields.map((field) => {
    const error = { value: "" };

    if (!field.value.trim()) {
      error.value = `${field.label} is required`;
      isValid = false;
      return error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

    switch (field.type) {
      case "email":
        if (!emailRegex.test(field.value)) {
          error.value = "Please enter a valid email address";
          isValid = false;
        }
        break;

      case "tel":
        if (!phoneRegex.test(field.value.replace(/\s/g, ""))) {
          error.value = "Please enter a valid phone number";
          isValid = false;
        }
        break;

      case "url":
        try {
          new URL(field.value);
        } catch {
          error.value = "Please enter a valid URL";
          isValid = false;
        }
        break;
    }

    return error;
  });

  setErrors({
    ...newErrors,
    contactFields: contactErrors,
  });

  return isValid;
};
