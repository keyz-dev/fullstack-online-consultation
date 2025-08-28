import React from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Pill,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { DoctorAppointment } from "@/api/appointments";

interface AppointmentPatientTabProps {
  appointment: DoctorAppointment;
}

const AppointmentPatientTab: React.FC<AppointmentPatientTabProps> = ({
  appointment,
}) => {
  if (!appointment.patient) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <User
          size={64}
          className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
        />
        <p className="text-lg font-medium mb-2">
          Patient information not available
        </p>
        <p className="text-sm">
          No patient data could be retrieved for this appointment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Basic Patient Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User size={20} className="text-blue-600 dark:text-blue-400" />
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                {appointment.patient.user.avatar ? (
                  <img
                    src={appointment.patient.user.avatar}
                    alt={appointment.patient.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
                    {appointment.patient.user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">
                  {appointment.patient.user.name}
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Patient ID: {appointment.patient.id}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">
                  Age: {appointment.patient.age || "Not specified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Gender: {appointment.patient.gender || "Not specified"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              Contact Information
            </h5>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {appointment.patient.user.email}
                </span>
              </div>
              {appointment.patient.user.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {appointment.patient.user.phoneNumber}
                  </span>
                </div>
              )}
              {appointment.patient.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-900 dark:text-white">
                    {appointment.patient.address.streetAddress}
                    <br />
                    {appointment.patient.address.city},{" "}
                    {appointment.patient.address.state}
                    <br />
                    {appointment.patient.address.country}{" "}
                    {appointment.patient.address.postalCode}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Heart size={20} className="text-red-600 dark:text-red-400" />
          Medical Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointment.patient.medicalHistory && (
            <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText
                  size={16}
                  className="text-red-600 dark:text-red-400"
                />
                Medical History
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {appointment.patient.medicalHistory}
              </p>
            </div>
          )}

          {appointment.patient.allergies &&
            appointment.patient.allergies.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <AlertTriangle
                    size={16}
                    className="text-red-600 dark:text-red-400"
                  />
                  Allergies
                </h5>
                <div className="flex flex-wrap gap-2">
                  {appointment.patient.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {appointment.patient.currentMedications &&
            appointment.patient.currentMedications.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Pill
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  Current Medications
                </h5>
                <div className="flex flex-wrap gap-2">
                  {appointment.patient.currentMedications.map(
                    (medication, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
                      >
                        {medication}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Emergency Contact */}
      {appointment.patient.emergencyContact && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Phone size={20} className="text-orange-600 dark:text-orange-400" />
            Emergency Contact
          </h4>
          <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Name
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {appointment.patient.emergencyContact.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Relationship
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {appointment.patient.emergencyContact.relationship}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {appointment.patient.emergencyContact.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPatientTab;
