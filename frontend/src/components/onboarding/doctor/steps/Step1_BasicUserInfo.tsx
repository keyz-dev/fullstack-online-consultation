import React, { useState } from "react";
import { useDoctorApplication } from "@/contexts/DoctorApplicationContext";
import {
  Input,
  StepNavButtons,
  FileUploader,
  Select,
  PhoneInput,
  AddressInput,
} from "@/components/ui";
import GoogleSignupButton from "@/components/auth/GoogleSignupButton";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

const Step1_BasicUserInfo = () => {
  const {
    doctorData,
    updateField,
    submitStep1,
    getStepTitle,
    getStepSubtitle,
    isLoading,
  } = useDoctorApplication();
  const router = useRouter();

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateField(name, value);

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
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

    if (
      doctorData.phoneNumber &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(doctorData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (avatar) {
      updateField("avatar", avatar);
    }

    const result = await submitStep1();
    if (!result.success) {
      // Handle error - could show a toast or set error state
      console.error("Failed to submit:", result.error);
    }
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
            {getStepTitle(1)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(1)}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Google Signup Option */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            <GoogleSignupButton
              role="incomplete_doctor"
              buttonText="Continue with Google"
              fullWidth
            />
          </div>

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

            <PhoneInput
              label="Phone Number"
              name="phoneNumber"
              error={errors.phoneNumber}
              value={doctorData.phoneNumber}
              onChangeHandler={(e) => {
                updateField("phoneNumber", e.target.value);
              }}
              placeholder="Enter your phone number"
            />

            <Select
              label="Gender"
              name="gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              value={doctorData.gender}
              onChange={(e) => {
                updateField("gender", e.target.value);
              }}
            />
          </div>

          {/* Date of Birth */}
          <Input
            label="Date of Birth"
            type="date"
            name="dob"
            value={doctorData.dob}
            onChangeHandler={handleInputChange}
            placeholder="Select your date of birth"
          />

          {/* Address - Collapsible */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsAddressExpanded(!isAddressExpanded)}
              className={`w-full flex items-center justify-between p-4 rounded-sm border transition-colors ${
                doctorData.address?.street &&
                doctorData.address?.city &&
                doctorData.address?.coordinates?.lat &&
                doctorData.address?.coordinates?.lng
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin
                  size={20}
                  className={
                    doctorData.address?.street &&
                    doctorData.address?.city &&
                    doctorData.address?.coordinates?.lat &&
                    doctorData.address?.coordinates?.lng
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400"
                  }
                />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Address Information
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isAddressExpanded
                      ? "Click to collapse address section"
                      : doctorData.address?.street &&
                        doctorData.address?.city &&
                        doctorData.address?.coordinates?.lat &&
                        doctorData.address?.coordinates?.lng
                      ? "Address provided ✓"
                      : "Click to add your address (optional)"}
                  </p>
                </div>
              </div>
              {isAddressExpanded ? (
                <ChevronUp
                  size={20}
                  className="text-gray-600 dark:text-gray-400"
                />
              ) : (
                <ChevronDown
                  size={20}
                  className="text-gray-600 dark:text-gray-400"
                />
              )}
            </button>

            {/* Collapsible Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isAddressExpanded
                  ? "max-h-[800px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="pt-4 space-y-4">
                <AddressInput
                  value={
                    doctorData.address || {
                      street: "",
                      fullAddress: "",
                      city: "",
                      state: "",
                      country: "",
                      postalCode: "",
                      coordinates: undefined,
                    }
                  }
                  onChange={(address) => {
                    updateField("address", address);
                  }}
                  label="Full Address"
                  required={false}
                />
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex justify-center">
            <FileUploader
              preview={avatarPreview || undefined}
              onChange={(file) => {
                setAvatar(file);
                setAvatarPreview(URL.createObjectURL(file));
              }}
              text="Profile Picture"
            />
          </div>

          <StepNavButtons
            onBack={() => router.back()}
            isLoading={isLoading}
            onContinue={handleSubmit}
            canContinue={
              !!doctorData.name &&
              !!doctorData.email &&
              !!doctorData.password &&
              !!doctorData.confirmPassword &&
              doctorData.password === doctorData.confirmPassword
            }
          />
        </div>
      </form>
    </div>
  );
};

export default Step1_BasicUserInfo;
