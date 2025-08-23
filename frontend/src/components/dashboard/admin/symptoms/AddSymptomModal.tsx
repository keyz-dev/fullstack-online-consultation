import React, { useState } from "react";
import {
  ModalWrapper,
  Input,
  Select,
  FileUploader,
  Button,
  FormHeader,
} from "@/components/ui";
import { CreateSymptomRequest } from "@/api/symptoms";
import { X } from "lucide-react";

interface AddSymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSymptomRequest) => Promise<boolean>;
  loading?: boolean;
  specialties?: Array<{ id: number; name: string }>;
}

const AddSymptomModal: React.FC<AddSymptomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  specialties = [],
}) => {
  const [formData, setFormData] = useState<CreateSymptomRequest>({
    name: "",
    specialtyId: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (file: File) => {
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.specialtyId || formData.specialtyId === 0)
      newErrors.specialtyId = "Specialty is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const success = await onSubmit({ ...formData, symptomImage: image });
    if (success) {
      // Reset form
      setFormData({ name: "", specialtyId: 0 });
      setImage(undefined);
      setImagePreview(undefined);
      setErrors({});
      onClose();
    }
  };

  const isFormIncomplete =
    !formData.name || !formData.specialtyId || formData.specialtyId === 0;

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-2 lg:p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <FormHeader
          title="Add a symptom"
          description="Define medical symptoms for your healthcare platform"
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="min-w-sm lg:min-w-lg mx-auto flex flex-col"
          autoComplete="off"
          encType="multipart/form-data"
        >
          <div className="space-y-4 mb-8">
            {/* Image Upload */}
            <div className="w-40">
              <FileUploader
                onChange={handleFileChange}
                accept="image/*"
                preview={imagePreview}
                text="symptom icon"
              />
            </div>

            {/* Name Input */}
            <Input
              label="Symptom Name"
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter symptom name"
              error={errors.name}
              onChangeHandler={handleChange}
              additionalClasses="border-line_clr"
              required
            />

            {/* Specialty Select */}
            <Select
              label="Specialty"
              name="specialtyId"
              value={formData.specialtyId?.toString() || ""}
              onChange={handleChange}
              additionalClasses="border-line_clr"
              error={errors.specialtyId}
              required
              options={[
                { value: "", label: "Select a specialty" },
                ...specialties.map((specialty) => ({
                  value: specialty.id.toString(),
                  label: specialty.name,
                })),
              ]}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              additionalClasses="primaryBtn bg-accent text-white"
              isLoading={loading}
              isDisabled={isFormIncomplete || Object.keys(errors).length > 0}
            >
              Add Symptom
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default AddSymptomModal;
