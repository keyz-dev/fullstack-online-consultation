const logger = require("../utils/logger");

// You can integrate with SMS providers like:
// - Twilio
// - AWS SNS
// - Africa's Talking (for African markets)
// - Vonage (formerly Nexmo)
// - MessageBird

class SMSService {
  constructor() {
    this.provider = process.env.SMS_PROVIDER || "twilio";
    this.apiKey = process.env.SMS_API_KEY;
    this.apiSecret = process.env.SMS_API_SECRET;
    this.fromNumber = process.env.SMS_FROM_NUMBER;

    if (process.env.NODE_ENV === "production" && !this.apiKey) {
      logger.warn(
        "SMS service not configured - SMS notifications will be disabled"
      );
    }
  }

  /**
   * Send SMS message
   */
  async sendSMS(phoneNumber, message) {
    try {
      // Format phone number (ensure it includes country code)
      const formattedNumber = this.formatPhoneNumber(phoneNumber);

      logger.info(
        `Sending SMS to ${formattedNumber}: ${message.substring(0, 50)}...`
      );

      // In development, just log the SMS
      if (process.env.NODE_ENV !== "production" || !this.apiKey) {
        logger.info(
          `📱 SMS (${this.provider}): ${formattedNumber} - ${message}`
        );
        return { success: true, messageId: `dev-${Date.now()}` };
      }

      // Choose provider implementation
      switch (this.provider) {
        case "twilio":
          return await this.sendViaTwilio(formattedNumber, message);
        case "aws-sns":
          return await this.sendViaAWSSNS(formattedNumber, message);
        case "africas-talking":
          return await this.sendViaAfricasTalking(formattedNumber, message);
        default:
          throw new Error(`Unsupported SMS provider: ${this.provider}`);
      }
    } catch (error) {
      logger.error("Failed to send SMS:", error);
      throw error;
    }
  }

  /**
   * Send appointment reminder SMS
   */
  async sendAppointmentReminder(phoneNumber, appointmentData) {
    const {
      doctorName,
      patientName,
      appointmentDate,
      appointmentTime,
      consultationType,
      reminderType,
    } = appointmentData;

    let message = "";

    switch (reminderType) {
      case "day_before":
        message = `Reminder: You have an appointment with Dr. ${doctorName} tomorrow at ${appointmentTime}. Please confirm or reschedule if needed. - DrogCine`;
        break;
      case "2_hours":
        message = `Your appointment with Dr. ${doctorName} is in 2 hours (${appointmentTime}). ${consultationType === "online" ? "Please prepare to join online." : "Please head to the clinic."} - DrogCine`;
        break;
      case "30_minutes":
        message = `Your appointment starts in 30 minutes! Dr. ${doctorName} at ${appointmentTime}. ${consultationType === "online" ? "Join now: [link]" : "Please arrive on time."} - DrogCine`;
        break;
      case "now":
        message = `Your appointment with Dr. ${doctorName} is starting now. ${consultationType === "online" ? "Join consultation: [link]" : "Please check in at reception."} - DrogCine`;
        break;
      default:
        message = `Appointment reminder: Dr. ${doctorName} on ${appointmentDate} at ${appointmentTime} - DrogCine`;
    }

    return await this.sendSMS(phoneNumber, message);
  }

  /**
   * Format phone number to international format
   */
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, "");

    // Add country code if missing (assuming Cameroon +237 as default)
    if (cleaned.length === 9 && !cleaned.startsWith("237")) {
      cleaned = "237" + cleaned;
    }

    // Add + prefix
    if (!cleaned.startsWith("+")) {
      cleaned = "+" + cleaned;
    }

    return cleaned;
  }

  /**
   * Send via Twilio
   */
  async sendViaTwilio(phoneNumber, message) {
    try {
      const twilio = require("twilio");
      const client = twilio(this.apiKey, this.apiSecret);

      const result = await client.messages.create({
        body: message,
        from: this.fromNumber,
        to: phoneNumber,
      });

      logger.info(`SMS sent via Twilio: ${result.sid}`);
      return { success: true, messageId: result.sid };
    } catch (error) {
      logger.error("Twilio SMS error:", error);
      throw error;
    }
  }

  /**
   * Send via AWS SNS
   */
  async sendViaAWSSNS(phoneNumber, message) {
    try {
      const AWS = require("aws-sdk");
      const sns = new AWS.SNS({
        accessKeyId: this.apiKey,
        secretAccessKey: this.apiSecret,
        region: process.env.AWS_REGION || "us-east-1",
      });

      const params = {
        Message: message,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
          "AWS.SNS.SMS.SMSType": {
            DataType: "String",
            StringValue: "Transactional",
          },
        },
      };

      const result = await sns.publish(params).promise();

      logger.info(`SMS sent via AWS SNS: ${result.MessageId}`);
      return { success: true, messageId: result.MessageId };
    } catch (error) {
      logger.error("AWS SNS SMS error:", error);
      throw error;
    }
  }

  /**
   * Send via Africa's Talking (popular in Africa)
   */
  async sendViaAfricasTalking(phoneNumber, message) {
    try {
      const AfricasTalking = require("africastalking");
      const africastalking = AfricasTalking({
        apiKey: this.apiKey,
        username: process.env.AFRICAS_TALKING_USERNAME,
      });

      const sms = africastalking.SMS;
      const options = {
        to: [phoneNumber],
        message: message,
        from: this.fromNumber,
      };

      const result = await sms.send(options);

      logger.info(`SMS sent via Africa's Talking:`, result);
      return {
        success: true,
        messageId: result.SMSMessageData.Recipients[0].messageId,
      };
    } catch (error) {
      logger.error("Africa's Talking SMS error:", error);
      throw error;
    }
  }

  /**
   * Send bulk SMS (for announcements)
   */
  async sendBulkSMS(phoneNumbers, message) {
    const results = [];

    for (const phoneNumber of phoneNumbers) {
      try {
        const result = await this.sendSMS(phoneNumber, message);
        results.push({
          phoneNumber,
          success: true,
          messageId: result.messageId,
        });
      } catch (error) {
        results.push({ phoneNumber, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Validate phone number format
   */
  isValidPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    return cleaned.length >= 9 && cleaned.length <= 15;
  }
}

module.exports = new SMSService();
