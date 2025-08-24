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
} from "lucide-react";

const Step6_Review = () => {
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
    if (!agreedToTerms) return;

    const result = await submitDoctorApplication();
    if (!result.success) {
      // Handle error - you might want to show a toast or error message
      console.error("Submission failed:", result.error);
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return "Not provided";
    return [
      address.streetAddress,
      address.city,
      address.state,
      address.country,
      address.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const formatPaymentMethods = (methods: string[]) => {
    if (!methods || methods.length === 0) return "None selected";
    return methods
      .map((method) => method.replace("_", " ").toUpperCase())
      .join(", ");
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
      className={`border rounded-lg p-4 ${
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

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0: // Basic Info
        return !!(
          doctorData.name &&
          doctorData.email &&
          doctorData.phone &&
          doctorData.licenseNumber &&
          doctorData.experience &&
          doctorData.bio
        );
      case 1: // Specialties
        return !!(doctorData.specialties && doctorData.specialties.length > 0);
      case 2: // Address
        return !!(
          doctorData.coordinates && doctorData.clinicAddress?.fullAddress
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

        <div className="space-y-6">
          {/* Basic Information */}
          <ReviewSection
            title="Basic Information"
            icon={<User size={20} className="text-blue-600" />}
            isComplete={isStepComplete(0)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Name:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {doctorData.name || "Not provided"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Email:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {doctorData.email || "Not provided"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Phone:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {doctorData.phone || "Not provided"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  License Number:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {doctorData.licenseNumber || "Not provided"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Experience:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {doctorData.experience
                    ? `${doctorData.experience} years`
                    : "Not provided"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Languages:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {doctorData.languages?.length
                    ? doctorData.languages.join(", ")
                    : "Not provided"}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Bio:
                </span>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {doctorData.bio || "Not provided"}
                </p>
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
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
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
            <div className="text-sm space-y-2">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Hospital/Clinic:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {doctorData.operationalHospital || "Not provided"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Address:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {formatAddress(doctorData.clinicAddress)}
                </span>
              </div>
              {doctorData.coordinates && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Coordinates:
                  </span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {doctorData.coordinates.lat.toFixed(6)},{" "}
                    {doctorData.coordinates.lng.toFixed(6)}
                  </span>
                </div>
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
              <div className="mt-2 space-y-1">
                {doctorData.documents?.length ? (
                  doctorData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border"
                    >
                      <span className="text-gray-900 dark:text-white">
                        {doc.documentName || doc.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
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
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Consultation Fee:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {doctorData.consultationFee
                    ? `${doctorData.consultationFee} XAF`
                    : "Not set"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Duration:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {doctorData.consultationDuration
                    ? `${doctorData.consultationDuration} minutes`
                    : "Not set"}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Payment Methods:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {formatPaymentMethods(doctorData.paymentMethods)}
                </span>
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

export default Step6_Review;
