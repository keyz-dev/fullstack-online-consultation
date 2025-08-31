import React, { useState } from 'react';
import { 
  FileText, 
  History, 
  Pill, 
  AlertCircle, 
  User, 
  Calendar,
  Phone,
  Shield,
  Camera,
  Mic
} from 'lucide-react';
import Button from '../ui/Button';

interface QuickActionsPanelProps {
  userRole: string;
  patientInfo?: {
    name: string;
    age: number;
    lastVisit?: string;
    allergies?: string[];
    currentMedications?: string[];
  };
  onWritePrescription: () => void;
  onViewHistory: () => void;
  onEmergencyCall: () => void;
  onTakeScreenshot: () => void;
  onToggleRecording: () => void;
  isRecording: boolean;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  userRole,
  patientInfo,
  onWritePrescription,
  onViewHistory,
  onEmergencyCall,
  onTakeScreenshot,
  onToggleRecording,
  isRecording,
}) => {
  const [showPatientInfo, setShowPatientInfo] = useState(false);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {userRole === 'doctor' ? 'Quick Actions' : 'Consultation Tools'}
        </h3>
      </div>

      {/* Patient Info (Doctor only) */}
      {userRole === 'doctor' && patientInfo && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowPatientInfo(!showPatientInfo)}
            className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {patientInfo.name}, {patientInfo.age}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {showPatientInfo ? 'Hide' : 'Show'} Info
            </span>
          </button>
          
          {showPatientInfo && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
              {patientInfo.lastVisit && (
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Last visit: {patientInfo.lastVisit}
                </p>
              )}
              {patientInfo.allergies && patientInfo.allergies.length > 0 && (
                <p className="text-red-600 dark:text-red-400 mb-2">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Allergies: {patientInfo.allergies.join(', ')}
                </p>
              )}
              {patientInfo.currentMedications && patientInfo.currentMedications.length > 0 && (
                <p className="text-gray-600 dark:text-gray-400">
                  <Pill className="w-4 h-4 inline mr-1" />
                  Current meds: {patientInfo.currentMedications.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex-1 p-4 space-y-3">
        {/* Doctor Actions */}
        {userRole === 'doctor' && (
          <>
            <Button
              onClickHandler={onWritePrescription}
              additionalClasses="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Write Prescription</span>
            </Button>
            
            <Button
              onClickHandler={onViewHistory}
              additionalClasses="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
            >
              <History className="w-5 h-5" />
              <span>Patient History</span>
            </Button>

            <Button
              onClickHandler={onToggleRecording}
              additionalClasses={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-gray-300'}`} />
              <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </Button>
          </>
        )}

        {/* Common Actions */}
        <Button
          onClickHandler={onTakeScreenshot}
          additionalClasses="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
        >
          <Camera className="w-5 h-5" />
          <span>Take Screenshot</span>
        </Button>

        {/* Emergency Button */}
        <Button
          onClickHandler={onEmergencyCall}
          additionalClasses="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2 border-2 border-red-400"
        >
          <Shield className="w-5 h-5" />
          <span>Emergency Call</span>
        </Button>

        {/* Patient Specific Actions */}
        {userRole === 'patient' && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Need help during consultation?
            </p>
            <Button
              onClickHandler={() => {/* TODO: Implement help request */}}
              additionalClasses="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Request Help</span>
            </Button>
          </div>
        )}
      </div>

      {/* Session Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>Session encrypted and secure</p>
          <p>All actions are logged for quality assurance</p>
        </div>
      </div>
    </div>
  );
};
