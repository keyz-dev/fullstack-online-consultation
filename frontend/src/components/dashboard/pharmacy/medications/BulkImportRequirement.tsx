"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

const BulkImportRequirement = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const requirements = [
    "Upload a CSV or Excel file with medication data",
    "Required columns: name, category, dosageForm, price, stockQuantity",
    "Optional columns: genericName, description, strength, manufacturer, requiresPrescription, expiryDate",
    "Download the template below for the correct format",
  ];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Info className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Instructions</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-4">
          <ul className="space-y-2">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BulkImportRequirement;
