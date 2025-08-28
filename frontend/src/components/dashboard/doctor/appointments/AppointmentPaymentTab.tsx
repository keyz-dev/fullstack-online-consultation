import React from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  DollarSign,
  CreditCard,
  CheckCircle,
  Clock,
  Calendar,
  Receipt,
} from "lucide-react";
import { DoctorAppointment } from "@/api/appointments";
import { formatAmount } from "@/utils/formatters";

interface AppointmentPaymentTabProps {
  appointment: DoctorAppointment;
}

const AppointmentPaymentTab: React.FC<AppointmentPaymentTabProps> = ({
  appointment,
}) => {
  if (!appointment.payment) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <AlertCircle
          size={64}
          className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
        />
        <p className="text-lg font-medium mb-2">
          No payment information available
        </p>
        <p className="text-sm">
          Payment details have not been recorded for this appointment.
        </p>
      </div>
    );
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "failed":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Payment Details */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign
            size={20}
            className="text-green-600 dark:text-green-400"
          />
          Payment Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              Transaction Information
            </h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount
                </label>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {appointment.payment.currency}{" "}
                  {formatAmount(appointment.payment.amount)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Payment Method
                </label>
                <p className="text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard size={16} />
                  {appointment.payment.paymentMethod}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  {getPaymentStatusIcon(appointment.payment.status)}
                  <span
                    className={`font-medium ${getPaymentStatusColor(
                      appointment.payment.status
                    )}`}
                  >
                    {appointment.payment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              Payment Timeline
            </h5>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Payment Date
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {format(
                      new Date(appointment.payment.createdAt),
                      "PPP 'at' p"
                    )}
                  </p>
                </div>
              </div>
              {appointment.payment.updatedAt &&
                appointment.payment.updatedAt !==
                  appointment.payment.createdAt && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Last Updated
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(
                          new Date(appointment.payment.updatedAt),
                          "PPP 'at' p"
                        )}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      {appointment.payment.transactionId && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Receipt size={20} className="text-blue-600 dark:text-blue-400" />
            Transaction Information
          </h4>
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transaction ID
                </label>
                <p className="text-sm font-mono text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded p-2">
                  {appointment.payment.transactionId}
                </p>
              </div>
              {appointment.payment.gateway && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Gateway
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {appointment.payment.gateway}
                  </p>
                </div>
              )}
              {appointment.payment.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {appointment.payment.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPaymentTab;
