// FileProcessor.ts - Handles CSV and Excel file processing for medications
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { FileValidator } from './FileValidator';

export class FileProcessor {
    static handleCSVFile(selectedFile: File, onSuccess: (medications: any[]) => void, onError: (error: string) => void) {
        Papa.parse(selectedFile, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim(), // Clean headers
            complete: (results) => {
                const validation = FileValidator.validateFileStructure(results.data);
                if (!validation.isValid) {
                    onError(validation.error);
                    return;
                }

                const processedMedications = FileValidator.processFileData(results.data);
                onSuccess(processedMedications);
            },
            error: (err) => {
                console.error("CSV parsing error:", err);
                onError('Error parsing CSV file. Please check the file format.');
            },
        });
    }

    static handleExcelFile(selectedFile: File, onSuccess: (medications: any[]) => void, onError: (error: string) => void) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                // Get the first sheet
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (jsonData.length < 2) {
                    onError('Excel file must have at least a header row and one data row');
                    return;
                }

                // Convert to object format with headers
                const headers = jsonData[0].map((h: any) => String(h).trim());
                const dataRows = jsonData.slice(1).map((row: any) => {
                    const obj: any = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index] || '';
                    });
                    return obj;
                });

                console.log('Excel Parse Results:', dataRows);

                const validation = FileValidator.validateFileStructure(dataRows);
                if (!validation.isValid) {
                    onError(validation.error);
                    return;
                }

                const processedMedications = FileValidator.processFileData(dataRows);
                onSuccess(processedMedications);
            } catch (error) {
                console.error('Excel parsing error:', error);
                onError('Error parsing Excel file. Please check the file format.');
            }
        };
        reader.readAsArrayBuffer(selectedFile);
    }

    static processFile(selectedFile: File, onSuccess: (medications: any[]) => void, onError: (error: string) => void) {
        if (selectedFile.name.endsWith('.csv')) {
            this.handleCSVFile(selectedFile, onSuccess, onError);
        } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
            this.handleExcelFile(selectedFile, onSuccess, onError);
        } else {
            onError('Please upload a CSV or Excel file');
        }
    }
}
