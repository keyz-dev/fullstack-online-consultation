import React, { useState } from "react";
import { useDoctorApplication } from "../../../../contexts/DoctorApplicationContext";
import { StepNavButtons, Button } from "../../../ui";
import {
  Check,
  X,
  MapPin,
  FileText,
  CreditCard,
  User,
  Stethoscope,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import { PaymentMethod, Address } from "@/api";
import { toast } from "react-toastify";

const Step8_Review = () => {
  const {
    doctorData,
    submitDoctorApplication,
    prevStep,
    getStepTitle,
    getStepSubtitle,
    isLoading,
  } = useDoctorApplication();

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      toast.error(
        "You must agree to the terms and conditions before submitting."
      );
      return;
    }

    const result = await submitDoctorApplication();
    if (!result.success) {
      // Handle error - you might want to show a toast or error message
      console.error("Submission failed:", result.error);
      toast.error(`Submission failed: ${result.error}`);
    }
  };

  const formatAddress = (address: Address | undefined) => {
    if (!address) return "Not provided";
    const parts = [
      address.street,
      address.city,
      address.state,
      address.country,
      address.postalCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not provided";
  };

  const ReviewSection = ({
    title,
    icon,
    children,
    isComplete = true,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    isComplete?: boolean;
  }) => (
    <div
      className={`border rounded-lg p-4 transition-all duration-300 ${
        isComplete
          ? "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
          : "border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
      }`}
    >
      <div className="flex items-center mb-3">
        <div
          className={`p-2 rounded-full ${
            isComplete
              ? "bg-green-100 dark:bg-green-800"
              : "bg-red-100 dark:bg-red-800"
          }`}
        >
          {isComplete ? (
            <Check size={16} className="text-green-600 dark:text-green-400" />
          ) : (
            <X size={16} className="text-red-600 dark:text-red-400" />
          )}
        </div>
        <div className="flex items-center ml-3">
          {icon}
          <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      </div>
      <div className="ml-11">{children}</div>
    </div>
  );

  const InfoRow = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }) => (
    <div className="flex items-center space-x-2">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
        {label}:
      </span>
      <span className="text-gray-900 dark:text-white">{value}</span>
    </div>
  );

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0: // Basic Info
        return !!(
          doctorData.name &&
          doctorData.email &&
          doctorData.phoneNumber &&
          doctorData.licenseNumber &&
          doctorData.experience &&
          doctorData.bio
        );
      case 1: // Specialties
        return !!(doctorData.specialties && doctorData.specialties.length > 0);
      case 2: // Address
        return !!(
          doctorData.clinicAddress?.fullAddress &&
          doctorData.clinicAddress?.coordinates
        );
      case 3: // Documents
        return !!(doctorData.documents && doctorData.documents.length > 0);
      case 4: // Payment
        return !!(
          doctorData.consultationFee &&
          doctorData.paymentMethods &&
          doctorData.paymentMethods.length > 0
        );
      default:
        return false;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getStepTitle(5)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(5)}
          </p>
        </div>

        {/* Summary Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                Application Summary
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Review all information before submitting your application
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {[0, 1, 2, 3, 4].filter((step) => isStepComplete(step)).length}
                /5
              </div>
              <div className="text-blue-700 dark:text-blue-300 text-sm">
                Steps Complete
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <ReviewSection
            title="Basic Information"
            icon={<User size={20} className="text-blue-600" />}
            isComplete={isStepComplete(0)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoRow
                label="Full Name"
                value={doctorData.name || "Not provided"}
                icon={<User size={14} />}
              />
              <InfoRow
                label="Email"
                value={doctorData.email || "Not provided"}
                icon={<Mail size={14} />}
              />
              <InfoRow
                label="Phone"
                value={doctorData.phoneNumber || "Not provided"}
                icon={<Phone size={14} />}
              />
              <InfoRow
                label="License Number"
                value={doctorData.licenseNumber || "Not provided"}
              />
              <InfoRow
                label="Experience"
                value={
                  doctorData.experience
                    ? `${doctorData.experience} years`
                    : "Not provided"
                }
                icon={<Calendar size={14} />}
              />
              <InfoRow
                label="Languages"
                value={
                  doctorData.languages?.length
                    ? doctorData.languages.join(", ")
                    : "Not provided"
                }
              />
              <div className="md:col-span-2">
                <div className="flex items-start space-x-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Bio:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {doctorData.bio || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </ReviewSection>

          {/* Specialties */}
          <ReviewSection
            title="Medical Specialties"
            icon={<Stethoscope size={20} className="text-green-600" />}
            isComplete={isStepComplete(1)}
          >
            <div className="text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Specialties:
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {doctorData.specialties?.length ? (
                  doctorData.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium"
                    >
                      {specialty}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    No specialties selected
                  </span>
                )}
              </div>
            </div>
          </ReviewSection>

          {/* Address & Location */}
          <ReviewSection
            title="Address & Location"
            icon={<MapPin size={20} className="text-purple-600" />}
            isComplete={isStepComplete(2)}
          >
            <div className="text-sm space-y-3">
              <InfoRow
                label="Hospital/Clinic"
                value={doctorData.operationalHospital || "Not provided"}
              />
              <InfoRow
                label="Full Address"
                value={formatAddress(doctorData.clinicAddress)}
                icon={<MapPin size={14} />}
              />
              {doctorData.clinicAddress?.coordinates && (
                <InfoRow
                  label="Coordinates"
                  value={`${doctorData.clinicAddress.coordinates.lat.toFixed(
                    6
                  )}, ${doctorData.clinicAddress.coordinates.lng.toFixed(6)}`}
                />
              )}
            </div>
          </ReviewSection>

          {/* Documents */}
          <ReviewSection
            title="Documents"
            icon={<FileText size={20} className="text-orange-600" />}
            isComplete={isStepComplete(3)}
          >
            <div className="text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Uploaded Documents:
              </span>
              <div className="mt-2 space-y-2">
                {doctorData.documents?.length ? (
                  doctorData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText size={16} className="text-orange-500" />
                        <span className="text-gray-900 dark:text-white font-medium">
                          {doc.documentName || doc.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    No documents uploaded
                  </span>
                )}
              </div>
            </div>
          </ReviewSection>

          {/* Payment Setup */}
          <ReviewSection
            title="Payment Setup"
            icon={<CreditCard size={20} className="text-indigo-600" />}
            isComplete={isStepComplete(4)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoRow
                label="Consultation Fee"
                value={
                  doctorData.consultationFee
                    ? `${doctorData.consultationFee} XAF`
                    : "Not set"
                }
                icon={<DollarSign size={14} />}
              />
              <InfoRow
                label="Duration"
                value={
                  doctorData.consultationDuration
                    ? `${doctorData.consultationDuration} minutes`
                    : "Not set"
                }
                icon={<Clock size={14} />}
              />
              <div className="md:col-span-2">
                <div className="flex items-start space-x-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Payment Methods:
                  </span>
                  <div className="flex-1">
                    {doctorData.paymentMethods?.length ? (
                      <div className="space-y-2">
                        {doctorData.paymentMethods.map((method, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center space-x-2">
                              <CreditCard
                                size={14}
                                className="text-indigo-500"
                              />
                              <span className="font-medium text-gray-900 dark:text-white">
                                {method.method === "OM"
                                  ? "Orange Money"
                                  : "MTN Mobile Money"}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-gray-900 dark:text-white text-xs">
                                {method.value.accountNumber}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs">
                                {method.value.accountName}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        No payment methods configured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ReviewSection>

          {/* Terms and Conditions */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Privacy Policy
                </a>
                . I confirm that all information provided is accurate and I have
                the right to practice medicine.
              </div>
            </label>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={prevStep}
              additionalClasses="secondarybtn"
              type="button"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              additionalClasses="primarybtn"
              disabled={!agreedToTerms || isLoading}
              isLoading={isLoading}
              type="button"
            >
              Submit Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step8_Review;
