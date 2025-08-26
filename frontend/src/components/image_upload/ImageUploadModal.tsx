import React, { useRef, useState } from "react";
import { X, ImageIcon, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "../ui";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{ id: string; file: File; url: string; name: string }>;
  onImagesChange: (
    images: Array<{ id: string; file: File; url: string; name: string }>
  ) => void;
}

const ImageUploadModal = ({
  isOpen,
  onClose,
  images,
  onImagesChange,
}: ImageUploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    setIsProcessing(true);

    // Process files with a small delay to show loading state
    setTimeout(() => {
      const newImages: Array<{
        id: string;
        file: File;
        url: string;
        name: string;
      }> = [];

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const newImage = {
              id: Date.now() + Math.random().toString(),
              file,
              url: e.target?.result as string,
              name: file.name,
            };
            newImages.push(newImage);

            // Update images when all files are processed
            if (
              newImages.length ===
              files.filter((f) => f.type.startsWith("image/")).length
            ) {
              onImagesChange([...images, ...newImages]);
              setIsProcessing(false);
            }
          };
          reader.readAsDataURL(file);
        }
      });

      // If no valid images, stop processing
      if (files.filter((f) => f.type.startsWith("image/")).length === 0) {
        setIsProcessing(false);
      }
    }, 500);
  };

  const handleFileDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    setIsProcessing(true);

    // Process files with a small delay to show loading state
    setTimeout(() => {
      const newImages: Array<{
        id: string;
        file: File;
        url: string;
        name: string;
      }> = [];

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const newImage = {
              id: Date.now() + Math.random().toString(),
              file,
              url: e.target?.result as string,
              name: file.name,
            };
            newImages.push(newImage);

            // Update images when all files are processed
            if (
              newImages.length ===
              files.filter((f) => f.type.startsWith("image/")).length
            ) {
              onImagesChange([...images, ...newImages]);
              setIsProcessing(false);
            }
          };
          reader.readAsDataURL(file);
        }
      });

      // If no valid images, stop processing
      if (files.filter((f) => f.type.startsWith("image/")).length === 0) {
        setIsProcessing(false);
      }
    }, 500);
  };

  const removeImage = (imageId: string) => {
    onImagesChange(images.filter((img) => img.id !== imageId));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    // Only close when user explicitly clicks upload
    onClose();
  };

  // Drag and drop reordering functions
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];

    // Remove the dragged item
    newImages.splice(draggedIndex, 1);

    // Insert at the new position
    newImages.splice(dropIndex, 0, draggedImage);

    onImagesChange(newImages);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-sm w-full max-w-4xl max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-line_clr dark:border-gray-700">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-primary dark:text-white">
              Upload Photos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {images.length} Items selected{" "}
              {images.length > 1 && ` - you can drag and drop to reorder`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBrowseClick}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              disabled={isProcessing}
            >
              <Plus className="w-5 h-5 text-primary dark:text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              disabled={isProcessing}
            >
              <X className="w-5 h-5 text-primary dark:text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {images.length === 0 ? (
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-sm p-12 text-center"
              onDragOver={handleFileDragOver}
              onDrop={handleFileDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-sm flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-primary dark:text-white">
                    Drag and Drop
                  </h3>
                  <p className="text-sm text-secondary dark:text-gray-400 mt-1">
                    or browse for photos
                  </p>
                </div>
                <Button
                  onClickHandler={handleBrowseClick}
                  additionalClasses="primarybtn min-h-fit min-w-fit px-6 py-2"
                  isDisabled={isProcessing}
                >
                  Browse
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative group border-2 border-transparent rounded-sm transition-all ${
                    draggedIndex === index ? "opacity-50 scale-95" : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="relative">
                    <div className="aspect-square rounded-sm overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                      <div className="cursor-move p-1 hover:bg-black/20 dark:hover:bg-white/20 rounded">
                        <GripVertical className="w-3 h-3 text-white dark:text-gray-800" />
                      </div>
                      {index === 0 && (
                        <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      disabled={isProcessing}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {image.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-line_clr dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 text-secondary dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <Button
            onClickHandler={handleUpload}
            isDisabled={images.length === 0 || isProcessing}
            additionalClasses="primarybtn px-6 py-2"
          >
            {isProcessing ? "Processing..." : "Upload"}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default ImageUploadModal;
