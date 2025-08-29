import React from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  GraduationCap,
  Languages,
  Star,
  Clock,
  DollarSign,
} from "lucide-react";
import { PatientAppointment } from "@/api/appointments";

interface PatientAppointmentDoctorTabProps {
  appointment: PatientAppointment;
}

const PatientAppointmentDoctorTab: React.FC<
  PatientAppointmentDoctorTabProps
> = ({ appointment }) => {
  return (
    <div className="space-y-8">
      {/* Doctor Profile */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User size={20} className="text-blue-600 dark:text-blue-400" />
          Doctor Profile
        </h4>
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 relative">
              {appointment.doctor.user.avatar ? (
                <Image
                  src={appointment.doctor.user.avatar}
                  alt={appointment.doctor.user.name}
                  fill
                  className="object-cover rounded-full border-2 border-blue-200 dark:border-blue-700"
                  sizes="80px"
                />
              ) : (
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-semibold">
                  {appointment.doctor.user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Dr. {appointment.doctor.user.name}
              </h5>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {appointment.doctor.specialties &&
                appointment.doctor.specialties.length > 0
                  ? appointment.doctor.specialties.map((s) => s.name).join(", ")
                  : "General Medicine"}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.8 (120 reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>5+ years experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Mail size={20} className="text-green-600 dark:text-green-400" />
          Contact Information
        </h4>
        <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-400" />
              <span className="text-sm text-gray-900 dark:text-white">
                {appointment.doctor.user.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Award size={20} className="text-purple-600 dark:text-purple-400" />
          Professional Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              Credentials
            </h5>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">
                  License: {appointment.doctor.licenseNumber || "Not specified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">
                  Experience: {appointment.doctor.experience || "Not specified"}{" "}
                  years
                </span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              Specialties
            </h5>
            <div className="space-y-3">
              {appointment.doctor.specialties &&
              appointment.doctor.specialties.length > 0 ? (
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {appointment.doctor.specialties
                      .map((s) => s.name)
                      .join(", ")}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No specialties specified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Details */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign
            size={20}
            className="text-indigo-600 dark:text-indigo-400"
          />
          Consultation Details
        </h4>
        <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Consultation Fee
              </label>
              <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                {appointment.consultationFee
                  ? `$${appointment.consultationFee}`
                  : "Not specified"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {appointment.doctor.consultationDuration || 30} minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointmentDoctorTab;
