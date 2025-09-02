import React, { useState } from 'react';
import { Clock, RefreshCw, FileText } from 'lucide-react';
import { CreatePrescriptionData } from '../../../../../api/prescriptions';

interface Step4_InstructionsProps {
  instructions: string;
  duration: number;
  refills: number;
  onUpdate: (updates: Partial<CreatePrescriptionData>) => void;
  onContinue: () => void;
}

const Step4_Instructions: React.FC<Step4_InstructionsProps> = ({
  instructions,
  duration,
  refills,
  onUpdate,
  onContinue
}) => {
  const [localInstructions, setLocalInstructions] = useState(instructions);
  const [localDuration, setLocalDuration] = useState(duration);
  const [localRefills, setLocalRefills] = useState(refills);

  const handleContinue = () => {
    onUpdate({
      instructions: localInstructions,
      duration: localDuration,
      refills: localRefills
    });
    onContinue();
  };

  const canContinue = localDuration > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Instructions & Duration</h3>
        <p className="text-gray-600">Set treatment duration and refill information</p>
      </div>

      <div className="space-y-6">
        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Treatment Duration (days) *</span>
            </div>
          </label>
          <input
            type="number"
            value={localDuration}
            onChange={(e) => setLocalDuration(parseInt(e.target.value) || 0)}
            min="1"
            max="365"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500 mt-1">Enter the number of days for this treatment</p>
        </div>

        {/* Refills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-green-500" />
              <span>Number of Refills</span>
            </div>
          </label>
          <input
            type="number"
            value={localRefills}
            onChange={(e) => setLocalRefills(parseInt(e.target.value) || 0)}
            min="0"
            max="12"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">How many refills are allowed (0-12)</p>
        </div>

        {/* General Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-500" />
              <span>General Instructions</span>
            </div>
          </label>
          <textarea
            value={localInstructions}
            onChange={(e) => setLocalInstructions(e.target.value)}
            placeholder="Enter general instructions for the patient (e.g., Take with food, Avoid alcohol, etc.)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-1">Optional: Additional instructions for the patient</p>
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
            Continue to Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4_Instructions;
