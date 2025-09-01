"use client";

import React, { useState } from 'react';
import { usePharmacyMedications } from '@/hooks/usePharmacyMedications';

// Import reusable UI components
import { Button } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';
import { BulkImportRequirement, BulkInsertTable } from './';

// Import our new smaller components
import { FileProcessor } from './utils/FileProcessor';
import ErrorMessages from './ErrorMessages';
import FileUploadSection from './FileUploadSection';

const BulkInsertView = ({ setView }: { setView: () => void }) => {
    const { bulkCreateMedications, loading, error, downloadTemplate } = usePharmacyMedications();

    const [medications, setMedications] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [validationError, setValidationError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileDrop = (acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setValidationError('');
            setMedications([]);

            // Use FileProcessor to handle the file
            FileProcessor.processFile(
                selectedFile,
                // Success callback
                (processedMedications) => {
                    setMedications(processedMedications);
                    setValidationError('');
                },
                // Error callback
                (errorMessage) => {
                    setValidationError(errorMessage);
                    setMedications([]);
                }
            );
        }
    };

    const handleImport = async () => {
        if (medications.length > 0) {
            const result = await bulkCreateMedications(medications);
            if (result.success) {
                setSuccessMessage(result.message || 'Medications created successfully!');
                setMedications([]);
                setFile(null);
                setValidationError('');
                
                // Redirect to main view after successful creation
                setTimeout(() => {
                    setSuccessMessage('');
                    setView(); // This will redirect back to the main medications view
                }, 2000); // Show success message for 2 seconds before redirecting
            }
        }
    };

    const handleChangeFile = () => {
        setFile(null);
        setMedications([]);
        setValidationError('');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Button
                onClickHandler={setView}
                additionalClasses="mb-6 inline-flex items-center text-placeholder hover:text-secondary transition-colors cursor-pointer"
                leadingIcon={<ArrowLeft size={16} />}
                text="Back to main"
            />

            <div className="mb-4">
                <h1 className="text-2xl font-bold mb-2">Import your Medications In Bulk</h1>

                <ErrorMessages
                    successMessage={successMessage}
                    error={error || undefined}
                    validationError={validationError}
                />
            </div>

            {/* Instructions Section */}
            <BulkImportRequirement />

            {/* File Upload Section */}
            <FileUploadSection
                onFileDrop={handleFileDrop}
                file={file}
                medications={medications}
                onChangeFile={handleChangeFile}
                onDownloadTemplate={downloadTemplate}
            />

            {/* Data Preview Section */}
            {medications.length > 0 && !validationError && (
                <BulkInsertTable
                    medications={medications}
                    handleImport={handleImport}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default BulkInsertView;
