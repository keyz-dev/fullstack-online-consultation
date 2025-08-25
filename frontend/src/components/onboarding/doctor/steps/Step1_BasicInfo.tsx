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
import { useRouter } from "next/navigation";

interface ContactField {
  id: string;
  label: string;
  type: string;
  value: string;
}

const Step1_BasicInfo = () => {
  const { doctorData, updateField, nextStep, getStepTitle, getStepSubtitle } =
    useDoctorApplication();
  const router = useRouter();

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
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Initialize contact fields from context data
  useEffect(() => {
    if (doctorData.contactInfo.length > 0) {
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
  }, [doctorData.contactInfo]);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    password: "",
    confirmPassword: "",
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
      name: "",
      email: "",
      phone: "",
      bio: "",
      password: "",
      confirmPassword: "",
      contactFields: "",
    };
    let isValid = true;

    if (!doctorData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!doctorData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(doctorData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!doctorData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (doctorData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!doctorData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (doctorData.password !== doctorData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!doctorData.bio.trim()) {
      newErrors.bio = "Bio is required";
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

    if (avatar) {
      updateField("avatar", avatar);
    }

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
            {getStepTitle(0)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(0)}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              error={errors.name}
              value={doctorData.name}
              onChangeHandler={handleInputChange}
              required
              placeholder="Enter your full name"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              error={errors.email}
              value={doctorData.email}
              onChangeHandler={handleInputChange}
              required
              placeholder="Enter your email address"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              error={errors.password}
              value={doctorData.password}
              onChangeHandler={handleInputChange}
              required
              placeholder="Enter your password"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              error={errors.confirmPassword}
              value={doctorData.confirmPassword}
              onChangeHandler={handleInputChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
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
          <div className="flex flex-col sm:flex-row gap-6">
            <FileUploader
              preview={avatarPreview || undefined}
              onChange={(file) => {
                setAvatar(file);
                setAvatarPreview(URL.createObjectURL(file));
              }}
              text="Avatar"
            />
            <TextArea
              label="Professional Bio"
              name="bio"
              value={doctorData.bio}
              error={errors.bio}
              placeholder="Tell us about your medical background, expertise, and approach to patient care"
              onChangeHandler={handleInputChange}
              required
              rows={5}
            />
          </div>

          {/* Languages */}
          <TagInput
            label="Languages Spoken"
            value={doctorData.languages}
            onChangeHandler={(values) => handleArrayChange("languages", values)}
            placeholder="Add languages you speak (e.g., English, French, Arabic)"
          />

          <StepNavButtons
            onBack={() => router.back()}
            isLoading={false}
            onContinue={handleSubmit}
            canContinue={
              !!doctorData.name &&
              !!doctorData.email &&
              !!doctorData.password &&
              !!doctorData.confirmPassword &&
              doctorData.password === doctorData.confirmPassword &&
              !!doctorData.bio &&
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

export default Step1_BasicInfo;
