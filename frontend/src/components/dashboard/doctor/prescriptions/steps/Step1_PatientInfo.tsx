import React from "react";
import { User, Calendar, Phone, Venus } from "lucide-react";

interface Step1_PatientInfoProps {
  patientInfo: {
    name: string;
    age: number;
    gender: string;
    contactNumber: string;
  };
  onContinue: () => void;
}

const Step1_PatientInfo: React.FC<Step1_PatientInfoProps> = ({
  patientInfo,
  onContinue,
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Full Name</p>
            <p className="font-medium text-gray-900">{patientInfo.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Age</p>
            <p className="font-medium text-gray-900">{patientInfo.age} years</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <Venus className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-medium text-gray-900">{patientInfo.gender}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <Phone className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Contact Number</p>
            <p className="font-medium text-gray-900">
              {patientInfo.contactNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_PatientInfo;
