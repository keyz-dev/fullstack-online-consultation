import React from 'react';
import { Check, User, Stethoscope, Pill, Clock, FileText } from 'lucide-react';
import { CreatePrescriptionData } from '../../../../../api/prescriptions';

interface Step5_ReviewProps {
  prescriptionData: CreatePrescriptionData;
  patientInfo: {
    name: string;
    age: number;
    gender: string;
    contactNumber: string;
  };
  onGenerate: () => void;
  loading: boolean;
}

const Step5_Review: React.FC<Step5_ReviewProps> = ({
  prescriptionData,
  patientInfo,
  onGenerate,
  loading
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Prescription</h3>
        <p className="text-gray-600">Review all details before generating the prescription</p>
      </div>

      <div className="space-y-6">
        {/* Patient Information */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Patient Information</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium">{patientInfo.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Age:</span>
              <span className="ml-2 font-medium">{patientInfo.age} years</span>
            </div>
            <div>
              <span className="text-gray-600">Gender:</span>
              <span className="ml-2 font-medium">{patientInfo.gender}</span>
            </div>
            <div>
              <span className="text-gray-600">Contact:</span>
              <span className="ml-2 font-medium">{patientInfo.contactNumber}</span>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Stethoscope className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">Diagnosis</h4>
          </div>
          <p className="text-gray-800">{prescriptionData.diagnosis}</p>
          {prescriptionData.notes && (
            <div className="mt-3">
              <span className="text-sm text-gray-600">Notes:</span>
              <p className="text-gray-700 mt-1">{prescriptionData.notes}</p>
            </div>
          )}
        </div>

        {/* Medications */}
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Pill className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Medications ({prescriptionData.medications.length})</h4>
          </div>
          <div className="space-y-3">
            {prescriptionData.medications.map((medication: any, index: number) => (
              <div key={index} className="bg-white rounded-md p-4 border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">{medication.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Dosage:</span>
                    <span className="ml-1">{medication.dosage}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Frequency:</span>
                    <span className="ml-1">{medication.frequency}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="ml-1">{medication.duration}</span>
                  </div>
                  {medication.instructions && (
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Instructions:</span>
                      <span className="ml-1">{medication.instructions}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Details */}
        <div className="bg-orange-50 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-gray-900">Treatment Details</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-medium">{prescriptionData.duration} days</span>
            </div>
            <div>
              <span className="text-gray-600">Refills:</span>
              <span className="ml-2 font-medium">{prescriptionData.refills}</span>
            </div>
          </div>
          {prescriptionData.instructions && (
            <div className="mt-3">
              <span className="text-gray-600">General Instructions:</span>
              <p className="text-gray-700 mt-1">{prescriptionData.instructions}</p>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <div className="text-center pt-6">
          <button
            onClick={onGenerate}
            disabled={loading}
            className={`px-8 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>{loading ? 'Generating...' : 'Generate Prescription'}</span>
          </button>
          <p className="text-sm text-gray-500 mt-2">
            The prescription will be generated as a PDF and both you and the patient will be notified
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step5_Review;
