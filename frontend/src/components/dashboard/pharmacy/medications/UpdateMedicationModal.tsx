"use client";

import React, { useState, useEffect } from "react";
import { usePharmacyMedications } from "@/hooks/usePharmacyMedications";
import { 
  Input, 
  Button, 
  ModalWrapper, 
  FileUploader, 
  TextArea, 
  FormHeader,
  Select
} from "@/components/ui";
import { X } from "lucide-react";

const MEDICATION_CATEGORIES = [
  "Antibiotic",
  "Painkiller", 
  "Vitamin",
  "Supplement",
  "Antihistamine",
  "Antacid",
  "Cough Medicine",
  "Other"
];

const DOSAGE_FORMS = [
  "Tablet",
  "Capsule", 
  "Syrup",
  "Injection",
  "Cream",
  "Ointment",
  "Drops",
  "Inhaler"
];

interface Medication {
  id: number;
  name: string;
  genericName?: string;
  description?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
  price: number;
  currency: string;
  stockQuantity: number;
  isAvailable: boolean;
  requiresPrescription: boolean;
  category?: string;
  expiryDate?: string;
  imageUrl?: string;
}

interface UpdateMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  medication: Medication | null;
}

const UpdateMedicationModal = ({ isOpen, onClose, medication }: UpdateMedicationModalProps) => {
  const { updateMedication, loading, error } = usePharmacyMedications();
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    description: "",
    dosageForm: "",
    strength: "",
    manufacturer: "",
    price: "",
    currency: "XAF",
    stockQuantity: "",
    category: "",
    requiresPrescription: false,
    expiryDate: "",
  });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when medication changes
  useEffect(() => {
    if (medication) {
      setFormData({
        name: medication.name || "",
        genericName: medication.genericName || "",
        description: medication.description || "",
        dosageForm: medication.dosageForm || "",
        strength: medication.strength || "",
        manufacturer: medication.manufacturer || "",
        price: medication.price?.toString() || "",
        currency: medication.currency || "XAF",
        stockQuantity: medication.stockQuantity?.toString() || "",
        category: medication.category || "",
        requiresPrescription: medication.requiresPrescription || false,
        expiryDate: medication.expiryDate || "",
      });
      setImagePreview(medication.imageUrl || undefined);
    }
  }, [medication]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(undefined);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (!formData.stockQuantity) newErrors.stockQuantity = "Stock quantity is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.dosageForm) newErrors.dosageForm = "Dosage form is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !medication) return;

    // Ensure currency is set to XAF and convert price to number
    const medicationData = {
      ...formData,
      currency: "XAF",
      price: parseFloat(formData.price) || 0,
      stockQuantity: parseInt(formData.stockQuantity) || 0
    };

    console.log("Updating medication with data:", medicationData);
    console.log("Image file:", imageFile);

    const result = await updateMedication(medication.id, medicationData, imageFile);
    if (result.success) {
      onClose();
    }
  };

  const isFormIncomplete = !formData.name || !formData.price || !formData.stockQuantity || !formData.category || !formData.dosageForm;

  if (!isOpen || !medication) return null;

  return (
    <ModalWrapper>
      <div className="p-2 lg:p-6 w-full max-w-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 z-10"
        >
          <X size={24} />
        </button>

        <FormHeader
          title="Update medication"
          description="Update medication information in your pharmacy inventory"
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="min-w-sm lg:min-w-lg mx-auto flex flex-col flex-1 overflow-hidden"
          autoComplete="off"
          encType="multipart/form-data"
        >
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4 mb-8 overflow-y-auto flex-1 pr-2">
            {/* Image Upload */}
            <div className="w-40">
              <FileUploader
                onChange={handleFileChange}
                accept="image/*"
                preview={imagePreview}
                text="medication image"
              />
            </div>

            {/* Name Input */}
            <Input
              label="Medication Name"
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter medication name"
              error={errors.name}
              onChangeHandler={handleChange}
              additionalClasses="border-line_clr"
              required
            />

            {/* Generic Name Input */}
            <Input
              label="Generic Name"
              type="text"
              name="genericName"
              value={formData.genericName}
              placeholder="Enter generic name"
              onChangeHandler={handleChange}
              additionalClasses="border-line_clr"
            />

            {/* Category and Dosage Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                additionalClasses="border-line_clr"
                error={errors.category}
                required
                options={[
                  { value: "", label: "Select category" },
                  ...MEDICATION_CATEGORIES.map((category) => ({
                    value: category,
                    label: category,
                  })),
                ]}
              />

              <Select
                label="Dosage Form"
                name="dosageForm"
                value={formData.dosageForm}
                onChange={handleChange}
                additionalClasses="border-line_clr"
                error={errors.dosageForm}
                required
                options={[
                  { value: "", label: "Select dosage form" },
                  ...DOSAGE_FORMS.map((form) => ({
                    value: form,
                    label: form,
                  })),
                ]}
              />
            </div>

            {/* Strength and Manufacturer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Strength"
                type="text"
                name="strength"
                value={formData.strength}
                placeholder="e.g., 500mg, 10ml"
                onChangeHandler={handleChange}
                additionalClasses="border-line_clr"
              />

              <Input
                label="Manufacturer"
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                placeholder="Enter manufacturer name"
                onChangeHandler={handleChange}
                additionalClasses="border-line_clr"
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Price (XAF)"
                type="number"
                name="price"
                value={formData.price}
                placeholder="0.00"
                error={errors.price}
                onChangeHandler={handleChange}
                additionalClasses="border-line_clr"
                required
              />

              <Input
                label="Stock Quantity"
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                placeholder="0"
                error={errors.stockQuantity}
                onChangeHandler={handleChange}
                additionalClasses="border-line_clr"
                required
              />
            </div>

            {/* Expiry Date and Prescription */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChangeHandler={handleChange}
                additionalClasses="border-line_clr"
              />

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  name="requiresPrescription"
                  checked={formData.requiresPrescription}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-base font-medium text-black">
                  Requires Prescription
                </label>
              </div>
            </div>

            {/* Description */}
            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              placeholder="Enter medication description..."
              onChangeHandler={handleChange}
              additionalClasses="border-line_clr"
            />
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 mt-4 flex-shrink-0">
            <Button
              onClickHandler={handleSave}
              additionalClasses="primaryBtn bg-accent text-white"
              isLoading={loading}
              isDisabled={isFormIncomplete || Object.keys(errors).length > 0}
              text="Update Medication"
            />
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default UpdateMedicationModal;
