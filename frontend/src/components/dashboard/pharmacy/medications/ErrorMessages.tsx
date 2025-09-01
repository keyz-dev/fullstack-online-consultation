"use client";

import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ErrorMessagesProps {
  successMessage?: string;
  error?: string;
  validationError?: string;
}

const ErrorMessages = ({ successMessage, error, validationError }: ErrorMessagesProps) => {
  if (!successMessage && !error && !validationError) {
    return null;
  }

  return (
    <div className="space-y-3">
      {successMessage && (
        <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="w-5 h-5 text-red-500 mr-3" />
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {validationError && (
        <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
          <p className="text-yellow-800 font-medium">{validationError}</p>
        </div>
      )}
    </div>
  );
};

export default ErrorMessages;
