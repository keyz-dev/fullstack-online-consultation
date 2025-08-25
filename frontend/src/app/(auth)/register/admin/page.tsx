"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  Input,
  Button,
  FileUploader,
  Select,
  AddressInput,
} from "../../../../components/ui";
import GoogleSignupButton from "../../../../components/auth/GoogleSignupButton";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { Address } from "../../../../api";

const AdminRegisterPage = () => {
  const { registerAdmin, loading, authError, setAuthError } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: string;
    dob: string;
    address: Address;
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    address: {
      street: "",
      fullAddress: "",
      city: "",
      state: "",
      country: "",
      postalCode: "0000",
      coordinates: undefined,
    },
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddressChange = (address: Address) => {
    setFormData((prev) => ({
      ...prev,
      address,
    }));
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateForm()) return;

    try {
      const { confirmPassword, ...formDataWithoutConfirm } = formData;

      const registrationData = {
        ...formDataWithoutConfirm,
        avatar: avatar || undefined,
      };

      const res = await registerAdmin(registrationData);
      if (res.success) {
        toast.success("Admin account created successfully");
        setTimeout(() => {
          router.push(
            `/verify-account?email=${encodeURIComponent(
              formData.email
            )}&from=register`
          );
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to create admin account");
    }
  };

  return (
    <div className="min-h-fit flex items-center justify-center py-8">
      <div className="w-full max-w-2xl mx-auto px-1 sm:px-4">
        <div className="mb-6">
          <Link
            href="/register"
            className="inline-flex items-center text-accent hover:opacity-80 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Role Selection
          </Link>

          <h1 className="text-2xl font-bold text-primary dark:text-white mb-2">
            Create Admin Account
          </h1>
          <p className="text-secondary dark:text-gray-300">
            Join our platform as an administrator to manage users and content
          </p>
        </div>

        {authError && (
          <div className="rounded-xs bg-red-50 dark:bg-red-900/20 p-4 my-4">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">
              {authError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Google Signup Option */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
              <GoogleSignupButton
                role="admin"
                buttonText="Continue with Google"
                fullWidth
                variant="outline"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-primary dark:text-white mb-4">
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
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                options={[
                  { label: "Select Gender", value: "" },
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
              />
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Address Information
            </h2>
            <AddressInput
              value={formData.address}
              onChange={handleAddressChange}
              label="Full Address"
              required
            />
          </div>

          {/* Profile Picture and Password */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-primary dark:text-white mb-4">
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
            Create Admin Account
          </Button>

          <p className="text-center text-sm text-secondary dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
