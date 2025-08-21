import React, { useRef } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import { FileUploaderProps } from "@/types";

const FileUploader: React.FC<FileUploaderProps> = ({
  preview,
  onChange,
  className = "",
  text = null,
  accept = "image/*",
  alt = "File Preview",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div
      className={
        "flex min-w-[35%] flex-col items-center justify-center border-2 border-dashed border-line_clr dark:border-secondary rounded-xs min-h-[120px] sm:min-h-[140px] cursor-pointer bg-blue-50/30 dark:bg-dark_bg relative overflow-hidden " +
        className
      }
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      tabIndex={0}
      role="button"
      aria-label="Upload file"
    >
      {preview ? (
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={preview}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-accent">
          <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
          <span className="text-xs text-secondary">
            Drop or <span className="text-accent underline">Upload</span>
          </span>
          <span className="text-xs text-secondary">{`${
            text ? text : "file"
          }`}</span>
        </div>
      )}
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;
