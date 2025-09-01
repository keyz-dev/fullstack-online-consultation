"use client";

import React from "react";
import { Button } from "@/components/ui";

interface Medication {
  name: string;
  genericName?: string;
  category: string;
  dosageForm: string;
  price: number;
  stockQuantity: number;
  requiresPrescription?: boolean;
  expiryDate?: string;
}

interface BulkInsertTableProps {
  medications: Medication[];
  handleImport: () => void;
  loading: boolean;
}

const BulkInsertTable = ({ medications, handleImport, loading }: BulkInsertTableProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Preview ({medications.length} Medications)
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dosage Form
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prescription
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medications.slice(0, 5).map((medication, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{medication.name}</div>
                  {medication.genericName && (
                    <div className="text-sm text-gray-500">{medication.genericName}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {medication.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {medication.dosageForm}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${medication.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {medication.stockQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    medication.requiresPrescription 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {medication.requiresPrescription ? 'Required' : 'Not Required'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {medications.length > 5 && (
        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600">
          ... and {medications.length - 5} more medications
        </div>
      )}
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <Button
          onClickHandler={handleImport}
          isLoading={loading}
          isDisabled={loading}
          additionalClasses="w-full bg-accent text-white hover:bg-accent-dark"
          text={`Import ${medications.length} Medications`}
        />
      </div>
    </div>
  );
};

export default BulkInsertTable;
