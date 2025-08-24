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
  TextArea,
} from "../../../../components/ui";
import { ArrowLeft, Upload, X } from "lucide-react";

const PharmacySetupPage = () => {
  const { registerPharmacy, loading, authError, setAuthError } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    pharmacyName: "",
    licenseNumber: "",
    description: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  );
  const [pharmacyLogo, setPharmacyLogo] = useState<File | null>(null);
  const [pharmacyLogoPreview, setPharmacyLogoPreview] = useState<
    string | undefined
  >(undefined);
  const [pharmacyImages, setPharmacyImages] = useState<File[]>([]);
  const [pharmacyDocuments, setPharmacyDocuments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
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

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setPharmacyImages((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDocumentUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setPharmacyDocuments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setPharmacyImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setPharmacyDocuments((prev) => prev.filter((_, i) => i !== index));
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

    if (!formData.pharmacyName.trim())
      newErrors.pharmacyName = "Pharmacy name is required";
    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = "License number is required";

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
        avatar,
        pharmacyLogo,
        pharmacyImages,
        pharmacyDocuments,
        role: "pharmacy",
      };

      const res = await registerPharmacy(registrationData);
      if (res.success) {
        router.push("/verify-account");
      }
    } catch (error) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-fit flex items-center justify-center py-8">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/register"
            className="inline-flex items-center text-accent hover:opacity-80 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Role Selection
          </Link>
          <h1 className="text-2xl font-bold text-primary dark:text-white mb-2">
            Pharmacy Registration
          </h1>
          <p className="text-secondary dark:text-gray-300">
            Complete your profile to start selling medications and healthcare
            products
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
              <PhoneInput
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                placeholder="Enter your phone number"
                error={errors.phoneNumber}
                onChangeHandler={(e) => handleChange(e as any)}
              />
              <div>
                <label className="block text-base font-medium text-black dark:text-secondary px-2 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-transparent focus:border-accent transition-all ease-in-out text-secondary dark:text-light_bg bg-light_bg dark:bg-dark_bg rounded-xs"
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

          {/* Pharmacy Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Pharmacy Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Pharmacy Name"
                name="pharmacyName"
                value={formData.pharmacyName}
                placeholder="Enter pharmacy name"
                error={errors.pharmacyName}
                onChangeHandler={handleChange}
                required
              />
              <Input
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                placeholder="Enter pharmacy license number"
                error={errors.licenseNumber}
                onChangeHandler={handleChange}
                required
              />
              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                placeholder="Tell us about your pharmacy and services"
                onChangeHandler={handleChange}
                rows={4}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-primary dark:text-white mb-4">
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

          {/* Images Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Pharmacy Images
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-black dark:text-secondary px-2 mb-2">
                  Pharmacy Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <span className="text-accent hover:opacity-80 font-medium">
                        Click to upload logo
                      </span>
                      <span className="text-secondary dark:text-gray-400">
                        {" "}
                        or drag and drop
                      </span>
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setPharmacyLogo(e.target.files[0]);
                          setPharmacyLogoPreview(
                            URL.createObjectURL(e.target.files[0])
                          );
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-secondary dark:text-gray-400 mt-2">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-black dark:text-secondary px-2 mb-2">
                  Pharmacy Images (Storefront, Interior, etc.)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-accent hover:opacity-80 font-medium">
                        Click to upload images
                      </span>
                      <span className="text-secondary dark:text-gray-400">
                        {" "}
                        or drag and drop
                      </span>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-secondary dark:text-gray-400 mt-2">
                    JPG, PNG up to 5MB each (max 5 images)
                  </p>
                </div>
              </div>

              {pharmacyImages.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-primary dark:text-white">
                    Uploaded Images:
                  </h4>
                  {pharmacyImages.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <span className="text-sm text-secondary dark:text-gray-300">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Documents Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Documents & Certifications
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-black dark:text-secondary px-2 mb-2">
                  Pharmacy Documents (License, Certifications, etc.)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="document-upload" className="cursor-pointer">
                      <span className="text-accent hover:opacity-80 font-medium">
                        Click to upload
                      </span>
                      <span className="text-secondary dark:text-gray-400">
                        {" "}
                        or drag and drop
                      </span>
                    </label>
                    <input
                      id="document-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleDocumentUpload(e.target.files)}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-secondary dark:text-gray-400 mt-2">
                    PDF, DOC, DOCX, JPG, PNG up to 10MB each
                  </p>
                </div>
              </div>

              {pharmacyDocuments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-primary dark:text-white">
                    Uploaded Documents:
                  </h4>
                  {pharmacyDocuments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <span className="text-sm text-secondary dark:text-gray-300">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile Picture and Password */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Profile Picture & Security
            </h2>
            <div className="flex flex-col-reverse sm:flex-row gap-6">
              <FileUploader
                preview={avatarPreview}
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
            Complete Pharmacy Registration
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

export default PharmacySetupPage;
