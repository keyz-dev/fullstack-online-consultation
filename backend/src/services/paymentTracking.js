const campayService = require("./campay");
const {
  Payment,
  Appointment,
  Patient,
  User,
  TimeSlot,
  DoctorAvailability,
  Doctor,
  Consultation,
} = require("../db/models");
const appointmentNotificationService = require("./appointmentNotificationService");
const logger = require("../utils/logger");
const { sequelize } = require("../db/models");

class PaymentTrackingService {
  constructor() {
    this.activePayments = new Map();
  }

  startPolling(paymentReference) {
    const pollInterval = 10000; // 10 seconds
    const maxPollTime = 600000; // 10 minutes
    const startTime = Date.now();

    // Start polling after 2 minutes (from reference project)
    const pollDelay = 10000;

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
            return;
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
    const transaction = await sequelize.transaction();

    try {
      const payment = await Payment.findOne({
        where: { transactionId: paymentReference },
        include: [
          {
            model: Appointment,
            as: "appointment",
            include: [
              {
                model: TimeSlot,
                as: "timeSlot",
                include: [
                  {
                    model: DoctorAvailability,
                    as: "availability",
                    include: [
                      {
                        model: Doctor,
                        as: "doctor",
                        attributes: [
                          "id",
                          "userId",
                          "licenseNumber",
                          "experience",
                        ],
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
              },
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

      const appointment = payment.appointment;
      const timeSlot = appointment.timeSlot;

      let paymentStatus = "pending";
      let appointmentStatus = "pending_payment";
      let appointmentPaymentStatus = "pending";

      switch (status) {
        case "SUCCESSFUL":
          paymentStatus = "completed";
          appointmentStatus = "paid";
          appointmentPaymentStatus = "paid";

          // Book the time slot only when payment is successful
          await timeSlot.update({ isBooked: true }, { transaction });
          logger.info(
            `Time slot ${timeSlot.id} booked for successful payment ${paymentReference} (polling)`
          );

          // Create consultation record when payment is successful
          const existingConsultation = await Consultation.findOne({
            where: { appointmentId: appointment.id },
            transaction,
          });

          if (!existingConsultation) {
            await Consultation.create(
              {
                appointmentId: appointment.id,
                status: "not_started",
                type:
                  appointment.consultationType === "online"
                    ? "video_call"
                    : "in_person",
              },
              { transaction }
            );
            logger.info(
              `Consultation created for appointment ${appointment.id} after successful payment ${paymentReference} (polling)`
            );
          }
          break;

        case "FAILED":
        case "CANCELLED":
          paymentStatus = "failed";
          appointmentStatus = "cancelled";
          appointmentPaymentStatus = "failed";

          // Keep slot available for failed payments (allows retry)
          // Slot remains unbooked so user can retry payment
          logger.info(
            `Payment ${paymentReference} failed - slot ${timeSlot.id} remains available for retry (polling)`
          );
          break;

        case "PENDING":
          paymentStatus = "processing";
          appointmentStatus = "pending_payment";
          appointmentPaymentStatus = "pending";
          // Slot remains unbooked during processing
          break;
      }

      await payment.update(
        {
          status: paymentStatus,
          metadata: {
            ...payment.metadata,
            processedAt: status === "SUCCESSFUL" ? new Date() : null,
            lastPollingStatus: status,
            lastPollingAt: new Date(),
          },
        },
        { transaction }
      );

      await appointment.update(
        {
          status: appointmentStatus,
          paymentStatus: appointmentPaymentStatus,
        },
        { transaction }
      );

      // Commit transaction
      await transaction.commit();
      logger.info(
        `Payment polling transaction committed for ${paymentReference}`
      );

      // Send notifications only for major status changes
      if (
        status === "SUCCESSFUL" ||
        status === "FAILED" ||
        status === "CANCELLED"
      ) {
        await appointmentNotificationService.notifyPaymentStatusUpdate(
          appointment,
          { userId: appointment.patient.user.id, ...appointment.patient },
          payment,
          status
        );

        // Send notification to doctor if payment successful
        if (status === "SUCCESSFUL") {
          await appointmentNotificationService.notifyDoctorNewAppointment(
            appointment,
            timeSlot.availability.doctor,
            { userId: appointment.patient.user.id, ...appointment.patient }
          );
        }
      }

      // Emit socket event for real-time frontend updates
      if (global.io) {
        global.io
          .to(`payment-${paymentReference}`)
          .emit("payment-status-update", {
            reference: paymentReference,
            status: status,
            appointmentId: appointment.id,
            message:
              status === "SUCCESSFUL"
                ? "Payment completed successfully! Your appointment is confirmed."
                : status === "FAILED"
                  ? "Payment failed. You can retry the payment."
                  : status === "CANCELLED"
                    ? "Payment was cancelled. You can retry the payment."
                    : "Payment status updated.",
            timestamp: new Date(),
          });
      }

      logger.info(
        `Payment ${paymentReference} status updated to ${status} (polling)`
      );
    } catch (error) {
      // Rollback transaction on error

      console.log("The error: ", error);
      if (transaction && !transaction.finished) {
        try {
          await transaction.rollback();
          logger.error("Payment polling transaction rolled back due to error");
        } catch (rollbackError) {
          logger.error(
            "Error rolling back payment polling transaction:",
            rollbackError
          );
        }
      }

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
