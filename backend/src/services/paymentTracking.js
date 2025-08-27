const campayService = require("./campay");
const { Payment, Appointment, Patient, User } = require("../db/models");
const appointmentNotificationService = require("./appointmentNotificationService");
const logger = require("../utils/logger");

class PaymentTrackingService {
  constructor() {
    this.activePayments = new Map();
  }

  startPolling(paymentReference) {
    const pollInterval = 10000; // 10 seconds
    const maxPollTime = 600000; // 10 minutes
    const startTime = Date.now();

    // Start polling after 2 minutes (from reference project)
    const pollDelay = 120000;

    const poll = async () => {
      try {
        // Stop if exceeded max time
        if (Date.now() - startTime > maxPollTime) {
          logger.info(
            `Stopping polling for payment ${paymentReference} - exceeded max time`
          );
          this.stopPolling(paymentReference);
          return;
        }

        const statusResponse =
          await campayService.checkPaymentStatus(paymentReference);

        if (statusResponse.status) {
          await this.updatePaymentStatus(
            paymentReference,
            statusResponse.status
          );

          // Stop polling if payment is completed
          if (
            ["SUCCESSFUL", "FAILED", "CANCELLED"].includes(
              statusResponse.status
            )
          ) {
            logger.info(
              `Stopping polling for payment ${paymentReference} - status: ${statusResponse.status}`
            );
            this.stopPolling(paymentReference);
          }
        }

        // Continue polling
        setTimeout(poll, pollInterval);
      } catch (error) {
        logger.error(`Polling error for payment ${paymentReference}:`, error);
        setTimeout(poll, pollInterval);
      }
    };

    // Start polling after delay
    setTimeout(poll, pollDelay);
  }

  async updatePaymentStatus(paymentReference, status) {
    try {
      const payment = await Payment.findOne({
        where: { transactionId: paymentReference },
        include: [
          {
            model: Appointment,
            as: "appointment",
            include: [
              {
                model: Patient,
                as: "patient",
                include: [
                  {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!payment) {
        logger.error(`Payment not found for reference: ${paymentReference}`);
        return;
      }

      let paymentStatus = "pending";
      let appointmentStatus = "pending_payment";

      switch (status) {
        case "SUCCESSFUL":
          paymentStatus = "paid";
          appointmentStatus = "paid";
          break;
        case "FAILED":
        case "CANCELLED":
          paymentStatus = "failed";
          appointmentStatus = "cancelled";
          break;
        case "PENDING":
          paymentStatus = "processing";
          appointmentStatus = "pending_payment";
          break;
      }

      await payment.update({
        status: paymentStatus,
        processedAt: status === "SUCCESSFUL" ? new Date() : null,
      });

      await payment.appointment.update({
        status: appointmentStatus,
        paymentStatus: paymentStatus,
      });

      // Send notifications
      await appointmentNotificationService.notifyPaymentStatusUpdate(
        payment.appointment,
        payment.appointment.patient,
        payment,
        status
      );

      // Send notification to doctor if payment successful
      if (status === "SUCCESSFUL") {
        await appointmentNotificationService.notifyDoctorNewAppointment(
          payment.appointment,
          payment.appointment.timeSlot.availability.doctor,
          payment.appointment.patient
        );
      }

      logger.info(`Payment ${paymentReference} status updated to ${status}`);
    } catch (error) {
      logger.error(
        `Error updating payment status for ${paymentReference}:`,
        error
      );
    }
  }

  stopPolling(paymentReference) {
    // Cleanup logic - remove from active payments
    this.activePayments.delete(paymentReference);
  }

  // Get payment info
  async getPaymentInfo(paymentReference) {
    try {
      const payment = await Payment.findOne({
        where: { transactionId: paymentReference },
        include: [
          {
            model: Appointment,
            as: "appointment",
          },
        ],
      });

      if (!payment) return null;

      return {
        reference: paymentReference,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        appointmentId: payment.appointment.id,
        createdAt: payment.createdAt,
        processedAt: payment.processedAt,
      };
    } catch (error) {
      logger.error(
        `Error getting payment info for ${paymentReference}:`,
        error
      );
      return null;
    }
  }
}

module.exports = new PaymentTrackingService();
