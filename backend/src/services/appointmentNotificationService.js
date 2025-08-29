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
    // Validate required parameters
    if (!userId) {
      logger.error("Cannot create notification: userId is required", {
        type,
        title,
        message,
      });
      return null;
    }

    if (!type || !title || !message) {
      logger.error(
        "Cannot create notification: type, title, and message are required",
        {
          userId,
          type,
          title,
          message,
        }
      );
      return null;
    }

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
        const notificationPayload = {
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
        };

        global.io
          .to(`user-${userId}`)
          .emit("notification:new", notificationPayload);

        logger.info(`Real-time notification emitted to user-${userId}`, {
          notificationId: notification.id,
          type: notification.type,
          title: notification.title,
          socketRoom: `user-${userId}`,
        });
      } else {
        logger.warn(
          `Socket.io not available - notification not sent in real-time`,
          {
            userId,
            notificationId: notification.id,
            type: notification.type,
          }
        );
      }

      logger.info(`Notification created for user ${userId}: ${type}`);
      return notification;
    } catch (error) {
      logger.error("Error creating notification:", error.message || error);

      // Log validation errors in detail
      if (error.name === "SequelizeValidationError") {
        logger.error("Validation errors:", {
          errors: error.errors?.map((e) => ({
            field: e.path,
            value: e.value,
            message: e.message,
            type: e.type,
          })),
          data: {
            user_id: userId,
            type,
            title,
            message,
            priority,
            data,
          },
        });
      }

      return null;
    }
  }

  /**
   * Notify patient about appointment creation
   */
  async notifyAppointmentCreated(appointment, patient) {
    // Validate that we have the required patient data
    if (!patient || !patient.userId) {
      logger.error(
        "Cannot create notification: Missing patient or patient.userId",
        {
          patient: patient
            ? { id: patient.id, hasUserId: !!patient.userId }
            : null,
          appointmentId: appointment?.id,
        }
      );
      return;
    }

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
    // Validate that we have the required patient data
    if (!patient || !patient.userId) {
      logger.error(
        "Cannot create payment notification: Missing patient or patient.userId",
        {
          patient: patient
            ? { id: patient.id, hasUserId: !!patient.userId }
            : null,
          appointmentId: appointment?.id,
        }
      );
      return;
    }

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
    // Validate that we have the required patient data
    if (!patient || !patient.userId) {
      logger.error(
        "Cannot create payment status notification: Missing patient or patient.userId",
        {
          patient: patient
            ? { id: patient.id, hasUserId: !!patient.userId }
            : null,
          appointmentId: appointment?.id,
        }
      );
      return;
    }

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

      // Emit payment confirmation to doctor
      if (status === "SUCCESSFUL" && appointment.doctorId) {
        global.io
          .to(`doctor-${appointment.doctorId}`)
          .emit("payment-confirmed", {
            appointmentId: appointment.id,
            patientName: patient.user.name,
            patientId: patient.id,
            amount: payment.amount,
            appointmentDate: appointment.timeSlot.date,
            appointmentTime: appointment.timeSlot.startTime,
            consultationType: appointment.consultationType,
            message: `Payment completed - Appointment confirmed`,
            timestamp: new Date(),
          });
      }
    }
  }

  /**
   * Notify doctor about new appointment
   */
  async notifyDoctorNewAppointment(appointment, doctor, patient) {
    // Enhanced logging for debugging
    logger.info("Attempting to notify doctor about new appointment", {
      appointmentId: appointment?.id,
      doctorData: doctor
        ? {
            id: doctor.id,
            userId: doctor.userId,
            hasUser: !!doctor.user,
            userFromUser: doctor.user?.id,
          }
        : null,
      patientData: patient
        ? {
            id: patient.id,
            userId: patient.userId,
            name: patient.user?.name || patient.name,
          }
        : null,
    });

    // Try to get userId from doctor.userId or doctor.user.id
    const doctorUserId = doctor?.userId || doctor?.user?.id;

    // Validate that we have the required doctor data
    if (!doctor || !doctorUserId) {
      logger.error(
        "Cannot create doctor notification: Missing doctor or doctor userId",
        {
          doctor: doctor
            ? {
                id: doctor.id,
                hasUserId: !!doctor.userId,
                hasUser: !!doctor.user,
                userFromUser: doctor.user?.id,
              }
            : null,
          appointmentId: appointment?.id,
        }
      );
      return;
    }

    const patientName = patient?.user?.name || patient?.name || "a patient";
    const title = "New Appointment Confirmed";
    const message = `You have a new confirmed appointment with ${patientName} on ${appointment.timeSlot.date} at ${appointment.timeSlot.startTime}.`;

    logger.info(`Creating notification for doctor userId: ${doctorUserId}`, {
      title,
      message,
      appointmentId: appointment.id,
    });

    const notification = await this.createNotification(
      doctorUserId,
      "appointment_confirmed",
      title,
      message,
      "high",
      {
        appointmentId: appointment.id,
        patientId: patient?.id,
        patientName: patientName,
        appointmentDate: appointment.timeSlot.date,
        appointmentTime: appointment.timeSlot.startTime,
        consultationType: appointment.consultationType,
      }
    );

    if (notification) {
      logger.info(`Doctor notification created successfully`, {
        notificationId: notification.id,
        doctorUserId,
        appointmentId: appointment.id,
      });
    } else {
      logger.error(`Failed to create doctor notification`, {
        doctorUserId,
        appointmentId: appointment.id,
      });
    }

    return notification;
  }
}

module.exports = new AppointmentNotificationService();
