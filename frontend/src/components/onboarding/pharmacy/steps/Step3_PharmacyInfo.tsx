import React, { useEffect, useState } from "react";
import { usePharmacyApplication } from "../../../../contexts/PharmacyApplicationContext";
import {
  StepNavButtons,
  Input,
  TextArea,
  TagInput,
  ContactInfo,
  FileUploader,
} from "../../../ui";
import { useRouter } from "next/navigation";

interface ContactField {
  id: string;
  label: string;
  type: string;
  value: string;
}

const Step3_PharmacyInfo = () => {
  const router = useRouter();
  const {
    pharmacyData,
    updatePharmacyData,
    updateField,
    nextStep,
    isLoading,
    prevStep,
    getStepTitle,
    getStepSubtitle,
    canContinue,
  } = usePharmacyApplication();

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);

  // Define contact types (can be fetched from backend if needed)
  const contactTypes = React.useMemo(
    () => [
      { id: "phone", label: "Phone Number", type: "tel" },
      { id: "whatsapp", label: "WhatsApp", type: "tel" },
      { id: "telegram", label: "Telegram", type: "tel" },
      { id: "website", label: "Website URL", type: "url" },
      { id: "facebook", label: "Facebook", type: "url" },
      { id: "instagram", label: "Instagram", type: "url" },
      { id: "linkedin", label: "LinkedIn", type: "url" },
    ],
    []
  );

  const [contactFields, setContactFields] = useState<ContactField[]>([]);

  // Initialize contact fields from context data
  useEffect(() => {
    if (pharmacyData.contactInfo && pharmacyData.contactInfo.length > 0) {
      const fields = pharmacyData.contactInfo.map((contact) => ({
        id: contact.type,
        label:
          contactTypes.find((type) => type.id === contact.type)?.label ||
          contact.type,
        type:
          contactTypes.find((type) => type.id === contact.type)?.type || "text",
        value: contact.value,
      }));
      setContactFields(fields);
    }
  }, [pharmacyData.contactInfo, contactTypes]);

  useEffect(() => {
    if (pharmacyData.pharmacyLogo) {
      setLogo(pharmacyData.pharmacyLogo);
      setLogoPreview(URL.createObjectURL(pharmacyData.pharmacyLogo));
    }
  }, [pharmacyData.pharmacyLogo]);

  const [errors, setErrors] = useState({
    pharmacyName: "",
    licenseNumber: "",
    description: "",
    languages: "",
    contactFields: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    updateField(name, value);

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayChange = (field: string, values: string[]) => {
    updateField(field, values);
  };

  // Update context when contact fields change
  const handleContactFieldsChange = (fields: ContactField[]) => {
    setContactFields(fields);

    // Update the context with the new contact info
    const contactInfo = fields.map(({ id: type, value }) => ({
      type,
      value,
    }));
    updateField("contactInfo", contactInfo);
  };

  const validateForm = () => {
    const newErrors = {
      pharmacyName: "",
      licenseNumber: "",
      description: "",
      languages: "",
      contactFields: "",
    };
    let isValid = true;

    if (!pharmacyData.pharmacyName?.trim()) {
      newErrors.pharmacyName = "Pharmacy name is required";
      isValid = false;
    }

    if (!pharmacyData.licenseNumber?.trim()) {
      newErrors.licenseNumber = "License number is required";
      isValid = false;
    }

    if (!pharmacyData.description?.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!pharmacyData.languages?.length) {
      newErrors.languages = "At least one language is required";
      isValid = false;
    }

    // Validate contact fields
    if (contactFields.length === 0) {
      newErrors.contactFields = "At least one contact field is required";
      isValid = false;
    } else {
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

      // Check if any contact field has errors
      const hasContactErrors = contactErrors.some(
        (error) => error.value !== ""
      );
      if (hasContactErrors) {
        newErrors.contactFields = "Please fix contact field errors";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Convert contact fields to the format expected by the backend
    const contactInfo = contactFields.map(({ id: type, value }) => ({
      type,
      value,
    }));
    // Update the pharmacy data with contact info
    updateField("contactInfo", contactInfo);
    updateField("pharmacyLogo", logo);
    nextStep();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-1 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getStepTitle(3)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(3)}
          </p>
        </div>

        <div className="space-y-6 sm:px-6">
          {/* Pharmacy Information */}
          <div className="space-y-4">
            {/* Pharmacy Logo */}
            <div className="flex justify-start">
              <FileUploader
                preview={logoPreview || undefined}
                onChange={(file) => {
                  setLogo(file);
                  setLogoPreview(URL.createObjectURL(file));
                }}
                text="Pharmacy Logo"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Pharmacy Name"
                name="pharmacyName"
                value={pharmacyData.pharmacyName}
                placeholder="Enter pharmacy name"
                error={errors.pharmacyName}
                onChangeHandler={handleInputChange}
                required
              />
              <Input
                label="License Number"
                name="licenseNumber"
                value={pharmacyData.licenseNumber}
                placeholder="Enter pharmacy license number"
                error={errors.licenseNumber}
                onChangeHandler={handleInputChange}
                required
              />
            </div>

            <TextArea
              label="Description"
              name="description"
              value={pharmacyData.description || ""}
              placeholder="Tell us about your pharmacy and services"
              onChangeHandler={handleInputChange}
              rows={4}
            />

            {/* Contact Information Section */}
            <div className="">
              <ContactInfo
                contactFields={contactFields}
                setContactFields={handleContactFieldsChange}
                contactTypes={contactTypes}
                errors={errors}
              />

              {errors.contactFields &&
                typeof errors.contactFields === "string" && (
                  <div className="text-red-500 text-sm -mt-4 mb-2">
                    {errors.contactFields}
                  </div>
                )}
            </div>

            {/* Languages */}
            <TagInput
              label="Languages Spoken"
              value={pharmacyData.languages || []}
              onChangeHandler={(values) =>
                handleArrayChange("languages", values)
              }
              placeholder="Add languages you speak (e.g., English, French, Arabic)"
            />
          </div>

          {/* Navigation */}
          <StepNavButtons
            onBack={() => {}}
            isLoading={isLoading}
            onContinue={handleSubmit}
            canContinue={
              !!pharmacyData.pharmacyName &&
              !!pharmacyData.licenseNumber &&
              !!pharmacyData.description &&
              pharmacyData.languages?.length &&
              pharmacyData.languages.length > 0 &&
              contactFields.length > 0 &&
              contactFields.every((field) => field.value.trim() !== "")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Step3_PharmacyInfo;
