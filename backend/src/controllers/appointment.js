const {
  Appointment,
  Payment,
  Patient,
  TimeSlot,
  DoctorAvailability,
  Doctor,
  User,
  Specialty,
  Symptom,
} = require("../db/models");
const campayService = require("../services/campay");
const paymentTrackingService = require("../services/paymentTracking");
const appointmentNotificationService = require("../services/appointmentNotificationService");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/errors");
const {
  formatAppointmentData,
} = require("../utils/returnFormats/appointmentData");
const logger = require("../utils/logger");

class AppointmentController {
  // Create appointment with pending payment status
  async createAppointment(req, res, next) {
    try {
      const {
        doctorId,
        timeSlotId,
        consultationType,
        symptomIds = [],
        notes,
      } = req.body;

      // Get patient ID from authenticated user
      const patient = await Patient.findOne({
        where: { userId: req.authUser.id },
      });
      if (!patient) {
        return next(new NotFoundError("Patient not found"));
      }
      const patientId = patient.id;

      // Validate time slot availability
      const timeSlot = await TimeSlot.findByPk(timeSlotId, {
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
      });

      if (!timeSlot) {
        return next(new NotFoundError("Time slot not found"));
      }

      if (!timeSlot.isAvailable) {
        return next(new BadRequestError("Time slot is not available"));
      }

      // Create appointment with pending_payment status
      const appointment = await Appointment.create({
        timeSlotId,
        patientId,
        consultationType,
        symptomIds,
        notes,
        status: "pending_payment",
        paymentStatus: "pending",
      });

      // Create payment record
      const payment = await Payment.create({
        userId: req.authUser.id,
        appointmentId: appointment.id,
        type: "consultation",
        amount: timeSlot.availability.consultationFee,
        currency: "XAF",
        status: "pending",
        paymentMethod: "mobile_money",
        description: `Payment for appointment with Dr. ${timeSlot.availability.doctor.user.name}`,
      });

      const formattedAppointment = await formatAppointmentData(appointment, {
        includePayment: true,
        includeDoctor: true,
        includePatient: true,
      });

      // Send notification to patient
      await appointmentNotificationService.notifyAppointmentCreated(
        appointment,
        req.user.patient
      );

      res.status(201).json({
        success: true,
        message: "Appointment created. Please complete payment.",
        data: {
          appointment: formattedAppointment,
          payment: {
            id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
          },
        },
      });
    } catch (error) {
      logger.error("Error creating appointment:", error);
      next(error);
    }
  }

  // Initiate payment for appointment
  async initiatePayment(req, res, next) {
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
        return next(new NotFoundError("Appointment not found"));
      }

      // Get or create payment record
      let payment = appointment.payments[0];
      if (!payment) {
        payment = await Payment.create({
          userId: req.authUser.id,
          appointmentId: appointment.id,
          type: "consultation",
          amount: appointment.timeSlot.availability.consultationFee,
          currency: "XAF",
          status: "pending",
          paymentMethod: "mobile_money",
          description: `Payment for appointment with Dr. ${doctorName}`,
        });
      }

