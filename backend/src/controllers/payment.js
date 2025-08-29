const {
  Appointment,
  Payment,
  TimeSlot,
  DoctorAvailability,
  Doctor,
  User,
} = require("../db/models");
const campayService = require("../services/campay");
const paymentTrackingService = require("../services/paymentTracking");
const appointmentNotificationService = require("../services/appointmentNotificationService");
const { NotFoundError, BadRequestError } = require("../utils/errors");
const logger = require("../utils/logger");

exports.initiateAppointmentPayment = async (req, res, next) => {
  try {
    const { appointmentId, phoneNumber } = req.body;

    // Find appointment with payment
    const appointment = await Appointment.findByPk(appointmentId, {
      include: [
        {
          model: Payment,
          as: "payments",
          where: { status: "pending" },
          required: false,
        },
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
      ],
    });

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    const amount = appointment.timeSlot.availability.consultationFee;
    const doctorName = appointment.timeSlot.availability.doctor.user.name;

    // Get or create payment record
    let payment = appointment.payments[0];
    if (!payment) {
      payment = await Payment.create({
        userId: req.authUser.id,
        appointmentId: appointment.id,
        type: "consultation",
        amount: amount,
        currency: "XAF",
        status: "pending",
        paymentMethod: "mobile_money",
        description: `Payment for appointment with Dr. ${doctorName}`,
      });
    }

    // Initiate Campay payment
    const paymentData = {
      amount: Math.round(amount),
      phoneNumber: phoneNumber,
      description: `Payment for appointment with Dr. ${doctorName}`,
      orderId: appointmentId.toString(),
      currency: "XAF",
    };

    const campayResponse = await campayService.initiatePayment(paymentData);

    // Update payment record
    await payment.update({
      transactionId: campayResponse.reference,
      gatewayResponse: campayResponse,
      status: "processing",
    });

    // Start payment tracking
    paymentTrackingService.startPolling(campayResponse.reference);

    // Send notification to patient about payment initiation
    await appointmentNotificationService.notifyPaymentInitiated(
      appointment,
      { userId: req.authUser.id, ...req.authUser.patient },
      campayResponse.reference
    );

    res.json({
      success: true,
      message: "Payment initiated successfully. Please check your phone.",
      paymentReference: campayResponse.reference,
      appointment: {
        id: appointment.id,
        status: appointment.status,
        consultationType: appointment.consultationType,
        appointmentTime: appointment.timeSlot.startTime,
        doctorName: doctorName,
        amount: amount,
      },
    });
  } catch (error) {
    logger.error("Error initiating payment:", error);
    next(error);
  }
};

// Handle Campay webhook
exports.handleAppointmentPaymentWebhook = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { status, reference, amount, external_reference } = req.body;

    logger.info(`Webhook received for payment ${reference}: ${status}`);

    // Find payment by Campay reference
    const payment = await Payment.findOne({
      where: { transactionId: reference },
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
          ],
        },
        {
          model: User,
          as: "user",
          include: [
            {
              model: require("../db/models").Patient,
              as: "patient",
            },
          ],
        },
      ],
    });

    if (!payment) {
      logger.error(`Payment not found for reference: ${reference}`);
      return res.status(404).json({ error: "Payment not found" });
    }

    const appointment = payment.appointment;
    const timeSlot = appointment.timeSlot;

    // Update payment status
    let paymentStatus = "pending";
    let appointmentStatus = "pending_payment";

    switch (status) {
      case "SUCCESSFUL":
        paymentStatus = "completed";
        appointmentStatus = "paid";

        // Book the time slot only when payment is successful
        await timeSlot.update({ isBooked: true }, { transaction });
        logger.info(
          `Time slot ${timeSlot.id} booked for successful payment ${reference}`
        );
        break;

      case "FAILED":
      case "CANCELLED":
        paymentStatus = "failed";
        appointmentStatus = "cancelled";

        // Keep slot available for failed payments (allows retry)
        // Slot remains unbooked so user can retry payment
        logger.info(
          `Payment ${reference} failed - slot ${timeSlot.id} remains available for retry`
        );
        break;

      case "PENDING":
        paymentStatus = "processing";
        appointmentStatus = "pending_payment";
        // Slot remains unbooked during processing
        break;
    }

    await payment.update(
      {
        status: paymentStatus,
        metadata: {
          ...payment.metadata,
          processedAt: status === "SUCCESSFUL" ? new Date() : null,
          lastWebhookStatus: status,
          lastWebhookAt: new Date(),
        },
      },
      { transaction }
    );

    await appointment.update(
      {
        status: appointmentStatus,
        paymentStatus: paymentStatus,
      },
      { transaction }
    );

    // Commit transaction
    await transaction.commit();
    logger.info(`Payment webhook transaction committed for ${reference}`);

    // Send notifications
    await appointmentNotificationService.notifyPaymentStatusUpdate(
      appointment,
      { userId: payment.user.id, ...payment.user.patient },
      payment,
      status
    );

    // Emit socket event for real-time frontend updates
    if (global.io) {
      global.io.to(`payment-${reference}`).emit("payment-status-update", {
        reference: reference,
        status: status,
        appointmentId: appointment.id,
        message:
          status === "SUCCESSFUL"
            ? "Payment completed successfully! Your appointment is confirmed."
            : status === "FAILED"
              ? "Payment failed. Please try again."
              : "Payment status updated.",
        timestamp: new Date(),
      });
    }

    // Send notification to doctor if payment successful
    if (status === "SUCCESSFUL") {
      await appointmentNotificationService.notifyDoctorNewAppointment(
        appointment,
        appointment.timeSlot.availability.doctor,
        { userId: payment.user.id, ...payment.user.patient }
      );
    }

    res.json({
      received: true,
      processed: true,
      reference: reference,
      status: status,
    });
  } catch (error) {
    // Rollback transaction on error
    if (transaction && !transaction.finished) {
      try {
        await transaction.rollback();
        logger.error("Payment webhook transaction rolled back due to error");
      } catch (rollbackError) {
        logger.error(
          "Error rolling back payment webhook transaction:",
          rollbackError
        );
      }
    }

    logger.error("Error processing webhook:", error);
    next(error);
  }
};

