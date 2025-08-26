import React, { useState } from "react";
import { usePharmacyApplication } from "../../../../contexts/PharmacyApplicationContext";
import { MapSelector } from "../../../maps/leaflet";
import { Address } from "@/api";

const Step4_AddressLocation = () => {
  const {
    pharmacyData,
    updateField,
    nextStep,
    prevStep,
    getStepTitle,
    getStepSubtitle,
  } = usePharmacyApplication();

  const [address, setAddress] = useState(
    pharmacyData.pharmacyAddress?.fullAddress || ""
  );
  const [coordinates, setCoordinates] = useState(
    pharmacyData.pharmacyAddress?.coordinates || null
  );
  const [addressDetails, setAddressDetails] = useState<Address>({
    street: pharmacyData.pharmacyAddress?.street || "",
    city: pharmacyData.pharmacyAddress?.city || "",
    state: pharmacyData.pharmacyAddress?.state || "",
    country: pharmacyData.pharmacyAddress?.country || "Cameroon",
    postalCode: pharmacyData.pharmacyAddress?.postalCode || "00000",
  });

  const handleConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Only require address and coordinates - country, city, region are optional
    if (!address || !coordinates) return;

    // Create the complete clinic address object with embedded coordinates
    const pharmacyAddressObject = {
      street: addressDetails.street,
      city: addressDetails.city,
      state: addressDetails.state,
      country: addressDetails.country,
      postalCode: addressDetails.postalCode,
      fullAddress: address,
      coordinates: coordinates,
    };

    // Update the clinic address field
    updateField("pharmacyAddress", pharmacyAddressObject);

    nextStep();
  };

  return (
    <div className="w-full h-full pt-4">
      {/* Clinic Name Input */}
      <div className="max-w-3xl m-auto lg:px-8 mb-6 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getStepTitle(4)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(4)}
          </p>
        </div>

        {/* Map Selector - Full Screen */}
        <MapSelector
          prevStep={prevStep}
          setAddress={setAddress}
          setCoordinates={setCoordinates}
          setAddressDetails={setAddressDetails}
          handleConfirm={handleConfirm}
          coordinates={coordinates}
          address={address}
        />
      </div>
    </div>
  );
};

export default Step4_AddressLocation;
