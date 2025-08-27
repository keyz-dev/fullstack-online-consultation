const { Notification, User, Patient, Doctor } = require("../db/models");
const logger = require("../utils/logger");

class AppointmentNotificationService {
  /**
   * Create notification and emit real-time update
   */
  async createNotification(
    userId,
    type,
    title,
    message,
    priority = "medium",
    data = {}
  ) {
    try {
      const notification = await Notification.create({
        user_id: userId,
        type,
        title,
        message,
        priority,
        data: {
          ...data,
          category: "appointments",
        },
      });

      // Emit real-time notification
      if (global.io) {
        global.io.to(`user-${userId}`).emit("notification:new", {
          notification: {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            priority: notification.priority,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
            data: notification.data,
          },
        });
      }

      logger.info(`Notification created for user ${userId}: ${type}`);
      return notification;
    } catch (error) {
      logger.error("Error creating notification:", error);
      return null;
    }
  }

  /**
   * Notify patient about appointment creation
   */
  async notifyAppointmentCreated(appointment, patient) {
    const title = "Appointment Created";
    const message =
      "Your appointment has been created successfully. Please complete payment to confirm your booking.";

    await this.createNotification(
      patient.userId,
      "appointment_created",
      title,
      message,
      "medium",
      {
        appointmentId: appointment.id,
        appointmentStatus: appointment.status,
        consultationType: appointment.consultationType,
      }
    );
  }

  /**
   * Notify patient about payment initiation
   */
  async notifyPaymentInitiated(appointment, patient, paymentReference) {
    const title = "Payment Initiated";
    const message =
      "Payment has been initiated for your appointment. Please check your phone and complete the payment.";

    await this.createNotification(
      patient.userId,
      "payment_initiated",
      title,
      message,
      "high",
      {
        appointmentId: appointment.id,
        paymentReference,
        amount: appointment.timeSlot.availability.consultationFee,
      }
    );

    // Emit real-time payment status
    if (global.io) {
      global.io.to(`payment-${paymentReference}`).emit("payment-initiated", {
        reference: paymentReference,
        appointmentId: appointment.id,
        amount: appointment.timeSlot.availability.consultationFee,
        message: "Payment request sent. Please check your phone.",
        timestamp: new Date(),
      });
    }
  }

  /**
   * Notify about payment status update
   */
  async notifyPaymentStatusUpdate(appointment, patient, payment, status) {
    let title, message, notificationType, priority;

    switch (status) {
      case "SUCCESSFUL":
        title = "Payment Successful";
        message =
          "Your payment has been completed successfully! Your appointment is now confirmed.";
        notificationType = "payment_successful";
        priority = "high";
        break;
      case "FAILED":
        title = "Payment Failed";
        message = "Your payment failed. Please try again or contact support.";
        notificationType = "payment_failed";
        priority = "high";
        break;
      case "CANCELLED":
        title = "Payment Cancelled";
        message =
          "Your payment was cancelled. Please try again to confirm your appointment.";
        notificationType = "payment_failed";
        priority = "medium";
        break;
      default:
        title = "Payment Update";
        message = "Your payment status has been updated.";
        notificationType = "payment_update";
        priority = "medium";
    }

    await this.createNotification(
      patient.userId,
      notificationType,
      title,
      message,
      priority,
      {
        appointmentId: appointment.id,
        paymentReference: payment.transactionId,
        paymentStatus: status,
        amount: payment.amount,
      }
    );

    // Emit real-time payment status update
    if (global.io) {
      global.io
        .to(`payment-${payment.transactionId}`)
        .emit("payment-status-update", {
          reference: payment.transactionId,
          status: status,
          appointmentId: appointment.id,
          message: message,
          timestamp: new Date(),
        });
    }
  }

  /**
   * Notify doctor about new appointment
   */
  async notifyDoctorNewAppointment(appointment, doctor, patient) {
    const title = "New Appointment";
    const message = `You have a new appointment with ${patient.user.name} on ${appointment.timeSlot.date} at ${appointment.timeSlot.startTime}.`;

    await this.createNotification(
      doctor.userId,
      "new_appointment",
      title,
      message,
      "high",
      {
        appointmentId: appointment.id,
        patientName: patient.user.name,
        appointmentDate: appointment.timeSlot.date,
        appointmentTime: appointment.timeSlot.startTime,
        consultationType: appointment.consultationType,
        amount: appointment.timeSlot.availability.consultationFee,
      }
    );

    // Emit real-time notification to doctor
    if (global.io) {
      global.io.to(`doctor-${doctor.id}`).emit("new-appointment", {
        appointmentId: appointment.id,
        patientName: patient.user.name,
        patientId: patient.id,
        appointmentDate: appointment.timeSlot.date,
        appointmentTime: appointment.timeSlot.startTime,
        consultationType: appointment.consultationType,
        amount: appointment.timeSlot.availability.consultationFee,
        timestamp: new Date(),
      });
    }
  }
}

module.exports = new AppointmentNotificationService();
