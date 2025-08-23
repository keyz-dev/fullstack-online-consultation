import React, { useState } from "react";
import {
  ModalWrapper,
  Input,
  TextArea,
  FileUploader,
  Button,
  FormHeader,
} from "@/components/ui";
import { CreateSpecialtyRequest } from "@/api/specialties";
import { X } from "lucide-react";
import { toast } from "react-toastify";

interface AddSpecialtyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSpecialtyRequest) => Promise<boolean>;
  loading?: boolean;
}

const AddSpecialtyModal: React.FC<AddSpecialtyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateSpecialtyRequest>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const success = await onSubmit({ ...formData, specialtyImage: image });
    if (success) {
      // Reset form
      setFormData({ name: "", description: "" });
      setImage(undefined);
      setImagePreview(undefined);
      setErrors({});
      onClose();
      toast.success("Specialty added successfully");
    } else {
      toast.error("Failed to add specialty");
    }
  };

  const isFormIncomplete = !formData.name || !formData.description;

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
          title="Add a specialty"
          description="Define the medical specialties for your healthcare platform"
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
                preview={imagePreview}
                onChange={(file) => {
                  setImage(file);
                  if (file) {
                    setImagePreview(URL.createObjectURL(file));
                  } else {
                    setImagePreview(undefined);
                  }
                }}
                text="specialty icon"
              />
            </div>

            <Input
              label="Specialty Name"
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter specialty name"
              error={errors.name}
              onChangeHandler={handleChange}
              additionalClasses="border-gray-300 dark:border-gray-600"
              required
            />

            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              placeholder="Enter specialty description"
              error={errors.description}
              onChangeHandler={handleChange}
              additionalClasses="border-gray-300 dark:border-gray-600"
              required={true}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button
              onClickHandler={handleSave}
              additionalClasses="bg-blue-600 hover:bg-blue-700 text-white"
              isLoading={loading}
              isDisabled={isFormIncomplete || Object.keys(errors).length > 0}
            >
              Save Specialty
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default AddSpecialtyModal;