// Retry payment for failed transactions
exports.retryAppointmentPayment = async (req, res, next) => {
  try {
    const { appointmentId, phoneNumber } = req.body;

    // Find appointment with failed payment
    const appointment = await Appointment.findByPk(appointmentId, {
      include: [
        {
          model: Payment,
          as: "payments",
          where: {
            status: ["failed", "cancelled", "pending"],
            userId: req.authUser.id,
          },
          required: false,
        },
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
      ],
    });

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    // Check if appointment is in a retryable state
    if (
      appointment.status !== "cancelled" &&
      appointment.status !== "pending_payment"
    ) {
      throw new BadRequestError("Appointment is not in a retryable state");
    }

    // Check if time slot is still available
    if (appointment.timeSlot.isBooked) {
      throw new BadRequestError("Time slot is no longer available");
    }

    const amount = appointment.timeSlot.availability.consultationFee;
    const doctorName = appointment.timeSlot.availability.doctor.user.name;

    // Get or create payment record
    let payment = appointment.payments[0];
    if (!payment) {
      payment = await Payment.create({
        userId: req.authUser.id,
        appointmentId: appointment.id,
        type: "consultation",
        amount: amount,
        currency: "XAF",
        status: "pending",
        paymentMethod: "mobile_money",
        description: `Payment for appointment with Dr. ${doctorName}`,
      });
    } else {
      // Reset payment status for retry
      await payment.update({
        status: "pending",
        transactionId: null,
        gatewayResponse: null,
        metadata: {
          ...payment.metadata,
          retryCount: (payment.metadata?.retryCount || 0) + 1,
          lastRetryAt: new Date(),
        },
      });
    }

    // Initiate Campay payment
    const paymentData = {
      amount: Math.round(amount),
      phoneNumber: phoneNumber,
      description: `Payment for appointment with Dr. ${doctorName}`,
      orderId: appointmentId.toString(),
      currency: "XAF",
    };

    const campayResponse = await campayService.initiatePayment(paymentData);

    // Update payment record
    await payment.update({
      transactionId: campayResponse.reference,
      gatewayResponse: campayResponse,
      status: "processing",
    });

    // Update appointment status back to pending_payment
    await appointment.update({
      status: "pending_payment",
      paymentStatus: "processing",
    });

    // Start payment tracking
    paymentTrackingService.startPolling(campayResponse.reference);

    // Send notification to patient about payment retry
    await appointmentNotificationService.notifyPaymentInitiated(
      appointment,
      { userId: req.authUser.id, ...req.authUser.patient },
      campayResponse.reference
    );

    res.json({
      success: true,
      message: "Payment retry initiated successfully. Please check your phone.",
      paymentReference: campayResponse.reference,
      appointment: {
        id: appointment.id,
        status: appointment.status,
        consultationType: appointment.consultationType,
        appointmentTime: appointment.timeSlot.startTime,
        doctorName: doctorName,
        amount: amount,
      },
    });
  } catch (error) {
    logger.error("Error retrying payment:", error);
    next(error);
  }
};
