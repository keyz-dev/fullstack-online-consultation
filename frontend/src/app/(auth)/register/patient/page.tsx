"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  Input,
  Button,
  FileUploader,
  PhoneInput,
} from "../../../../components/ui";
import GoogleSignupButton from "../../../../components/auth/GoogleSignupButton";
import { ArrowLeft } from "lucide-react";

const PatientRegisterPage = () => {
  const { registerPatient, loading, authError, setAuthError } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    emergencyContact: {
      name: "",
      phoneNumber: "",
      relationship: "",
    },
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (
      formData.emergencyContact.name &&
      !formData.emergencyContact.phoneNumber
    ) {
      newErrors.emergencyContactPhone =
        "Emergency contact phone is required if name is provided";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateForm()) return;

    try {
      const registrationData = {
        ...formData,
        avatar: avatar || undefined,
      };

      const res = await registerPatient(registrationData);
      if (res.success) {
        router.push("/verify-account");
      }
    } catch (error) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-fit flex items-center justify-center py-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <Link
              href="/register"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 mb-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Role Selection
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Patient Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Join our platform to book consultations and order medications
            </p>
          </div>

          {authError && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-6">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {authError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Google Signup Option */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                <GoogleSignupButton
                  role="patient"
                  buttonText="Continue with Google"
                  fullWidth
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your full name"
                  error={errors.name}
                  onChangeHandler={handleChange}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Enter your email"
                  error={errors.email}
                  onChangeHandler={handleChange}
                  required
                />
                <PhoneInput
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  placeholder="Enter your phone number"
                  error={errors.phoneNumber}
                  onChangeHandler={handleChange}
                />
                <div>
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300 px-2 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all ease-in-out text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Input
                  label="Date of Birth"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChangeHandler={handleChange}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Street Address"
                  name="address.street"
                  value={formData.address.street}
                  placeholder="Enter street address"
                  onChangeHandler={handleChange}
                />
                <Input
                  label="City"
                  name="address.city"
                  value={formData.address.city}
                  placeholder="Enter city"
                  onChangeHandler={handleChange}
                />
                <Input
                  label="State/Province"
                  name="address.state"
                  value={formData.address.state}
                  placeholder="Enter state or province"
                  onChangeHandler={handleChange}
                />
                <Input
                  label="Country"
                  name="address.country"
                  value={formData.address.country}
                  placeholder="Enter country"
                  onChangeHandler={handleChange}
                />
                <Input
                  label="Postal Code"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  placeholder="Enter postal code"
                  onChangeHandler={handleChange}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Emergency Contact (Optional)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Contact Name"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  placeholder="Enter contact name"
                  onChangeHandler={handleChange}
                />
                <PhoneInput
                  label="Contact Phone"
                  name="emergencyContact.phoneNumber"
                  value={formData.emergencyContact.phoneNumber}
                  placeholder="Enter contact phone"
                  error={errors.emergencyContactPhone}
                  onChangeHandler={handleChange}
                />
                <Input
                  label="Relationship"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  placeholder="e.g., Spouse, Parent"
                  onChangeHandler={handleChange}
                />
              </div>
            </div>

            {/* Profile Picture and Password */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profile Picture & Security
              </h2>
              <div className="flex flex-col-reverse sm:flex-row gap-6">
                <FileUploader
                  preview={avatarPreview || undefined}
                  onChange={(file) => {
                    setAvatar(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  }}
                />
                <div className="flex flex-col gap-4 flex-1">
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Enter password"
                    error={errors.password}
                    onChangeHandler={handleChange}
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    placeholder="Confirm password"
                    error={errors.confirmPassword}
                    onChangeHandler={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              additionalClasses="w-full primarybtn"
              isLoading={loading}
            >
              Create Patient Account
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientRegisterPage;
