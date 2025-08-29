require("dotenv").config();
const nodemailer = require("nodemailer");
const logger = require("../utils/logger");
const handlebars = require("handlebars");
const fs = require("fs").promises;
const path = require("path");

// Register Handlebars helpers
handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

handlebars.registerHelper("ne", function (a, b) {
  return a !== b;
});

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true" ? true : false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  /**
   * Load and compile a Handlebars template
   * @param {string} templateName - Name of the template file (without extension)
   * @param {Object} data - Data to inject into the template
   * @returns {Promise<string>} - Compiled HTML
   */

  async compileTemplate(templateName, data) {
    try {
      const templatePath = path.join(
        __dirname,
        "../email_templates/",
        `${templateName}.hbs`
      );
      const template = await fs.readFile(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(template);
      return compiledTemplate(data);
    } catch (error) {
      logger.error("Error compiling email template", { error, templateName });
      throw new Error(`Failed to compile email template: ${templateName}`);
    }
  }

  async sendEmail({ to, subject, template, data, html, text }) {
    try {
      let finalHtml = html;

      // If template is provided, compile it
      if (template) {
        finalHtml = await this.compileTemplate(template, data || {});
      }

      const mailOptions = {
        from: `"DrogCine Team" <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        text,
        html: finalHtml,
      };

      // Add logo attachment for all notification emails
      if (template && template.includes("notification")) {
        mailOptions.attachments = [
          {
            filename: "logo.png",
            path: require("path").join(
              __dirname,
              "../email_templates/assets/logo.png"
            ),
            cid: "logo",
          },
        ];
      }

      const info = await this.transporter.sendMail(mailOptions);

      logger.info("Email sent successfully", { messageId: info.messageId });
      return info;
    } catch (error) {
      logger.error("Error sending email", { error });
      throw error;
    }
  }

  // Email templates
  async sendWelcomeEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: "Welcome to DrogCine!",
      html: `
        <h1>Welcome to DrogCine, ${user.firstName}!</h1>
        <p>Thank you for registering with us. We're excited to have you on board.</p>
      `,
    });
  }

  async sendVerificationEmail(user, verificationCode) {
    return this.sendEmail({
      to: user.email,
      subject: "Verify your email",
      template: "emailVerification",
      data: {
        name: user.fullName,
        verificationCode,
      },
    });
  }

  // ==================== NOTIFICATION EMAILS ====================

  // Application submission notification email
  async sendApplicationSubmittedEmail(application, user) {
    return this.sendEmail({
      to: user.email,
      subject: "Application Submitted Successfully - DrogCine",
      template: "notificationApplicationSubmitted",
      data: {
        userName: user.name,
        applicationId: application.id,
        applicationType: application.applicationType,
        submissionDate: new Date(application.createdAt).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
        dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
      },
    });
  }

  // Application approval notification email
  async sendApplicationApprovedEmail(application, user, adminRemarks = null) {
    return this.sendEmail({
      to: user.email,
      subject: "🎉 Application Approved - DrogCine",
      template: "notificationApplicationApproved",
      data: {
        userName: user.name,
        applicationId: application.id,
        applicationType: application.applicationType,
        approvalDate: new Date(application.approvedAt).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
        adminRemarks: adminRemarks,
        dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
      },
    });
  }

  // Appointment reminder emails
  async sendAppointmentReminder(
    email,
    appointmentData,
    template = "appointment-reminder"
  ) {
    const {
      recipientName,
      doctorName,
      patientName,
      appointmentDate,
      appointmentTime,
      consultationType,
      reminderType,
    } = appointmentData;

    let subject = "";
    let templateData = {
      recipientName,
      doctorName,
      patientName,
      appointmentDate: new Date(appointmentDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      appointmentTime: new Date(
        `2000-01-01T${appointmentTime}`
      ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      consultationType:
        consultationType === "online"
          ? "Online Consultation"
          : "In-Person Visit",
      dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
      joinUrl:
        consultationType === "online"
          ? `${process.env.FRONTEND_URL}/consultation/join`
          : null,
    };

    switch (reminderType) {
      case "day_before":
        subject = `Appointment Reminder - Tomorrow at ${templateData.appointmentTime}`;
        break;
      case "2_hours":
        subject = `Appointment in 2 Hours - ${templateData.appointmentTime}`;
        break;
      case "30_minutes":
        subject = `Your appointment starts in 30 minutes`;
        break;
      case "now":
        subject = `Your appointment is starting now`;
        break;
      default:
        subject = `Appointment Reminder - ${templateData.appointmentDate}`;
    }

    return this.sendEmail({
      to: email,
      subject: subject + " - DrogCine",
      template,
      data: {
        ...templateData,
        reminderType,
        isUrgent: reminderType === "30_minutes" || reminderType === "now",
      },
    });
  }

  // Application rejection notification email
  async sendApplicationRejectedEmail(
    application,
    user,
    rejectionReason,
    adminRemarks = null
  ) {
    return this.sendEmail({
      to: user.email,
      subject: "Application Status Update - DrogCine",
      template: "notificationApplicationRejected",
      data: {
        userName: user.name,
        applicationId: application.id,
        applicationType: application.applicationType,
        reviewDate: new Date(application.rejectedAt).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
        rejectionReason: rejectionReason,
        adminRemarks: adminRemarks,
        applicationUrl: `${process.env.FRONTEND_URL}/application-status`,
      },
    });
  }
}

module.exports = new EmailService();
