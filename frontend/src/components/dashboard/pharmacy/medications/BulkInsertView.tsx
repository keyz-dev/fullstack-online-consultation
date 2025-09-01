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
    const { bulkInsertMedications, loading, error, downloadTemplate } = usePharmacyMedications();

    const [medications, setMedications] = useState([]);
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
        if (file && medications.length > 0) {
            const result = await bulkInsertMedications(file);
            if (result.success) {
                setSuccessMessage(result.message || 'Medications imported successfully!');
                setMedications([]);
                setFile(null);
                setValidationError('');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
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
                <h1 className="text-2xl font-bold mb-2">Bulk Import your Medications</h1>

                <ErrorMessages
                    successMessage={successMessage}
                    error={error}
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
