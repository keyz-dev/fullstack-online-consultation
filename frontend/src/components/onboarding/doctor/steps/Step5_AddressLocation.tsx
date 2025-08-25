import React, { useState } from "react";
import { useDoctorApplication } from "../../../../contexts/DoctorApplicationContext";
import { Input } from "../../../ui";
import { MapSelector } from "../../../maps/leaflet";
import { Address } from "@/api";

const Step5_AddressLocation = () => {
  const {
    doctorData,
    updateField,
    nextStep,
    prevStep,
    getStepTitle,
    getStepSubtitle,
  } = useDoctorApplication();

  const [address, setAddress] = useState(
    doctorData.clinicAddress?.fullAddress || ""
  );
  const [coordinates, setCoordinates] = useState(
    doctorData.clinicAddress?.coordinates || null
  );
  const [addressDetails, setAddressDetails] = useState<Address>({
    street: doctorData.clinicAddress?.street || "",
    city: doctorData.clinicAddress?.city || "",
    state: doctorData.clinicAddress?.state || "",
    country: doctorData.clinicAddress?.country || "Cameroon",
    postalCode: doctorData.clinicAddress?.postalCode || "00000",
  });

  const handleConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Only require address and coordinates - country, city, region are optional
    if (!address || !coordinates) return;

    // Create the complete clinic address object with embedded coordinates
    const clinicAddressObject = {
      street: addressDetails.street,
      city: addressDetails.city,
      state: addressDetails.state,
      country: addressDetails.country,
      postalCode: addressDetails.postalCode,
      fullAddress: address,
      coordinates: coordinates,
    };

    // Update the clinic address field
    updateField("clinicAddress", clinicAddressObject);

    nextStep();
  };

  return (
    <div className="w-full h-full pt-4">
      {/* Clinic Name Input */}
      <div className="max-w-2xl m-auto lg:px-8 mb-6 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getStepTitle(2)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(2)}
          </p>
        </div>

        <Input
          label="Clinic/Hospital Name"
          name="operationalHospital"
          value={doctorData.operationalHospital}
          onChangeHandler={(e) =>
            updateField("operationalHospital", e.target.value)
          }
          placeholder="Enter your clinic or hospital name"
          required
        />

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

export default Step5_AddressLocation;
