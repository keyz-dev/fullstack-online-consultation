import React from "react";
import { useDoctorApplication } from "../../../../contexts/DoctorApplicationContext";
import { Input } from "../../../ui";
import MapSelector from "../../../ui/MapSelector";

const Step3_AddressLocation = () => {
  const {
    doctorData,
    updateField,
    nextStep,
    prevStep,
    getStepTitle,
    getStepSubtitle,
  } = useDoctorApplication();

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const handleCoordinatesChange = (
    coordinates: { lat: number; lng: number } | null
  ) => {
    updateField("coordinates", coordinates);
  };

  const handleAddressChange2 = (address: string) => {
    updateField("clinicAddress", {
      ...doctorData.clinicAddress,
      fullAddress: address,
    });
  };

  const handleAddressDetailsChange = (addressDetails: any) => {
    updateField("clinicAddress", {
      ...doctorData.clinicAddress,
      ...addressDetails,
    });
  };

  const handleConfirm = () => {
    if (doctorData.coordinates && doctorData.clinicAddress?.fullAddress) {
      nextStep();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getStepTitle(2)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {getStepSubtitle(2)}
          </p>
        </div>

        <div className="space-y-6">
          {/* Operational Hospital */}
          <Input
            label="Operational Hospital/Clinic Name"
            name="operationalHospital"
            value={doctorData.operationalHospital}
            onChangeHandler={handleAddressChange}
            placeholder="Enter hospital or clinic name"
          />

          {/* Map Selector */}
          <MapSelector
            prevStep={prevStep}
            handleConfirm={handleConfirm}
            coordinates={doctorData.coordinates}
            setCoordinates={handleCoordinatesChange}
            address={doctorData.clinicAddress?.fullAddress || ""}
            setAddress={handleAddressChange2}
            setAddressDetails={handleAddressDetailsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Step3_AddressLocation;
