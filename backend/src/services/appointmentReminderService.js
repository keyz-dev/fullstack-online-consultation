const cron = require("node-cron");
const {
  Appointment,
  User,
  Patient,
  Doctor,
  TimeSlot,
  Notification,
} = require("../db/models");
const emailService = require("./emailService");
const smsService = require("./smsService"); // We'll need to create this
const appointmentNotificationService = require("./appointmentNotificationService");
const logger = require("../utils/logger");
const { Op } = require("sequelize");

class AppointmentReminderService {
  constructor() {
    this.isRunning = false;
    this.scheduledJobs = new Map();
  }

  /**
   * Start the reminder service with cron jobs
   */
  start() {
    if (this.isRunning) {
      logger.warn("Appointment reminder service is already running");
      return;
    }

    this.isRunning = true;
    logger.info("Starting appointment reminder service...");

    // Run every 2 minutes to check for upcoming appointments (development)
    this.scheduledJobs.set(
      "reminder-check",
      cron.schedule("*/2 * * * *", () => {
        this.checkAndSendReminders();
      })
    );

    // Run daily at 8 AM to send day-ahead reminders
    this.scheduledJobs.set(
      "daily-reminders",
      cron.schedule("0 8 * * *", () => {
        this.sendDayAheadReminders();
      })
    );

    // Run every hour to send 2-4 hour reminders
    this.scheduledJobs.set(
      "hourly-reminders",
      cron.schedule("0 * * * *", () => {
        this.sendHourlyReminders();
      })
    );

    logger.info("Appointment reminder service started successfully");
  }

  /**
   * Stop the reminder service
   */
  stop() {
    if (!this.isRunning) return;

    this.scheduledJobs.forEach((job, name) => {
      job.destroy();
      logger.info(`Stopped ${name} job`);
    });

    this.scheduledJobs.clear();
    this.isRunning = false;
    logger.info("Appointment reminder service stopped");
  }

  /**
   * Check and send all types of reminders
   */
  async checkAndSendReminders() {
    try {
      logger.info("Checking for appointments needing reminders...");

      const now = new Date();
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const next4Hours = new Date(now.getTime() + 4 * 60 * 60 * 1000);
      const next30Minutes = new Date(now.getTime() + 30 * 60 * 1000);

      // Get appointments that need reminders
      const appointments = await this.getAppointmentsForReminders(
        now,
        next24Hours
      );

      for (const appointment of appointments) {
        const appointmentDateTime = new Date(
          `${appointment.timeSlot.date}T${appointment.timeSlot.startTime}`
        );
        const timeUntilAppointment =
          appointmentDateTime.getTime() - now.getTime();
        const hoursUntil = timeUntilAppointment / (1000 * 60 * 60);
        const minutesUntil = timeUntilAppointment / (1000 * 60);

        // Send appropriate reminder based on time remaining (development intervals)
        if (minutesUntil <= 1 && minutesUntil > -5) {
          // 0 minutes - appointment starting now
          await this.sendAppointmentStartReminder(appointment);
        } else if (minutesUntil <= 5 && minutesUntil > 1) {
          // 5 minutes before
          await this.send5MinuteReminder(appointment);
        } else if (minutesUntil <= 10 && minutesUntil > 5) {
          // 10 minutes before
          await this.send10MinuteReminder(appointment);
        } else if (minutesUntil <= 15 && minutesUntil > 10) {
          // 15 minutes before
          await this.send15MinuteReminder(appointment);
        } else if (minutesUntil <= 30 && minutesUntil > 15) {
          // 30 minutes before
          await this.send30MinuteReminder(appointment);
        } else if (hoursUntil <= 2 && hoursUntil > 1) {
          // 2 hours before
          await this.send2HourReminder(appointment);
        } else if (hoursUntil <= 4 && hoursUntil > 2) {
          // 4 hours before
          await this.send4HourReminder(appointment);
        } else if (hoursUntil <= 24 && hoursUntil > 12) {
          // 24 hours before
          await this.sendDayBeforeReminder(appointment);
        }
      }
    } catch (error) {
      logger.error("Error checking appointment reminders:", error);
    }
  }

