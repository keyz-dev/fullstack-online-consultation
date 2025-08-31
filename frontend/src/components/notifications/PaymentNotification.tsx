import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PaymentStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED';

interface PaymentNotificationProps {
  isVisible: boolean;
  status: PaymentStatus;
  message: string;
  reference: string;
  appointmentInfo?: {
    doctorName: string;
    appointmentTime: string;
    amount: number;
  };
  onRetry?: () => void;
  onClose: () => void;
}

export const PaymentNotification: React.FC<PaymentNotificationProps> = ({
  isVisible,
  status,
  message,
  reference,
  appointmentInfo,
  onRetry,
  onClose,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'SUCCESSFUL':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          bgColor: 'from-green-500 to-green-600',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          title: 'Payment Successful',
        };
      case 'FAILED':
        return {
          icon: <XCircle className="w-6 h-6 text-red-500" />,
          bgColor: 'from-red-500 to-red-600',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          title: 'Payment Failed',
        };
      case 'CANCELLED':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
          bgColor: 'from-orange-500 to-orange-600',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          title: 'Payment Cancelled',
        };
      case 'PENDING':
      default:
        return {
          icon: <Clock className="w-6 h-6 text-blue-500 animate-spin" />,
          bgColor: 'from-blue-500 to-blue-600',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          title: 'Payment Processing',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${config.bgColor} p-4 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <div className="relative flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm">{config.title}</h3>
                  <p className="text-white/80 text-xs">Reference: {reference}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                {message}
              </p>

              {/* Appointment Info */}
              {appointmentInfo && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Appointment Details
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Doctor: {appointmentInfo.doctorName}</p>
                    <p>Time: {appointmentInfo.appointmentTime}</p>
                    <p>Amount: {appointmentInfo.amount} XAF</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {status === 'FAILED' && onRetry && (
                  <button
                    onClick={onRetry}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  {status === 'SUCCESSFUL' ? 'Continue' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