      const amount = appointment.timeSlot.availability.consultationFee;
      const doctorName = appointment.timeSlot.availability.doctor.user.name;

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
        req.user.patient,
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
  }

  // Handle Campay webhook
  async handlePaymentWebhook(req, res, next) {
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
        appointment.patient,
        payment,
        status
      );

      // Send notification to doctor if payment successful
      if (status === "SUCCESSFUL") {
        await appointmentNotificationService.notifyDoctorNewAppointment(
          appointment,
          appointment.timeSlot.availability.doctor,
          appointment.patient
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
  }

  // Get appointment by ID
  async getAppointmentById(req, res, next) {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findByPk(id, {
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
                        attributes: ["id", "name", "email", "avatar"],
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
                attributes: ["id", "name", "email", "avatar"],
              },
            ],
          },
          {
            model: Payment,
            as: "payments",
            order: [["createdAt", "DESC"]],
          },
        ],
      });

      if (!appointment) {
        return next(new NotFoundError("Appointment not found"));
      }

      // Check if user is authorized to view this appointment
      const isPatient = appointment.patient.userId === req.authUser.id;
      const isDoctor =
        appointment.timeSlot.availability.doctorId === req.authUser.doctor?.id;
      const isAdmin = req.authUser.role === "admin";

      if (!isPatient && !isDoctor && !isAdmin) {
        return next(
          new UnauthorizedError(
            "You are not authorized to view this appointment"
          )
        );
      }

      const formattedAppointment = await formatAppointmentData(appointment, {
        includePayment: true,
        includeDoctor: true,
        includePatient: true,
      });

      res.json({
        success: true,
        data: formattedAppointment,
      });
    } catch (error) {
      logger.error("Error fetching appointment:", error);
      next(error);
    }
  }

  // Get user's appointments
  async getUserAppointments(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = {};

      // Filter by user role
      if (req.authUser.role === "patient") {
        if (!req.authUser.patient) {
          return res.status(400).json({
            success: false,
            message: "User is not registered as a patient",
          });
        }
        whereClause.patientId = req.authUser.patient.id;
      } else if (req.authUser.role === "doctor") {
        if (!req.authUser.doctor) {
          return res.status(400).json({
            success: false,
            message: "User is not registered as a doctor",
          });
        }
        // For doctors, we need to join with TimeSlot and DoctorAvailability
        whereClause["$timeSlot.availability.doctorId$"] =
          req.authUser.doctor.id;
      }

      // Filter by status if provided
      if (status && status !== "all") {
        whereClause.status = status;
      }

      const appointments = await Appointment.findAndCountAll({
        where: whereClause,
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
                        attributes: ["id", "name", "email", "avatar"],
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
                attributes: ["id", "name", "email", "avatar"],
              },
            ],
          },
          {
            model: Payment,
            as: "payments",
            order: [["createdAt", "DESC"]],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      const formattedAppointments = await Promise.all(
        appointments.rows.map(async (appointment) => {
          try {
            return await formatAppointmentData(appointment, {
              includePayment: true,
              includeDoctor: true,
              includePatient: true,
            });
          } catch (error) {
            logger.error("Error formatting appointment:", error);
            // Return a simplified version without payment data
            return await formatAppointmentData(appointment, {
              includePayment: false,
              includeDoctor: true,
              includePatient: true,
            });
          }
        })
      );

      res.json({
        success: true,
        data: {
          appointments: formattedAppointments,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: appointments.count,
            totalPages: Math.ceil(appointments.count / limit),
          },
        },
      });
    } catch (error) {
      logger.error("Error fetching user appointments:", error);
      next(error);
    }
  }

  // Get patient appointments with filters
  async getPatientAppointments(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        consultationType,
        dateFrom,
        dateTo,
        search,
        sortBy = "date",
      } = req.query;
      const offset = (page - 1) * limit;

      // Check if user has a patient record
      if (!req.authUser.patient) {
        return res.status(400).json({
          success: false,
          message: "User is not registered as a patient",
        });
      }

      let whereClause = { patientId: req.authUser.patient.id };

      // Filter by status
      if (status && status !== "all") {
        whereClause.status = status;
      }

      // Filter by consultation type
      if (consultationType && consultationType !== "all") {
        whereClause.consultationType = consultationType;
      }

      // Date range filters
      if (dateFrom || dateTo) {
        whereClause["$timeSlot.date$"] = {};
        if (dateFrom) whereClause["$timeSlot.date$"].$gte = dateFrom;
        if (dateTo) whereClause["$timeSlot.date$"].$lte = dateTo;
      }

      // Search filter
      if (search) {
        whereClause["$timeSlot.availability.doctor.user.name$"] = {
          [require("sequelize").Op.iLike]: `%${search}%`,
        };
      }

      // Sort options - simplified to avoid nested association issues
      let orderClause = [["createdAt", "DESC"]];
      if (sortBy === "date") {
        orderClause = [["createdAt", "ASC"]]; // Use createdAt as proxy for date
      } else if (sortBy === "doctor") {
        orderClause = [["createdAt", "ASC"]]; // Use createdAt as proxy for doctor sorting
      } else if (sortBy === "status") {
        orderClause = [["status", "ASC"]];
      }

      const appointments = await Appointment.findAndCountAll({
        where: whereClause,
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
                        attributes: ["id", "name", "email", "avatar"],
                      },
                      {
                        model: Specialty,
                        as: "specialties",
                        attributes: ["id", "name"],
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
                attributes: ["id", "name", "email", "avatar"],
              },
            ],
          },
        ],
        order: orderClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      // Debug: Check if any appointment has payment data
      appointments.rows.forEach((appointment, index) => {
        console.log(`Appointment ${index + 1}:`, {
          id: appointment.id,
          hasPayments: !!appointment.payments,
          paymentsLength: appointment.payments
            ? appointment.payments.length
            : 0,
          paymentKeys: appointment.payments
            ? Object.keys(appointment.payments[0] || {})
            : [],
        });
      });

      const formattedAppointments = appointments.rows.map(
        (appointment, index) => {
          try {
            return {
              id: appointment.id,
              doctor: {
                id: appointment.timeSlot.availability.doctor.id,
                user: appointment.timeSlot.availability.doctor.user,
                specialties:
                  appointment.timeSlot.availability.doctor.specialties,
              },
              timeSlot: {
                id: appointment.timeSlot.id,
                date: appointment.timeSlot.date,
                startTime: appointment.timeSlot.startTime,
                endTime: appointment.timeSlot.endTime,
              },
              consultationType: appointment.consultationType,
              status: appointment.status,
              notes: appointment.notes,
              createdAt: appointment.createdAt,
              updatedAt: appointment.updatedAt,
            };
          } catch (error) {
            throw error;
          }
        }
      );

      res.json({
        success: true,
        data: {
          appointments: formattedAppointments,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: appointments.count,
            totalPages: Math.ceil(appointments.count / limit),
          },
        },
      });
    } catch (error) {
      logger.error("Error fetching patient appointments:", error);
      next(error);
    }
  }

  // Get patient appointment statistics
  async getPatientAppointmentStats(req, res, next) {
    try {
      // Check if user has a patient record
      if (!req.authUser.patient) {
        return res.status(400).json({
          success: false,
          message: "User is not registered as a patient",
        });
      }

      // Validate that patientId is a valid integer
      const patientId = req.authUser.patient.id;
      if (!patientId || isNaN(parseInt(patientId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid patient ID",
        });
      }

      const validPatientId = parseInt(patientId);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get all appointments for the patient
      const allAppointments = await Appointment.findAll({
        where: { patientId: validPatientId },
        include: [
          {
            model: TimeSlot,
            as: "timeSlot",
            attributes: ["date"],
          },
        ],
      });

      // Calculate statistics
      const total = allAppointments.length;
      const upcoming = allAppointments.filter(
        (apt) => apt.status === "confirmed" && new Date(apt.timeSlot.date) > now
      ).length;
      const completed = allAppointments.filter(
        (apt) => apt.status === "completed"
      ).length;
      const cancelled = allAppointments.filter(
        (apt) => apt.status === "cancelled"
      ).length;
      const thisMonth = allAppointments.filter(
        (apt) => new Date(apt.timeSlot.date) >= startOfMonth
      ).length;
      const pendingPayment = allAppointments.filter(
        (apt) => apt.status === "pending_payment"
      ).length;

      res.json({
        success: true,
        data: {
          total,
          upcoming,
          completed,
          cancelled,
          thisMonth,
          pendingPayment,
        },
      });
    } catch (error) {
      logger.error("Error fetching patient appointment stats:", error);
      next(error);
    }
  }

  // Get doctor appointments with filters
  async getDoctorAppointments(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        consultationType,
        dateFrom,
        dateTo,
        search,
        sortBy = "date",
      } = req.query;
      const offset = (page - 1) * limit;

      // Check if user has a doctor record
      if (!req.authUser.doctor) {
        return res.status(400).json({
          success: false,
          message: "User is not registered as a doctor",
        });
      }

      let whereClause = {
        paymentStatus: "paid", // Only show paid appointments
      };

      // Filter by status
      if (status && status !== "all") {
        whereClause.status = status;
      }

      // Filter by consultation type
      if (consultationType && consultationType !== "all") {
        whereClause.consultationType = consultationType;
      }

      // Note: Date range and search filters are temporarily disabled due to association complexity
      // These will be implemented with post-query filtering if needed

      // Sort options - simplified to avoid nested association issues
      let orderClause = [["createdAt", "DESC"]];
      if (sortBy === "date") {
        orderClause = [["createdAt", "ASC"]]; // Use createdAt as proxy for date
      } else if (sortBy === "patient") {
        orderClause = [["createdAt", "ASC"]]; // Use createdAt as proxy for patient sorting
      } else if (sortBy === "status") {
        orderClause = [["status", "ASC"]];
      }

      const appointments = await Appointment.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: TimeSlot,
            as: "timeSlot",
            include: [
              {
                model: DoctorAvailability,
                as: "availability",
                where: { doctorId: req.authUser.doctor.id }, // Filter by doctor ID
                include: [
                  {
                    model: Doctor,
                    as: "doctor",
                    include: [
                      {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "email", "avatar"],
                      },
                      {
                        model: Specialty,
                        as: "specialties",
                        attributes: ["id", "name"],
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
                attributes: ["id", "name", "email", "avatar"],
              },
            ],
          },
        ],
        order: orderClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      const formattedAppointments = appointments.rows.map((appointment) => ({
        id: appointment.id,
        patient: {
          id: appointment.patient.id,
          user: appointment.patient.user,
        },
        timeSlot: {
          id: appointment.timeSlot.id,
          date: appointment.timeSlot.date,
          startTime: appointment.timeSlot.startTime,
          endTime: appointment.timeSlot.endTime,
        },
        consultationType: appointment.consultationType,
        status: appointment.status,
        paymentStatus: appointment.paymentStatus,
        notes: appointment.notes,
        symptomIds: appointment.symptomIds,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      }));

      res.json({
        success: true,
        data: {
          appointments: formattedAppointments,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: appointments.count,
            totalPages: Math.ceil(appointments.count / limit),
          },
        },
      });
    } catch (error) {
      logger.error("Error fetching doctor appointments:", error);
      next(error);
    }
  }

  // Get doctor appointment statistics
  async getDoctorAppointmentStats(req, res, next) {
    try {
      // Check if user has a doctor record
      if (!req.authUser.doctor) {
        return res.status(400).json({
          success: false,
          message: "User is not registered as a doctor",
        });
      }

      const doctorId = req.authUser.doctor.id;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get all appointments for the doctor (only paid ones)
      const allAppointments = await Appointment.findAll({
        where: {
          paymentStatus: "paid", // Only count paid appointments
        },
        include: [
          {
            model: TimeSlot,
            as: "timeSlot",
            include: [
              {
                model: DoctorAvailability,
                as: "availability",
                where: { doctorId },
                attributes: [],
              },
            ],
            attributes: ["date"],
          },
        ],
      });

      // Calculate statistics
      const stats = {
        total: allAppointments.length,
        today: allAppointments.filter((apt) => {
          const aptDate = new Date(apt.timeSlot.date);
          return (
            aptDate.toDateString() === now.toDateString() &&
            apt.status === "confirmed"
          );
        }).length,
        thisWeek: allAppointments.filter((apt) => {
          const aptDate = new Date(apt.timeSlot.date);
          return aptDate >= startOfWeek && apt.status === "confirmed";
        }).length,
        thisMonth: allAppointments.filter((apt) => {
          const aptDate = new Date(apt.timeSlot.date);
          return aptDate >= startOfMonth && apt.status === "confirmed";
        }).length,
        completed: allAppointments.filter((apt) => apt.status === "completed")
          .length,
        cancelled: allAppointments.filter((apt) => apt.status === "cancelled")
          .length,
        successRate:
          allAppointments.length > 0
            ? Math.round(
                (allAppointments.filter((apt) => apt.status === "completed")
                  .length /
                  allAppointments.length) *
                  100
              )
            : 0,
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error("Error fetching doctor appointment stats:", error);
      next(error);
    }
  }
}

module.exports = new AppointmentController();
