import React, { useState, useEffect } from "react";
import { useDoctorApplication } from "@/contexts/DoctorApplicationContext";
import {
  Input,
  TextArea,
  StepNavButtons,
  TagInput,
  ContactInfo,
  FileUploader,
} from "@/components/ui";

interface ContactField {
  id: string;
  label: string;
  type: string;
  value: string;
}

const Step3_ProfessionalInfo = () => {
  const { doctorData, updateField, nextStep, getStepTitle, getStepSubtitle } =
    useDoctorApplication();

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
    if (doctorData.contactInfo && doctorData.contactInfo.length > 0) {
      const fields = doctorData.contactInfo.map((contact) => ({
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
  }, [doctorData.contactInfo, contactTypes]);

  const [errors, setErrors] = useState({
    bio: "",
    licenseNumber: "",
    experience: "",
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
      bio: "",
      licenseNumber: "",
      experience: "",
      contactFields: "",
    };
    let isValid = true;

    if (!doctorData.bio.trim()) {
      newErrors.bio = "Bio is required";
      isValid = false;
    }

    if (!doctorData.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required";
      isValid = false;
    }

    if (!doctorData.experience.trim()) {
      newErrors.experience = "Experience is required";
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
    // Update the doctor data with contact info
    updateField("contactInfo", contactInfo);
    nextStep();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        className="py-4 sm:py-6"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getStepTitle(3)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(3)}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Professional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="License Number"
              name="licenseNumber"
              error={errors.licenseNumber}
              value={doctorData.licenseNumber}
              onChangeHandler={handleInputChange}
              required
              placeholder="Enter your medical license number"
            />

            <Input
              label="Years of Experience"
              name="experience"
              error={errors.experience}
              value={doctorData.experience}
              onChangeHandler={handleInputChange}
              required
              placeholder="Enter years of experience"
            />
          </div>

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

          {/* Bio */}
          <TextArea
            label="Professional Bio"
            name="bio"
            value={doctorData.bio}
            error={errors.bio}
            placeholder="Tell us about your medical background, expertise, and approach to patient care"
            onChangeHandler={handleInputChange}
            required
            rows={4}
          />

          {/* Languages */}
          <TagInput
            label="Languages Spoken"
            value={doctorData.languages}
            onChangeHandler={(values) => handleArrayChange("languages", values)}
            placeholder="Add languages you speak (e.g., English, French, Arabic)"
          />

          <StepNavButtons
            onBack={() => {}}
            isLoading={false}
            onContinue={handleSubmit}
            canContinue={
              !!doctorData.bio &&
              !!doctorData.licenseNumber &&
              !!doctorData.experience &&
              contactFields.length > 0 &&
              doctorData.languages.length > 0 &&
              contactFields.every((field) => field.value.trim() !== "")
            }
          />
        </div>
      </form>
    </div>
  );
};

export default Step3_ProfessionalInfo;
