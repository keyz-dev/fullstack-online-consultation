// FileValidator.ts - Validates medication file structure and processes data
export class FileValidator {
    static requiredColumns = [
        'name',
        'category', 
        'dosageForm',
        'price',
        'stockQuantity'
    ];

    static optionalColumns = [
        'genericName',
        'description',
        'strength',
        'manufacturer',
        'requiresPrescription',
        'expiryDate'
    ];

    static validateFileStructure(data: unknown[]): { isValid: boolean; error: string } {
        if (!data || data.length === 0) {
            return {
                isValid: false,
                error: 'File is empty or contains no data'
            };
        }

        // Check if all required columns are present
        const headers = Object.keys(data[0]);
        const missingColumns = this.requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
            return {
                isValid: false,
                error: `Missing required columns: ${missingColumns.join(', ')}`
            };
        }

        // Validate each row
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNumber = i + 2; // +2 because we start from row 2 (after header)

            // Check required fields
            if (!row.name || row.name.trim() === '') {
                return {
                    isValid: false,
                    error: `Row ${rowNumber}: Medication name is required`
                };
            }

            if (!row.category || row.category.trim() === '') {
                return {
                    isValid: false,
                    error: `Row ${rowNumber}: Category is required`
                };
            }

            if (!row.dosageForm || row.dosageForm.trim() === '') {
                return {
                    isValid: false,
                    error: `Row ${rowNumber}: Dosage form is required`
                };
            }

            // Validate price
            const price = parseFloat(row.price);
            if (isNaN(price) || price < 0) {
                return {
                    isValid: false,
                    error: `Row ${rowNumber}: Price must be a valid positive number`
                };
            }

            // Validate stock quantity
            const stockQuantity = parseInt(row.stockQuantity);
            if (isNaN(stockQuantity) || stockQuantity < 0) {
                return {
                    isValid: false,
                    error: `Row ${rowNumber}: Stock quantity must be a valid non-negative integer`
                };
            }

            // Validate expiry date if provided
            if (row.expiryDate && row.expiryDate.trim() !== '') {
                const expiryDate = new Date(row.expiryDate);
                if (isNaN(expiryDate.getTime())) {
                    return {
                        isValid: false,
                        error: `Row ${rowNumber}: Invalid expiry date format. Use YYYY-MM-DD`
                    };
                }
            }

            // Validate requiresPrescription if provided
            if (row.requiresPrescription && row.requiresPrescription.trim() !== '') {
                const validValues = ['true', 'false', '1', '0', 'yes', 'no'];
                if (!validValues.includes(row.requiresPrescription.toLowerCase())) {
                    return {
                        isValid: false,
                        error: `Row ${rowNumber}: requiresPrescription must be true/false, 1/0, or yes/no`
                    };
                }
            }
        }

        return { isValid: true, error: '' };
    }

    static processFileData(data: unknown[]): unknown[] {
        return data.map(row => {
            const processedRow: unknown = {
                name: row.name?.trim() || '',
                category: row.category?.trim() || '',
                dosageForm: row.dosageForm?.trim() || '',
                price: parseFloat(row.price) || 0,
                stockQuantity: parseInt(row.stockQuantity) || 0,
            };

            // Add optional fields if they exist
            if (row.genericName) processedRow.genericName = row.genericName.trim();
            if (row.description) processedRow.description = row.description.trim();
            if (row.strength) processedRow.strength = row.strength.trim();
            if (row.manufacturer) processedRow.manufacturer = row.manufacturer.trim();
            if (row.expiryDate) processedRow.expiryDate = row.expiryDate.trim();

            // Process requiresPrescription
            if (row.requiresPrescription) {
                const value = row.requiresPrescription.toLowerCase().trim();
                processedRow.requiresPrescription = ['true', '1', 'yes'].includes(value);
            } else {
                processedRow.requiresPrescription = false;
            }

            return processedRow;
        });
    }
}