  /**
   * Get appointments that need reminders
   */
  async getAppointmentsForReminders(startTime, endTime) {
    return await Appointment.findAll({
      where: {
        status: ["confirmed", "paid"],
        "$timeSlot.date$": {
          [Op.between]: [
            startTime.toISOString().split("T")[0],
            endTime.toISOString().split("T")[0],
          ],
        },
      },
      include: [
        {
          model: TimeSlot,
          as: "timeSlot",
          required: true,
        },
        {
          model: Patient,
          as: "patient",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "phoneNumber"],
            },
          ],
        },
        {
          model: Doctor,
          as: "doctor",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "phoneNumber"],
            },
          ],
        },
      ],
    });
  }

  /**
   * Send 24-hour advance reminder
   */
  async sendDayBeforeReminder(appointment) {
    const reminderKey = `day-before-${appointment.id}`;

    // Check if reminder already sent
    if (await this.wasReminderSent(appointment.id, "day_before")) {
      return;
    }

    logger.info(
      `Sending day-before reminder for appointment ${appointment.id}`
    );

    const appointmentDate = new Date(
      appointment.timeSlot.date
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const appointmentTime = new Date(
      `2000-01-01T${appointment.timeSlot.startTime}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Send to patient
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.patient.user,
      recipientType: "patient",
      reminderType: "day_before",
      subject: "Appointment Reminder - Tomorrow",
      message: `Hi ${appointment.patient.user.name}, you have an appointment with Dr. ${appointment.doctor.user.name} tomorrow (${appointmentDate}) at ${appointmentTime}.`,
      emailTemplate: "appointment-reminder-day-before",
      smsMessage: `Reminder: You have an appointment with Dr. ${appointment.doctor.user.name} tomorrow at ${appointmentTime}. Please confirm or reschedule if needed.`,
    });

    // Send to doctor
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.doctor.user,
      recipientType: "doctor",
      reminderType: "day_before",
      subject: "Tomorrow's Appointment Schedule",
      message: `You have an appointment with ${appointment.patient.user.name} tomorrow (${appointmentDate}) at ${appointmentTime}.`,
      emailTemplate: "doctor-appointment-reminder-day-before",
      smsMessage: `Tomorrow's schedule: ${appointmentTime} - ${appointment.patient.user.name} (${appointment.consultationType})`,
    });

    // Mark reminder as sent
    await this.markReminderSent(appointment.id, "day_before");
  }

  async send10MinuteReminder(appointment) {
    if (await this.wasReminderSent(appointment.id, "10_minutes")) {
      return;
    }
    logger.info(`Sending 10-minute reminder for appointment ${appointment.id}`);
    await this.markReminderSent(appointment.id, "10_minutes");
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.patient.user,
      recipientType: "patient",
      reminderType: "10_minutes",
      subject: "Your appointment is in 10 minutes",
    });
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.doctor.user,
      recipientType: "doctor",
      reminderType: "10_minutes",
    });
    await this.markReminderSent(appointment.id, "10_minutes");
  }

  async send5MinuteReminder(appointment) {
    if (await this.wasReminderSent(appointment.id, "5_minutes")) {
      return;
    }
  }

  async send0MinuteReminder(appointment) {
    if (await this.wasReminderSent(appointment.id, "0_minutes")) {
      return;
    }
  }

  /**
   * Send 30-minute reminder
   */
  async send30MinuteReminder(appointment) {
    if (await this.wasReminderSent(appointment.id, "30_minutes")) {
      return;
    }

    logger.info(`Sending 30-minute reminder for appointment ${appointment.id}`);

    const appointmentTime = new Date(
      `2000-01-01T${appointment.timeSlot.startTime}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Send to patient
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.patient.user,
      recipientType: "patient",
      reminderType: "30_minutes",
      subject: "Your appointment starts in 30 minutes",
      message: `Your appointment with Dr. ${appointment.doctor.user.name} starts in 30 minutes (${appointmentTime}).`,
      emailTemplate: "appointment-reminder-30-minutes",
      smsMessage: `Your appointment with Dr. ${appointment.doctor.user.name} starts in 30 minutes. ${appointment.consultationType === "online" ? "Please log in to the platform." : "Please head to the clinic."}`,
    });

    // Send to doctor
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.doctor.user,
      recipientType: "doctor",
      reminderType: "30_minutes",
      subject: "Appointment starting in 30 minutes",
      message: `Your appointment with ${appointment.patient.user.name} starts in 30 minutes (${appointmentTime}).`,
      emailTemplate: "doctor-appointment-reminder-30-minutes",
      smsMessage: `Upcoming: ${appointmentTime} - ${appointment.patient.user.name} (${appointment.consultationType})`,
    });

    await this.markReminderSent(appointment.id, "30_minutes");
  }

  /**
   * Send multi-channel reminder
   */
  async sendMultiChannelReminder({
    appointment,
    recipient,
    recipientType,
    reminderType,
    subject,
    message,
    emailTemplate,
    smsMessage,
  }) {
    const promises = [];

    // 1. In-app notification
    promises.push(
      appointmentNotificationService.createNotification(
        recipient.id,
        "consultation_reminder",
        subject,
        message,
        "high",
        {
          appointmentId: appointment.id,
          reminderType,
          appointmentDate: appointment.timeSlot.date,
          appointmentTime: appointment.timeSlot.startTime,
        }
      )
    );

    // 2. Email notification
    if (recipient.email && emailService) {
      promises.push(
        emailService
          .sendAppointmentReminder(
            recipient.email,
            {
              recipientName: recipient.name,
              doctorName:
                recipientType === "patient"
                  ? appointment.doctor.user.name
                  : undefined,
              patientName:
                recipientType === "doctor"
                  ? appointment.patient.user.name
                  : undefined,
              appointmentDate: appointment.timeSlot.date,
              appointmentTime: appointment.timeSlot.startTime,
              consultationType: appointment.consultationType,
              reminderType,
            },
            emailTemplate
          )
          .catch((error) => {
            logger.error(
              `Failed to send email reminder to ${recipient.email}:`,
              error
            );
          })
      );
    }

    // 3. SMS notification
    if (recipient.phoneNumber && smsService) {
      promises.push(
        smsService.sendSMS(recipient.phoneNumber, smsMessage).catch((error) => {
          logger.error(
            `Failed to send SMS reminder to ${recipient.phoneNumber}:`,
            error
          );
        })
      );
    }

    // Execute all notifications
    await Promise.allSettled(promises);

    logger.info(
      `Multi-channel reminder sent for appointment ${appointment.id} to ${recipient.name}`
    );
  }

  /**
   * Check if reminder was already sent
   */
  async wasReminderSent(appointmentId, reminderType) {
    const reminder = await Notification.findOne({
      where: {
        "data.appointmentId": appointmentId,
        "data.reminderType": reminderType,
        type: "consultation_reminder",
      },
    });

    return !!reminder;
  }

  /**
   * Mark reminder as sent
   */
  async markReminderSent(appointmentId, reminderType) {
    // This could be stored in a separate ReminderLog table
    // For now, we're using the notification creation as the marker
    logger.info(
      `Marked ${reminderType} reminder as sent for appointment ${appointmentId}`
    );
  }

  /**
   * Send immediate appointment start notification
   */
  async sendAppointmentStartNotification(appointment) {
    logger.info(
      `Sending appointment start notification for appointment ${appointment.id}`
    );

    // Notify patient
    await appointmentNotificationService.createNotification(
      appointment.patient.user.id,
      "consultation_confirmation",
      "Your appointment is starting now",
      `Your appointment with Dr. ${appointment.doctor.user.name} is ready to begin.`,
      "urgent",
      {
        appointmentId: appointment.id,
        action: "join_consultation",
      }
    );

    // Notify doctor
    await appointmentNotificationService.createNotification(
      appointment.doctor.user.id,
      "consultation_confirmation",
      "Appointment ready to start",
      `Your appointment with ${appointment.patient.user.name} is ready to begin.`,
      "urgent",
      {
        appointmentId: appointment.id,
        action: "start_consultation",
      }
    );
  }

  /**
   * Send day-ahead reminders (runs daily at 8 AM)
   */
  async sendDayAheadReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await this.getAppointmentsForDate(tomorrow);

    logger.info(`Found ${appointments.length} appointments for tomorrow`);

    for (const appointment of appointments) {
      await this.sendDayBeforeReminder(appointment);
    }
  }

  /**
   * Send hourly reminders (2-4 hour window)
   */
  async sendHourlyReminders() {
    const now = new Date();
    const next4Hours = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    const appointments = await this.getAppointmentsForReminders(
      now,
      next4Hours
    );

    for (const appointment of appointments) {
      const appointmentDateTime = new Date(
        `${appointment.timeSlot.date}T${appointment.timeSlot.startTime}`
      );
      const hoursUntil =
        (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntil <= 2 && hoursUntil > 1) {
        await this.send2HourReminder(appointment);
      }
    }
  }

  /**
   * Get appointments for a specific date
   */
  async getAppointmentsForDate(date) {
    const dateString = date.toISOString().split("T")[0];

    return await Appointment.findAll({
      where: {
        status: ["confirmed", "paid"],
        "$timeSlot.date$": dateString,
      },
      include: [
        {
          model: TimeSlot,
          as: "timeSlot",
          required: true,
        },
        {
          model: Patient,
          as: "patient",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "phoneNumber"],
            },
          ],
        },
        {
          model: Doctor,
          as: "doctor",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "phoneNumber"],
            },
          ],
        },
      ],
    });
  }

  /**
   * Send 15-minute reminder
   */
  async send15MinuteReminder(appointment) {
    if (await this.wasReminderSent(appointment.id, "15_minutes")) {
      return;
    }

    logger.info(`Sending 15-minute reminder for appointment ${appointment.id}`);

    const appointmentTime = new Date(
      `2000-01-01T${appointment.timeSlot.startTime}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Send to patient
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.patient.user,
      recipientType: "patient",
      reminderType: "15_minutes",
      subject: "Appointment in 15 minutes",
      message: `Your appointment with Dr. ${appointment.doctor.user.name} starts in 15 minutes (${appointmentTime}).`,
      emailTemplate: "appointment-reminder-15-minutes",
      smsMessage: `Your appointment with Dr. ${appointment.doctor.user.name} starts in 15 minutes (${appointmentTime}).`,
    });

    // Send to doctor
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.doctor.user,
      recipientType: "doctor",
      reminderType: "15_minutes",
      subject: "Patient arriving in 15 minutes",
      message: `Your patient ${appointment.patient.user.name} has an appointment in 15 minutes (${appointmentTime}).`,
      emailTemplate: "doctor-appointment-reminder-15-minutes",
      smsMessage: `Patient arriving in 15 minutes: ${appointmentTime} - ${appointment.patient.user.name}`,
    });

    await this.markReminderSent(appointment.id, "15_minutes");
  }

  /**
   * Send 10-minute reminder
   */
  async send10MinuteReminder(appointment) {
    if (await this.wasReminderSent(appointment.id, "10_minutes")) {
      return;
    }

    logger.info(`Sending 10-minute reminder for appointment ${appointment.id}`);

    const appointmentTime = new Date(
      `2000-01-01T${appointment.timeSlot.startTime}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Send to patient
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.patient.user,
      recipientType: "patient",
      reminderType: "10_minutes",
      subject: "Appointment in 10 minutes - Final preparation",
      message: `Your appointment with Dr. ${appointment.doctor.user.name} starts in 10 minutes (${appointmentTime}). Please prepare to ${appointment.consultationType === "online" ? "join online" : "arrive at clinic"}.`,
      emailTemplate: "appointment-reminder-10-minutes",
      smsMessage: `FINAL REMINDER: Your appointment starts in 10 minutes (${appointmentTime}). ${appointment.consultationType === "online" ? "Join now!" : "Head to clinic now!"}`,
    });

    // Send to doctor
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.doctor.user,
      recipientType: "doctor",
      reminderType: "10_minutes",
      subject: "Patient consultation in 10 minutes",
      message: `Final reminder: Your consultation with ${appointment.patient.user.name} starts in 10 minutes (${appointmentTime}).`,
      emailTemplate: "doctor-appointment-reminder-10-minutes",
      smsMessage: `Final prep: ${appointmentTime} - ${appointment.patient.user.name} in 10 minutes`,
    });

    await this.markReminderSent(appointment.id, "10_minutes");
  }

  /**
   * Send 5-minute reminder
   */
  async send5MinuteReminder(appointment) {
    if (await this.wasReminderSent(appointment.id, "5_minutes")) {
      return;
    }

    logger.info(`Sending 5-minute reminder for appointment ${appointment.id}`);

    const appointmentTime = new Date(
      `2000-01-01T${appointment.timeSlot.startTime}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Send to patient
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.patient.user,
      recipientType: "patient",
      reminderType: "5_minutes",
      subject: "🚨 Appointment starting in 5 minutes!",
      message: `URGENT: Your appointment with Dr. ${appointment.doctor.user.name} starts in 5 minutes (${appointmentTime})!`,
      emailTemplate: "appointment-reminder-5-minutes",
      smsMessage: `🚨 URGENT: Your appointment starts in 5 minutes! ${appointment.consultationType === "online" ? "JOIN NOW!" : "ARRIVE NOW!"}`,
    });

    // Send to doctor
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.doctor.user,
      recipientType: "doctor",
      reminderType: "5_minutes",
      subject: "🩺 Patient consultation starting in 5 minutes",
      message: `URGENT: Your consultation with ${appointment.patient.user.name} starts in 5 minutes (${appointmentTime}).`,
      emailTemplate: "doctor-appointment-reminder-5-minutes",
      smsMessage: `🩺 URGENT: ${appointmentTime} - ${appointment.patient.user.name} in 5 minutes!`,
    });

    await this.markReminderSent(appointment.id, "5_minutes");
  }

  /**
   * Send appointment start reminder (0 minutes)
   */
  async sendAppointmentStartReminder(appointment) {
    if (await this.wasReminderSent(appointment.id, "start_now")) {
      return;
    }

    logger.info(
      `Sending appointment start reminder for appointment ${appointment.id}`
    );

    const appointmentTime = new Date(
      `2000-01-01T${appointment.timeSlot.startTime}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Send to patient
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.patient.user,
      recipientType: "patient",
      reminderType: "start_now",
      subject: "🔴 Your appointment is starting NOW!",
      message: `Your appointment with Dr. ${appointment.doctor.user.name} is starting now (${appointmentTime})!`,
      emailTemplate: "appointment-reminder-start-now",
      smsMessage: `🔴 YOUR APPOINTMENT IS STARTING NOW! ${appointment.consultationType === "online" ? "JOIN CONSULTATION IMMEDIATELY!" : "CHECK IN AT RECEPTION NOW!"}`,
    });

    // Send to doctor
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.doctor.user,
      recipientType: "doctor",
      reminderType: "start_now",
      subject: "🩺 Consultation starting NOW",
      message: `Your consultation with ${appointment.patient.user.name} is starting now (${appointmentTime}).`,
      emailTemplate: "doctor-appointment-reminder-start-now",
      smsMessage: `🩺 START NOW: ${appointmentTime} - ${appointment.patient.user.name}`,
    });

    await this.markReminderSent(appointment.id, "start_now");
  }

  /**
   * Send 2-hour reminder
   */
  async send2HourReminder(appointment) {
    if (await this.wasReminderSent(appointment.id, "2_hours")) {
      return;
    }

    logger.info(`Sending 2-hour reminder for appointment ${appointment.id}`);

    const appointmentTime = new Date(
      `2000-01-01T${appointment.timeSlot.startTime}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Send to patient
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.patient.user,
      recipientType: "patient",
      reminderType: "2_hours",
      subject: "Appointment in 2 hours",
      message: `Your appointment with Dr. ${appointment.doctor.user.name} is in 2 hours (${appointmentTime}).`,
      emailTemplate: "appointment-reminder-2-hours",
      smsMessage: `Your appointment with Dr. ${appointment.doctor.user.name} is in 2 hours (${appointmentTime}).`,
    });

    // Send to doctor
    await this.sendMultiChannelReminder({
      appointment,
      recipient: appointment.doctor.user,
      recipientType: "doctor",
      reminderType: "2_hours",
      subject: "Appointment in 2 hours",
      message: `Your appointment with ${appointment.patient.user.name} is in 2 hours (${appointmentTime}).`,
      emailTemplate: "doctor-appointment-reminder-2-hours",
      smsMessage: `Appointment in 2 hours: ${appointmentTime} - ${appointment.patient.user.name}`,
    });

    await this.markReminderSent(appointment.id, "2_hours");
  }
}

module.exports = new AppointmentReminderService();
