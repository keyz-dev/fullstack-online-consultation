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
const { NotFoundError } = require("../utils/errors");
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
      req.authUser,
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

    // Update payment status
    let paymentStatus = "pending";
    let appointmentStatus = "pending_payment";

    switch (status) {
      case "SUCCESSFUL":
        paymentStatus = "completed";
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
      metadata: {
        ...payment.metadata,
        processedAt: status === "SUCCESSFUL" ? new Date() : null,
      },
    });

    await appointment.update({
      status: appointmentStatus,
      paymentStatus: paymentStatus,
    });

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
    logger.error("Error processing webhook:", error);
    next(error);
  }
};
