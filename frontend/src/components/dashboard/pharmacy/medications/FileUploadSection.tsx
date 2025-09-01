"use client";

import React from 'react';
import { Download, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui';
import FileDropzone from '@/components/ui/FileDropzone';

interface Medication {
  name: string;
  category: string;
  dosageForm: string;
  price: number;
  stockQuantity: number;
}

interface FileUploadSectionProps {
  onFileDrop: (files: File[]) => void;
  file: File | null;
  medications: Medication[];
  onChangeFile: () => void;
  onDownloadTemplate?: () => void;
}

const FileUploadSection = ({
  onFileDrop,
  file,
  medications,
  onChangeFile,
  onDownloadTemplate
}: FileUploadSectionProps) => {

  const acceptedFileTypes = {
    'text/csv': ['.csv'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  };

  return (
    <section className="">
      {/* Download Template Button */}
      <Button
        onClickHandler={onDownloadTemplate}
        additionalClasses="my-6 inline-flex items-center text-green-600 border-green-600 hover:bg-green-100"
        leadingIcon={<Download size={16} />}
        text="Download Template"
      />

      {/* File Upload Section */}
      <div className="mb-6">
        <FileDropzone onDrop={onFileDrop} accept={acceptedFileTypes} />
        {file && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
            {medications.length > 0 && (
              <p className="text-sm text-green-600">
                ✓ File validated successfully - {medications.length} medications found
              </p>
            )}
          </div>
        )}
      </div>

      {/* Change File Button */}
      {file && (
        <Button
          onClickHandler={onChangeFile}
          additionalClasses="mb-6 text-orange-600 border-orange-600 hover:bg-orange-100"
          leadingIcon={<Edit3 size={16} />}
          text="Change File"
        />
      )}
    </section>
  );
};

export default FileUploadSection;
