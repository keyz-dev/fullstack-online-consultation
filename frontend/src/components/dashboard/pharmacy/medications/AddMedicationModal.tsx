"use client";

import React, { useState } from "react";
import { usePharmacyMedications } from "@/hooks/usePharmacyMedications";
import { 
  Input, 
  Button, 
  ModalWrapper, 
  FileUploader, 
  TextArea, 
  FormHeader 
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

const AddMedicationModal = ({ onClose }: { onClose: () => void }) => {
  const { createMedication, loading, error } = usePharmacyMedications();
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    description: "",
    dosageForm: "",
    strength: "",
    manufacturer: "",
    price: "",
    currency: "USD",
    stockQuantity: "",
    category: "",
    requiresPrescription: false,
    expiryDate: "",
  });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!validateForm()) return;

    const result = await createMedication(formData, imageFile);
    if (result.success) {
      // Reset form
      setFormData({
        name: "",
        genericName: "",
        description: "",
        dosageForm: "",
        strength: "",
        manufacturer: "",
        price: "",
        currency: "USD",
        stockQuantity: "",
        category: "",
        requiresPrescription: false,
        expiryDate: "",
      });
      setImageFile(undefined);
      setImagePreview(undefined);
      setErrors({});
      onClose();
    }
  };

  const isFormIncomplete = !formData.name || !formData.price || !formData.stockQuantity || !formData.category || !formData.dosageForm;

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
          title="Add a medication"
          description="Add a new medication to your pharmacy inventory"
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
              <div>
                <label className="block text-base font-medium text-black px-2 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {MEDICATION_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-base font-medium text-black px-2 mb-2">
                  Dosage Form <span className="text-red-500">*</span>
                </label>
                <select
                  name="dosageForm"
                  value={formData.dosageForm}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                >
                  <option value="">Select dosage form</option>
                  {DOSAGE_FORMS.map((form) => (
                    <option key={form} value={form}>
                      {form}
                    </option>
                  ))}
                </select>
                {errors.dosageForm && <p className="text-red-500 text-xs mt-1">{errors.dosageForm}</p>}
              </div>
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

            {/* Price, Currency, and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Price"
                type="number"
                name="price"
                value={formData.price}
                placeholder="0.00"
                error={errors.price}
                onChangeHandler={handleChange}
                additionalClasses="border-line_clr"
                required
              />

              <div>
                <label className="block text-base font-medium text-black px-2 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

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
              text="Add Medication"
            />
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default AddMedicationModal;