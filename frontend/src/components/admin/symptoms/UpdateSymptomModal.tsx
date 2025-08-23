import React, { useState, useEffect } from "react";
import {
  ModalWrapper,
  Input,
  Select,
  FileUploader,
  Button,
  FormHeader,
} from "@/components/ui";
import { Symptom, UpdateSymptomRequest } from "@/api/symptoms";
import { X } from "lucide-react";

interface UpdateSymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: UpdateSymptomRequest) => Promise<boolean>;
  symptom: Symptom | null;
  loading?: boolean;
  specialties?: Array<{ id: number; name: string }>;
}

const UpdateSymptomModal: React.FC<UpdateSymptomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  symptom,
  loading = false,
  specialties = [],
}) => {
  const [formData, setFormData] = useState<UpdateSymptomRequest>({
    name: "",
    specialtyId: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Populate form when symptom changes
  useEffect(() => {
    if (symptom) {
      setFormData({
        name: symptom.name,
        specialtyId: symptom.specialtyId || 0,
      });
      setImagePreview(symptom.iconUrl || null);
      setErrors({});
    }
  }, [symptom]);

  const handleInputChange = (
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Symptom name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Symptom name must be at least 2 characters";
    }

    if (!formData.specialtyId) {
      newErrors.specialtyId = "Specialty is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!symptom || !validateForm()) return;

    const success = await onSubmit(symptom.id, {
      ...formData,
      symptomImage: image || undefined,
    });
    if (success) {
      onClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !symptom) return null;

  const isFormIncomplete = !formData.name?.trim() || !formData.specialtyId;

  return (
    <ModalWrapper>
      <div className="p-2 lg:p-6 w-full max-w-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          disabled={loading}
        >
          <X size={24} />
        </button>

        <FormHeader
          title="Update symptom"
          description="Edit the details for this symptom"
        />

        <form
          onSubmit={handleSubmit}
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
                preview={imagePreview || undefined}
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
              onChangeHandler={handleInputChange}
              additionalClasses="border-line_clr"
              required
            />

            {/* Specialty Select */}
            <Select
              label="Specialty"
              name="specialtyId"
              value={formData.specialtyId?.toString() || ""}
              onChange={handleInputChange}
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
              Update Symptom
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default UpdateSymptomModal;
