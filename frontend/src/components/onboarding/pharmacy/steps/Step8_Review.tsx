import React, { useState } from "react";
import { usePharmacyApplication } from "../../../../contexts/PharmacyApplicationContext";
import { StepNavButtons, Button } from "../../../ui";
import {
  Check,
  X,
  MapPin,
  FileText,
  CreditCard,
  User,
  Building,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Clock,
  Truck,
  Image,
} from "lucide-react";
import { PaymentMethod, Address } from "@/api";
import { toast } from "react-toastify";

const Step8_Review = () => {
  const {
    pharmacyData,
    submitPharmacyApplication,
    prevStep,
    getStepTitle,
    getStepSubtitle,
    isLoading,
  } = usePharmacyApplication();

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      toast.error(
        "You must agree to the terms and conditions before submitting."
      );
      return;
    }
    
    const result = await submitPharmacyApplication();
    if (!result.success) {
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
      case 0: // Pharmacy Info
        return !!(
          pharmacyData.pharmacyName &&
          pharmacyData.licenseNumber &&
          pharmacyData.description
        );
      case 1: // Address
        return !!(
          pharmacyData.pharmacyAddress?.fullAddress &&
          pharmacyData.pharmacyAddress?.coordinates
        );
      case 2: // Documents
        return !!(
          pharmacyData.pharmacyDocuments &&
          pharmacyData.pharmacyDocuments.length > 0
        );
      case 3: // Images
        return !!(
          pharmacyData.pharmacyImages && pharmacyData.pharmacyImages.length >= 3
        );
      case 4: // Payment & Delivery
        return !!(
          pharmacyData.paymentMethods && pharmacyData.paymentMethods.length > 0
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
            {getStepTitle(8)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(8)}
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
          {/* Pharmacy Information */}
          <ReviewSection
            title="Pharmacy Information"
            icon={<Building size={20} className="text-blue-600" />}
            isComplete={isStepComplete(0)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoRow
                label="Pharmacy Name"
                value={pharmacyData.pharmacyName || "Not provided"}
              />
              <InfoRow
                label="License Number"
                value={pharmacyData.licenseNumber || "Not provided"}
              />
              <InfoRow
                label="Languages"
                value={
                  pharmacyData.languages?.length
                    ? pharmacyData.languages.join(", ")
                    : "Not provided"
                }
              />
              <div className="md:col-span-2">
                <div className="flex items-start space-x-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Description:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {pharmacyData.description || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </ReviewSection>

          {/* Address & Location */}
          <ReviewSection
            title="Address & Location"
            icon={<MapPin size={20} className="text-purple-600" />}
            isComplete={isStepComplete(1)}
          >
            <div className="text-sm space-y-3">
              <InfoRow
                label="Full Address"
                value={formatAddress(pharmacyData.pharmacyAddress)}
                icon={<MapPin size={14} />}
              />
              {pharmacyData.pharmacyAddress?.coordinates && (
                <InfoRow
                  label="Coordinates"
                  value={`${pharmacyData.pharmacyAddress.coordinates.lat.toFixed(
                    6
                  )}, ${pharmacyData.pharmacyAddress.coordinates.lng.toFixed(
                    6
                  )}`}
                />
              )}
            </div>
          </ReviewSection>

          {/* Documents */}
          <ReviewSection
            title="Documents"
            icon={<FileText size={20} className="text-orange-600" />}
            isComplete={isStepComplete(2)}
          >
            <div className="text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Uploaded Documents:
              </span>
              <div className="mt-2 space-y-2">
                {pharmacyData.pharmacyDocuments?.length ? (
                  pharmacyData.pharmacyDocuments.map((doc, index) => (
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

          {/* Images */}
          <ReviewSection
            title="Pharmacy Images"
            icon={<Image size={20} className="text-green-600" />}
            isComplete={isStepComplete(3)}
          >
            <div className="text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Uploaded Images:
              </span>
              <div className="mt-2">
                {pharmacyData.pharmacyImages?.length ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {pharmacyData.pharmacyImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    No images uploaded
                  </span>
                )}
              </div>
            </div>
          </ReviewSection>

          {/* Payment & Delivery */}
          <ReviewSection
            title="Payment & Delivery"
            icon={<CreditCard size={20} className="text-indigo-600" />}
            isComplete={isStepComplete(4)}
          >
            <div className="space-y-4">
              {/* Payment Methods */}
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Methods:
                </h4>
                {pharmacyData.paymentMethods?.length ? (
                  <div className="space-y-2">
                    {pharmacyData.paymentMethods.map((method, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center space-x-2">
                          <CreditCard size={14} className="text-indigo-500" />
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

              {/* Shipping Configuration */}
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shipping Configuration:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <InfoRow
                    label="Same City Rate"
                    value={`${pharmacyData.shipping.sameCityRate} XAF`}
                    icon={<DollarSign size={14} />}
                  />
                  <InfoRow
                    label="Same Region Rate"
                    value={`${pharmacyData.shipping.sameRegionRate} XAF`}
                    icon={<DollarSign size={14} />}
                  />
                  <InfoRow
                    label="Same Country Rate"
                    value={`${pharmacyData.shipping.sameCountryRate} XAF`}
                    icon={<DollarSign size={14} />}
                  />
                  <InfoRow
                    label="International Rate"
                    value={`${pharmacyData.shipping.othersRate} XAF`}
                    icon={<DollarSign size={14} />}
                  />
                  <InfoRow
                    label="Free Shipping"
                    value={`Orders above ${pharmacyData.shipping.freeShippingThreshold} XAF`}
                    icon={<Truck size={14} />}
                  />
                  <InfoRow
                    label="Processing Time"
                    value={pharmacyData.shipping.processingTime}
                    icon={<Clock size={14} />}
                  />
                </div>

                {/* Delivery Areas */}
                <div className="mt-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Delivery Areas:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pharmacyData.shipping.deliverLocally && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                        Local
                      </span>
                    )}
                    {pharmacyData.shipping.deliverNationally && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                        National
                      </span>
                    )}
                    {pharmacyData.shipping.deliverInternationally && (
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                        International
                      </span>
                    )}
                  </div>
                </div>

                {/* Cash on Delivery */}
                {pharmacyData.shipping.allowCashOnDelivery && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Cash on Delivery: Enabled
                    </span>
                    {pharmacyData.shipping.codConditions && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {pharmacyData.shipping.codConditions}
                      </p>
                    )}
                  </div>
                )}
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
                the right to operate a pharmacy.
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
