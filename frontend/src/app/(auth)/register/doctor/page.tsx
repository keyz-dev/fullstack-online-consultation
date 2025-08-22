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
  TagInput,
} from "../../../../components/ui";
import { ArrowLeft, Upload, X } from "lucide-react";

const DoctorSetupPage = () => {
  const { registerDoctor, loading, authError, setAuthError } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    experience: "",
    bio: "",
    education: [] as Array<{
      degree: string;
      institution: string;
      year: string;
    }>,
    languages: [] as string[],
    specialties: [] as string[],
    clinicAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    operationalHospital: "",
    contactInfo: {
      phone: "",
      email: "",
    },
    consultationFee: "",
    consultationDuration: "30",
    paymentMethods: {
      cash: false,
      card: false,
      mobileMoney: false,
    },
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  );
  const [doctorDocuments, setDoctorDocuments] = useState<File[]>([]);
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

  const handleArrayChange = (field: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: checked,
      },
    }));
  };

  const handleDocumentUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setDoctorDocuments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeDocument = (index: number) => {
    setDoctorDocuments((prev) => prev.filter((_, i) => i !== index));
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

    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = "License number is required";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (formData.specialties.length === 0)
      newErrors.specialties = "At least one specialty is required";
    if (!formData.consultationFee)
      newErrors.consultationFee = "Consultation fee is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateForm()) return;

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: avatar || undefined,
        licenseNumber: formData.licenseNumber,
        experience: parseInt(formData.experience),
        bio: formData.bio,
        education: formData.education,
        languages: formData.languages,
        specialties: formData.specialties,
        clinicAddress: formData.clinicAddress,
        operationalHospital: formData.operationalHospital,
        contactInfo: {
          phone: formData.contactInfo.phone,
          email: formData.email,
        },
        consultationFee: parseFloat(formData.consultationFee),
        consultationDuration: parseInt(formData.consultationDuration),
        paymentMethods: formData.paymentMethods,
        doctorDocument:
          doctorDocuments.length > 0 ? doctorDocuments : undefined,
      };

      const res = await registerDoctor(registrationData);
      if (res.success) {
        router.push("/verify-account");
      }
    } catch (error) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-fit flex items-center justify-center py-8">
      <div className="w-full max-w-4xl mx-auto">
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
              Doctor Registration
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Complete your profile to start providing consultations
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
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  placeholder="Enter your phone number"
                  error={errors.phoneNumber}
                  onChangeHandler={handleChange}
                />
                <Input
                  label="License Number"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  placeholder="Enter your medical license number"
                  error={errors.licenseNumber}
                  onChangeHandler={handleChange}
                  required
                />
                <Input
                  label="Years of Experience"
                  type="number"
                  name="experience"
                  value={formData.experience}
                  placeholder="Enter years of experience"
                  error={errors.experience}
                  onChangeHandler={handleChange}
                  required
                />
                <Input
                  label="Consultation Fee ($)"
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  placeholder="Enter consultation fee"
                  error={errors.consultationFee}
                  onChangeHandler={handleChange}
                  required
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Professional Information
              </h2>
              <div className="space-y-4">
                <TextArea
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  placeholder="Tell us about your medical background and expertise"
                  onChangeHandler={handleChange}
                  rows={4}
                />
                <TagInput
                  label="Specialties"
                  value={formData.specialties}
                  onChangeHandler={(values) =>
                    handleArrayChange("specialties", values)
                  }
                  placeholder="Add your medical specialties"
                />
                <TagInput
                  label="Languages Spoken"
                  value={formData.languages}
                  onChangeHandler={(values) =>
                    handleArrayChange("languages", values)
                  }
                  placeholder="Add languages you speak"
                />
                <Input
                  label="Operational Hospital"
                  name="operationalHospital"
                  value={formData.operationalHospital}
                  placeholder="Enter hospital or clinic name"
                  onChangeHandler={handleChange}
                />
              </div>
            </div>

            {/* Clinic Address */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Clinic Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Street Address"
                  name="clinicAddress.street"
                  value={formData.clinicAddress.street}
                  placeholder="Enter street address"
                  onChangeHandler={handleChange}
                />
                <Input
                  label="City"
                  name="clinicAddress.city"
                  value={formData.clinicAddress.city}
                  placeholder="Enter city"
                  onChangeHandler={handleChange}
                />
                <Input
                  label="State/Province"
                  name="clinicAddress.state"
                  value={formData.clinicAddress.state}
                  placeholder="Enter state or province"
                  onChangeHandler={handleChange}
                />
                <Input
                  label="Country"
                  name="clinicAddress.country"
                  value={formData.clinicAddress.country}
                  placeholder="Enter country"
                  onChangeHandler={handleChange}
                />
                <Input
                  label="Postal Code"
                  name="clinicAddress.postalCode"
                  value={formData.clinicAddress.postalCode}
                  placeholder="Enter postal code"
                  onChangeHandler={handleChange}
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Payment Methods
              </h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.paymentMethods.cash}
                    onChange={(e) =>
                      handlePaymentMethodChange("cash", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Cash</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.paymentMethods.card}
                    onChange={(e) =>
                      handlePaymentMethodChange("card", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Card</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.paymentMethods.mobileMoney}
                    onChange={(e) =>
                      handlePaymentMethodChange("mobileMoney", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Mobile Money
                  </span>
                </label>
              </div>
            </div>

            {/* Documents Upload */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documents & Certifications
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300 px-2 mb-2">
                    Medical Documents (License, Certifications, etc.)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label
                        htmlFor="document-upload"
                        className="cursor-pointer"
                      >
                        <span className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium">
                          Click to upload
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
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
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB each
                    </p>
                  </div>
                </div>

                {doctorDocuments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Uploaded Documents:
                    </h4>
                    {doctorDocuments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
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
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
              Complete Doctor Registration
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

export default DoctorSetupPage;
