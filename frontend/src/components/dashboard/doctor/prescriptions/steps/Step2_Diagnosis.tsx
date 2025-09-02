import React, { useState } from 'react';
import { Stethoscope, FileText } from 'lucide-react';
import { CreatePrescriptionData } from '../../../../../api/prescriptions';

interface Step2_DiagnosisProps {
  diagnosis: string;
  notes: string;
  onUpdate: (updates: Partial<CreatePrescriptionData>) => void;
  onContinue: () => void;
}

const Step2_Diagnosis: React.FC<Step2_DiagnosisProps> = ({
  diagnosis,
  notes,
  onUpdate,
  onContinue
}) => {
  const [localDiagnosis, setLocalDiagnosis] = useState(diagnosis);
  const [localNotes, setLocalNotes] = useState(notes);

  const handleContinue = () => {
    onUpdate({
      diagnosis: localDiagnosis,
      notes: localNotes
    });
    onContinue();
  };

  const canContinue = localDiagnosis.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Diagnosis & Notes</h3>
        <p className="text-gray-600">Enter the diagnosis and any additional notes</p>
      </div>

      <div className="space-y-6">
        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-red-500" />
              <span>Primary Diagnosis *</span>
            </div>
          </label>
          <textarea
            value={localDiagnosis}
            onChange={(e) => setLocalDiagnosis(e.target.value)}
            placeholder="Enter the primary diagnosis..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Additional Notes</span>
            </div>
          </label>
          <textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            placeholder="Enter any additional notes, observations, or recommendations..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>

        {/* Continue Button */}
        <div className="text-center pt-4">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`px-6 py-2 rounded-lg transition-colors ${
              canContinue
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Medications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2_Diagnosis;
