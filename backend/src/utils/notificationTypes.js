/**
 * Notification Types Constants
 *
 * This file defines all notification types used in the application.
 * Since we removed the ENUM constraint, this helps maintain consistency
 * and provides autocomplete/intellisense support.
 */

// Appointment-related notifications
const APPOINTMENT_TYPES = {
  APPOINTMENT_CREATED: "appointment_created",
  APPOINTMENT_RESCHEDULED: "appointment_rescheduled",
  APPOINTMENT_CANCELLED: "appointment_cancelled",
  APPOINTMENT_REMINDER: "appointment_reminder",
  APPOINTMENT_CONFIRMATION: "appointment_confirmation",
};

// Consultation-related notifications
const CONSULTATION_TYPES = {
  CONSULTATION_STARTED: "consultation_started",
  CONSULTATION_COMPLETED: "consultation_completed",
  CONSULTATION_CANCELLED: "consultation_cancelled",
  CONSULTATION_REMINDER: "consultation_reminder",
  CONSULTATION_CONFIRMATION: "consultation_confirmation",
};

// Video/Chat notifications
const COMMUNICATION_TYPES = {
  CHAT_MESSAGE_RECEIVED: "chat_message_received",
  VIDEO_CALL_INCOMING: "video_call_incoming",
  VIDEO_CALL_MISSED: "video_call_missed",
  VOICE_CALL_INCOMING: "voice_call_incoming",
  VOICE_CALL_MISSED: "voice_call_missed",
};

// Prescription notifications
const PRESCRIPTION_TYPES = {
  PRESCRIPTION_GENERATED: "prescription_generated",
  PRESCRIPTION_APPROVED: "prescription_approved",
  PRESCRIPTION_REJECTED: "prescription_rejected",
  PRESCRIPTION_READY: "prescription_ready",
  PRESCRIPTION_EXPIRED: "prescription_expired",
};

// Order management notifications
const ORDER_TYPES = {
  ORDER_PLACED: "order_placed",
  ORDER_CONFIRMED: "order_confirmed",
  ORDER_SHIPPED: "order_shipped",
  ORDER_DELIVERED: "order_delivered",
  ORDER_CANCELLED: "order_cancelled",
  ORDER_DISPUTED: "order_disputed",
};

// Payment notifications
const PAYMENT_TYPES = {
  PAYMENT_SUCCESSFUL: "payment_successful",
  PAYMENT_FAILED: "payment_failed",
  PAYMENT_PENDING: "payment_pending",
  PAYMENT_REFUNDED: "payment_refunded",
  PAYMENT_DISPUTED: "payment_disputed",
};

// Application notifications
const APPLICATION_TYPES = {
  APPLICATION_SUBMITTED: "application_submitted",
  APPLICATION_APPROVED: "application_approved",
  APPLICATION_REJECTED: "application_rejected",
  APPLICATION_UNDER_REVIEW: "application_under_review",
  APPLICATION_DOCUMENTS_REQUIRED: "application_documents_required",
};

// Health management notifications
const HEALTH_TYPES = {
  TEST_RESULTS_READY: "test_results_ready",
  MEDICATION_REMINDER: "medication_reminder",
  FOLLOW_UP_DUE: "follow_up_due",
  VACCINATION_REMINDER: "vaccination_reminder",
  HEALTH_CHECKUP_REMINDER: "health_checkup_reminder",
};

// Pharmacy notifications
const PHARMACY_TYPES = {
  PHARMACY_ORDER_READY: "pharmacy_order_ready",
  PHARMACY_ORDER_PICKUP: "pharmacy_order_pickup",
  PHARMACY_ORDER_DELIVERY: "pharmacy_order_delivery",
  PHARMACY_STOCK_ALERT: "pharmacy_stock_alert",
  PHARMACY_PROMOTION: "pharmacy_promotion",
};

// System notifications
const SYSTEM_TYPES = {
  SYSTEM_ANNOUNCEMENT: "system_announcement",
  SYSTEM_MAINTENANCE: "system_maintenance",
  SYSTEM_UPDATE: "system_update",
  SECURITY_ALERT: "security_alert",
  FEATURE_ANNOUNCEMENT: "feature_announcement",
  GENERAL: "general",
};

// Combine all types
const NOTIFICATION_TYPES = {
  ...APPOINTMENT_TYPES,
  ...CONSULTATION_TYPES,
  ...COMMUNICATION_TYPES,
  ...PRESCRIPTION_TYPES,
  ...ORDER_TYPES,
  ...PAYMENT_TYPES,
  ...APPLICATION_TYPES,
  ...HEALTH_TYPES,
  ...PHARMACY_TYPES,
  ...SYSTEM_TYPES,
};

// Priority levels
const PRIORITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

// Helper function to validate notification type
const isValidNotificationType = (type) => {
  return Object.values(NOTIFICATION_TYPES).includes(type);
};

// Helper function to get notification type category
const getNotificationCategory = (type) => {
  if (Object.values(APPOINTMENT_TYPES).includes(type)) return "appointment";
  if (Object.values(CONSULTATION_TYPES).includes(type)) return "consultation";
  if (Object.values(COMMUNICATION_TYPES).includes(type)) return "communication";
  if (Object.values(PRESCRIPTION_TYPES).includes(type)) return "prescription";
  if (Object.values(ORDER_TYPES).includes(type)) return "order";
  if (Object.values(PAYMENT_TYPES).includes(type)) return "payment";
  if (Object.values(APPLICATION_TYPES).includes(type)) return "application";
  if (Object.values(HEALTH_TYPES).includes(type)) return "health";
  if (Object.values(PHARMACY_TYPES).includes(type)) return "pharmacy";
  if (Object.values(SYSTEM_TYPES).includes(type)) return "system";
  return "other";
};

// Helper function to get default priority for notification type
const getDefaultPriority = (type) => {
  const urgentTypes = [
    NOTIFICATION_TYPES.VIDEO_CALL_INCOMING,
    NOTIFICATION_TYPES.VOICE_CALL_INCOMING,
    NOTIFICATION_TYPES.SECURITY_ALERT,
    NOTIFICATION_TYPES.PAYMENT_FAILED,
  ];

  const highPriorityTypes = [
    NOTIFICATION_TYPES.APPOINTMENT_CREATED,
    NOTIFICATION_TYPES.CONSULTATION_STARTED,
    NOTIFICATION_TYPES.PRESCRIPTION_GENERATED,
    NOTIFICATION_TYPES.ORDER_PLACED,
    NOTIFICATION_TYPES.APPLICATION_APPROVED,
    NOTIFICATION_TYPES.APPLICATION_REJECTED,
  ];

  if (urgentTypes.includes(type)) return PRIORITY_LEVELS.URGENT;
  if (highPriorityTypes.includes(type)) return PRIORITY_LEVELS.HIGH;
  return PRIORITY_LEVELS.MEDIUM;
};

module.exports = {
  NOTIFICATION_TYPES,
  PRIORITY_LEVELS,
  APPOINTMENT_TYPES,
  CONSULTATION_TYPES,
  COMMUNICATION_TYPES,
  PRESCRIPTION_TYPES,
  ORDER_TYPES,
  PAYMENT_TYPES,
  APPLICATION_TYPES,
  HEALTH_TYPES,
  PHARMACY_TYPES,
  SYSTEM_TYPES,
  isValidNotificationType,
  getNotificationCategory,
  getDefaultPriority,
};
