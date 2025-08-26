import React, { useState } from "react";
import { usePharmacyApplication } from "../../../../contexts/PharmacyApplicationContext";
import ImageUploadStep from "../../../image_upload/ImageUploadStep";

const Step6_Images = () => {
  const {
    pharmacyData,
    updatePharmacyData,
    nextStep,
    prevStep,
    getStepTitle,
    getStepSubtitle,
  } = usePharmacyApplication();

  const [pharmacyImages, setPharmacyImages] = useState(
    pharmacyData.pharmacyImages || []
  );

  const handleImagesChange = (
    newImages: Array<{ id: string; file: File; url: string; name: string }>
  ) => {
    setPharmacyImages(newImages);
  };

  const handleContinue = () => {
    // Update the context with the images
    const images = pharmacyImages.map(({ file }) => file);

    console.log(images);
    console.log(pharmacyImages);

    // updatePharmacyData({ pharmacyImages });
    // nextStep();
  };

  return (
    <div className="w-full max-w-4xl mx-auto sm:px-6 lg:px-8">
      <section>
        <ImageUploadStep
          images={pharmacyImages}
          onImagesChange={handleImagesChange}
          entityType="Pharmacy"
          onBack={prevStep}
          onContinue={handleContinue}
          submitBtnText="Save Images"
        />
      </section>
    </div>
  );
};

export default Step6_Images;
