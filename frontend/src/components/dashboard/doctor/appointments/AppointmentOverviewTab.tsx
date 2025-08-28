import React from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  User,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { DoctorAppointment } from "@/api/appointments";
import { formatCurrency } from "@/utils/formatters";

interface AppointmentOverviewTabProps {
  appointment: DoctorAppointment;
}

const AppointmentOverviewTab: React.FC<AppointmentOverviewTabProps> = ({
  appointment,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, MMMM dd, yyyy");
  };

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), "hh:mm a");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return "text-blue-600 dark:text-blue-400";
      case "in_progress":
        return "text-green-600 dark:text-green-400";
      case "completed":
        return "text-purple-600 dark:text-purple-400";
      case "cancelled":
        return "text-red-600 dark:text-red-400";
      case "no_show":
        return "text-orange-600 dark:text-orange-400";
      case "pending_payment":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5" />;
      case "in_progress":
        return <ClockIcon className="w-5 h-5" />;
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      case "no_show":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  const getConsultationTypeIcon = (type: string) => {
    return type === "online" ? (
      <Video className="w-5 h-5" />
    ) : (
      <MapPin className="w-5 h-5" />
    );
  };

  return (
    <div className="space-y-8">
      {/* Appointment Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
          Appointment Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              Status & Type
            </h5>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(appointment.status)}
                <span
                  className={`font-medium ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getConsultationTypeIcon(appointment.consultationType)}
                <span className="text-sm text-gray-900 dark:text-white">
                  {appointment.consultationType === "online"
                    ? "Online Consultation"
                    : "In-Person Consultation"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              Schedule
            </h5>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDate(appointment.timeSlot.date)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatTime(appointment.timeSlot.startTime)} -{" "}
                  {formatTime(appointment.timeSlot.endTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User size={20} className="text-green-600 dark:text-green-400" />
          Patient Information
        </h4>
        <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <User size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                {appointment.patient?.user.name}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Patient ID: {appointment.patient?.id}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Age: {appointment.patient?.age || "Not specified"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Gender: {appointment.patient?.gender || "Not specified"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign
            size={20}
            className="text-purple-600 dark:text-purple-400"
          />
          Financial Information
        </h4>
        <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Consultation Fee
              </label>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(appointment.consultationFee)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Status
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {appointment.paymentStatus || "Pending"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageSquare
              size={20}
              className="text-orange-600 dark:text-orange-400"
            />
            Notes
          </h4>
          <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {appointment.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentOverviewTab;
