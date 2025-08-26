"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Separator } from "@/components/ui";
import { ModalWrapper } from "@/components/ui/ModalWrapper";
import { TimeBlockForm } from "./TimeBlockForm";
import { TimeBlockPreview } from "./TimeBlockPreview";
import { validationUtils } from "@/utils/availabilityHelpers";
import { TimeBlock, Availability } from "@/types/availability";
import { X, Save, Plus } from "lucide-react";

interface TimeBlockBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (timeBlock: TimeBlock) => void;
  existingAvailabilities: Availability[];
  editingAvailability?: Availability;
}

export const TimeBlockBuilder: React.FC<TimeBlockBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  existingAvailabilities,
  editingAvailability,
}) => {
  const [formData, setFormData] = useState<Partial<TimeBlock>>({
    startTime: "",
    endTime: "",
    consultationDuration: 30,
    consultationType: "online",
    consultationFee: 0,
    maxPatients: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (editingAvailability) {
      setFormData({
        startTime: editingAvailability.startTime,
        endTime: editingAvailability.endTime,
        consultationDuration: editingAvailability.consultationDuration,
        consultationType: editingAvailability.consultationType,
        consultationFee: editingAvailability.consultationFee,
        maxPatients: editingAvailability.maxPatients,
      });
    } else {
      setFormData({
        startTime: "",
        endTime: "",
        consultationDuration: 30,
        consultationType: "online",
        consultationFee: 0,
        maxPatients: undefined,
      });
    }
  }, [editingAvailability]);

  // Validate form data
  useEffect(() => {
    const validation = validationUtils.validateTimeBlock(formData);
    setErrors(validation.errors);
    setIsValid(validation.isValid);
  }, [formData]);

  // Check for conflicts with existing availabilities
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const conflict = validationUtils.checkTimeConflict(
        formData,
        existingAvailabilities.filter((av) => av.id !== editingAvailability?.id)
      );
      if (conflict) {
        setErrors((prev) => ({ ...prev, conflict }));
      } else {
        setErrors((prev) => {
          const { conflict, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [formData, existingAvailabilities, editingAvailability]);

  const handleInputChange = useCallback(
    (field: keyof TimeBlock, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSave = useCallback(() => {
    if (!isValid) return;

    const timeBlock: TimeBlock = {
      id: editingAvailability?.id || Date.now(),
      dayOfWeek: editingAvailability?.dayOfWeek || 0,
      startTime: formData.startTime!,
      endTime: formData.endTime!,
      consultationDuration: formData.consultationDuration!,
      consultationType: formData.consultationType!,
      consultationFee: formData.consultationFee!,
      maxPatients: formData.maxPatients,
    };

    onSave(timeBlock);
    onClose();
  }, [isValid, formData, editingAvailability, onSave, onClose]);

  const handleClose = useCallback(() => {
    setFormData({
      startTime: "",
      endTime: "",
      consultationDuration: 30,
      consultationType: "online",
      consultationFee: 0,
      maxPatients: undefined,
    });
    setErrors({});
    onClose();
  }, [onClose]);

  return (
    <ModalWrapper>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Plus className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingAvailability ? "Edit Session" : "Add New Session"}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex max-h-[calc(90vh-140px)]">
          {/* Form Section */}
          <div className="flex-1 p-6 overflow-y-auto">
            <TimeBlockForm
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />
          </div>

          <Separator orientation="vertical" className="mx-4" />

          {/* Preview Section */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <TimeBlockPreview
              formData={formData}
              errors={errors}
              isValid={isValid}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isValid}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{editingAvailability ? "Update" : "Save"} Session</span>
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};
