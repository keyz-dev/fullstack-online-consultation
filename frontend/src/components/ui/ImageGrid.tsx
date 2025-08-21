import React, { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";

interface NewImage {
  id: string;
  url: string;
  name: string;
}

interface ValidationState {
  status: "pending" | "validating" | "valid" | "invalid";
  confidence?: number;
  message?: string;
}

interface ImageGridProps {
  existingImages?: string[];
  newImages?: NewImage[];
  onRemoveExisting?: (index: number) => void;
  onRemoveNew?: (id: string) => void;
  onAddImages?: (files: File[]) => void;
  label?: string;
  gridCols?: number;
  imageHeight?: string;
  validationStates?: Map<string, ValidationState>;
  getValidationState?: (id: string) => ValidationState;
}

export default function ImageGrid({
  existingImages = [],
  newImages = [],
  onRemoveExisting,
  onRemoveNew,
  onAddImages,
  label = "Images",
  gridCols = 4,
  imageHeight = "h-26",
  validationStates = new Map(),
  getValidationState = () => ({ status: "pending" }),
}: ImageGridProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map gridCols to actual Tailwind classes
  const getGridClass = (cols: number) => {
    const gridClasses: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    return gridClasses[cols] || "grid-cols-3";
  };

  const handleAddImages = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (onAddImages) {
      onAddImages(files);
    }
    event.target.value = "";
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-secondary mb-2">
        {label}
      </label>

      <div className={`grid ${getGridClass(gridCols)} gap-2`}>
        {/* Existing Images */}
        {existingImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className={`w-full ${imageHeight} object-cover rounded-sm border border-gray-200`}
            />
            <button
              type="button"
              onClick={() => onRemoveExisting?.(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        {/* New Images with Validation */}
        {newImages.map((image) => {
          const validationState = getValidationState(image.id);
          return (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={image.name}
                className={`w-full ${imageHeight} object-cover rounded-sm border border-gray-200`}
              />

              {/* Validation Overlay */}
              {validationState.status !== "pending" && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-xs text-center">
                    {validationState.status === "validating" && "Validating..."}
                    {validationState.status === "valid" && "✓ Valid"}
                    {validationState.status === "invalid" && "✗ Invalid"}
                    {validationState.confidence && (
                      <div className="mt-1">
                        {Math.round(validationState.confidence * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => onRemoveNew?.(image.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-10"
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}

        {/* Add Image Button */}
        <button
          type="button"
          onClick={handleAddImages}
          className={`w-full ${imageHeight} border-2 border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors duration-200`}
        >
          <Plus size={24} />
          <span className="text-xs mt-1">Add Image</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
