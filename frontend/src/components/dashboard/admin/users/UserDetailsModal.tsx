import React from "react";
import { ModalWrapper, Button, StatusPill } from "@/components/ui";
import { User } from "@/api/users";
import { X, Calendar, MapPin, Phone, Mail, Shield, Clock } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!user) return null;

  const getContactInfo = () => {
    if (user.patient?.contactInfo) return user.patient.contactInfo;
    if (user.doctor?.contactInfo) return user.doctor.contactInfo;
    if (user.pharmacy?.contactInfo) return user.pharmacy.contactInfo;
    return null;
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      patient: "Patient",
      doctor: "Doctor",
      pharmacy: "Pharmacy",
      pending_doctor: "Pending Doctor",
      pending_pharmacy: "Pending Pharmacy",
      admin: "Admin",
    };
    return roleMap[role] || role;
  };

  const contactInfo = getContactInfo();

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            User Details
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <StatusPill
                  status={user.isActive ? "active" : "inactive"}
                  text={getRoleDisplayName(user.role)}
                />
                {user.emailVerified && (
                  <StatusPill
                    status="verified"
                    text="Email Verified"
                    size="sm"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {contactInfo && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contactInfo.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {contactInfo.phone}
                    </span>
                  </div>
                )}
                {contactInfo.whatsapp && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      WhatsApp: {contactInfo.whatsapp}
                    </span>
                  </div>
                )}
                {contactInfo.telegram && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Telegram: {contactInfo.telegram}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Personal Information
              </h4>
              <div className="space-y-2">
                {user.gender && (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Gender: {user.gender}
                    </span>
                  </div>
                )}
                {user.dob && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Date of Birth: {formatDate(user.dob)}
                    </span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Address: {user.address.city}, {user.address.country}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Account Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Joined: {formatDate(user.createdAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Auth Provider: {user.authProvider}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role-specific Information */}
          {user.patient && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
                Patient Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.patient.bloodType && (
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    Blood Type: {user.patient.bloodType}
                  </div>
                )}
                {user.patient.emergencyContact && (
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    Emergency Contact: {user.patient.emergencyContact.name} -{" "}
                    {user.patient.emergencyContact.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          {user.doctor && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-3">
                Doctor Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.doctor.licenseNumber && (
                  <div className="text-sm text-green-800 dark:text-green-200">
                    License: {user.doctor.licenseNumber}
                  </div>
                )}
                {user.doctor.experience && (
                  <div className="text-sm text-green-800 dark:text-green-200">
                    Experience: {user.doctor.experience} years
                  </div>
                )}
                {user.doctor.bio && (
                  <div className="text-sm text-green-800 dark:text-green-200">
                    Bio: {user.doctor.bio}
                  </div>
                )}
              </div>
            </div>
          )}

          {user.pharmacy && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-3">
                Pharmacy Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.pharmacy.name && (
                  <div className="text-sm text-purple-800 dark:text-purple-200">
                    Pharmacy Name: {user.pharmacy.name}
                  </div>
                )}
                {user.pharmacy.licenseNumber && (
                  <div className="text-sm text-purple-800 dark:text-purple-200">
                    License: {user.pharmacy.licenseNumber}
                  </div>
                )}
                {user.pharmacy.description && (
                  <div className="text-sm text-purple-800 dark:text-purple-200">
                    Description: {user.pharmacy.description}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default UserDetailsModal;
