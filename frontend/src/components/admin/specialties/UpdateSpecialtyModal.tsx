import React, { useState, useEffect } from "react";
import {
  ModalWrapper,
  FormHeader,
  Input,
  TextArea,
  FileUploader,
  Button,
} from "@/components/ui";
import { Specialty, UpdateSpecialtyRequest } from "@/api/specialties";
import { X } from "lucide-react";
import { toast } from "react-toastify";

interface UpdateSpecialtyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: UpdateSpecialtyRequest) => Promise<boolean>;
  specialty: Specialty | null;
  loading?: boolean;
}

const UpdateSpecialtyModal: React.FC<UpdateSpecialtyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  specialty,
  loading = false,
}) => {
  const [formData, setFormData] = useState<UpdateSpecialtyRequest>({
    name: "",
    description: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Populate form when specialty changes
  useEffect(() => {
    if (specialty) {
      setFormData({
        name: specialty.name,
        description: specialty.description || "",
        isActive: specialty.isActive,
      });
      setImagePreview(specialty.icon || null);
      setErrors({});
    }
  }, [specialty]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      newErrors.name = "Specialty name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Specialty name must be at least 2 characters";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!specialty || !validateForm()) return;

    const success = await onSubmit(specialty.id, {
      ...formData,
      specialtyImage: image || undefined,
    });
    if (success) {
      onClose();
      toast.success("Specialty updated successfully");
    } else {
      toast.error("Failed to update specialty");
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !specialty) return null;

  const isFormIncomplete =
    !formData.name?.trim() || !formData.description?.trim();

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
          title="Update specialty"
          description="Edit the details for this specialty"
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
                text="specialty icon"
              />
            </div>

            {/* Name Input */}
            <Input
              label="Specialty Name"
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter specialty name"
              error={errors.name}
              onChangeHandler={handleInputChange}
              additionalClasses="border-line_clr"
              required
            />

            {/* Description Input */}
            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              placeholder="Enter specialty description"
              error={errors.description}
              onChangeHandler={handleInputChange}
              additionalClasses="border-line_clr"
              rows={4}
              required
            />

            {/* Status Toggle */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Active
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              additionalClasses="primaryBtn bg-accent text-white"
              isLoading={loading}
              isDisabled={isFormIncomplete || Object.keys(errors).length > 0}
            >
              Update Specialty
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default UpdateSpecialtyModal;
