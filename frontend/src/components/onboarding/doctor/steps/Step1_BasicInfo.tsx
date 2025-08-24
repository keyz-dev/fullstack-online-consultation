import React, { useState } from "react";
import { useDoctorApplication } from "@/contexts/DoctorApplicationContext";
import {
  Input,
  TextArea,
  StepNavButtons,
  TagInput,
  ContactInfo,
} from "@/components/ui";
import { useRouter } from "next/navigation";
import { validateContactForm } from "@/utils/validateContactForm";

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

  const [contactFields, setContactFields] = useState<ContactField[]>([]);

  // Define contact types (can be fetched from backend if needed)
  const contactTypes = [
    { id: "phone", label: "Phone Number", type: "tel" },
    { id: "whatsapp", label: "WhatsApp", type: "tel" },
    { id: "telegram", label: "Telegram", type: "tel" },
    { id: "website", label: "Website URL", type: "url" },
    { id: "facebook", label: "Facebook", type: "url" },
    { id: "instagram", label: "Instagram", type: "url" },
    { id: "linkedin", label: "LinkedIn", type: "url" },
  ];

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

    if (!doctorData.phone.trim()) {
      newErrors.phone = "Phone number is required";
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
    if (!validateContactForm(contactFields, setErrors)) {
      isValid = false;
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

    // Extract phone and email from contact fields for backward compatibility
    const phoneField = contactFields.find((field) => field.type === "tel");
    const emailField = contactFields.find((field) => field.type === "email");

    if (phoneField?.value) {
      updateField("phone", phoneField.value);
    }
    if (emailField?.value) {
      updateField("email", emailField.value);
    }

    nextStep();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
              setContactFields={setContactFields}
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
              contactFields.length > 0
            }
          />
        </div>
      </form>
    </div>
  );
};

export default Step1_BasicInfo;
