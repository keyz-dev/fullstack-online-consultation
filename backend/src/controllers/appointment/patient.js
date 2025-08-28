const {
  Appointment,
  Payment,
  Patient,
  TimeSlot,
  DoctorAvailability,
  Doctor,
  User,
  PatientDocument,
  sequelize,
} = require("../../db/models");
const appointmentNotificationService = require("../../services/appointmentNotificationService");
const { BadRequestError, NotFoundError } = require("../../utils/errors");
const {
  formatAppointmentData,
} = require("../../utils/returnFormats/appointmentData");
const logger = require("../../utils/logger");
const { handleFileUploads } = require("../../utils/documentUtil");
const { cleanUpFileImages } = require("../../utils/imageCleanup");
const { getAppointmentIncludes } = require("./base");
const {
  formatAppointmentsData,
} = require("../../utils/returnFormats/appointmentData");

exports.createAppointment = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { timeSlotId, consultationType, notes } = req.body;

    req.body.documentNames = req.body.documentNames
      ? Array.isArray(req.body.documentNames)
        ? req.body.documentNames
        : [req.body.documentNames]
      : [];

    // parse symptomIds
    let symptomIds = req.body.symptomIds
      ? Array.isArray(req.body.symptomIds)
        ? req.body.symptomIds
        : [req.body.symptomIds]
      : [];

    // convertt symptomIds to integers
    symptomIds = symptomIds.map((id) => parseInt(id));

    // Handle document uploads
    let uploadedFiles = {};
    if (req.files) {
      uploadedFiles = await handleFileUploads(
        req.files,
        req.body.documentNames
      );
    }

    // Get patient ID from authenticated user
    const patient = await Patient.findOne({
      where: { userId: req.authUser.id },
    });
    if (!patient) {
      throw new NotFoundError("Patient not found");
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
      throw new NotFoundError("Time slot not found");
    }

    if (timeSlot.isBooked) {
      throw new BadRequestError("Time slot is already booked");
    }

    // Create appointment with pending_payment status
    const appointment = await Appointment.create(
      {
        timeSlotId,
        patientId,
        consultationType,
        symptomIds,
        notes,
        status: "pending_payment",
        paymentStatus: "pending",
      },
      { transaction }
    );

    // Mark time slot as booked
    await timeSlot.update({ isBooked: true }, { transaction });

    // Create patient documents if any
    if (uploadedFiles.documents && uploadedFiles.documents.length > 0) {
      const documentPromises = uploadedFiles.documents.map((doc) =>
        PatientDocument.create(
          {
            patientId: patientId,
            documentType: doc.documentName,
            fileName: doc.originalName,
            fileUrl: doc.url,
            fileSize: doc.size,
            mimeType: doc.fileType,
          },
          { transaction }
        )
      );
      await Promise.all(documentPromises);
    }

    // Create payment record
    const payment = await Payment.create(
      {
        userId: req.authUser.id,
        appointmentId: appointment.id,
        type: "consultation",
        amount: timeSlot.availability.consultationFee,
        currency: "XAF",
        status: "pending",
        paymentMethod: "mobile_money",
        description: `Payment for appointment with Dr. ${timeSlot.availability.doctor.user.name}`,
      },
      { transaction }
    );

    // Commit transaction first
    await transaction.commit();

    // Fetch the appointment with all necessary associations for formatting
    const appointmentWithAssociations = await Appointment.findByPk(
      appointment.id,
      {
        include: getAppointmentIncludes(),
      }
    );

    const formattedAppointment = await formatAppointmentData(
      appointmentWithAssociations,
      {
        includePayment: true,
        includeDoctor: true,
        includePatient: true,
      }
    );

    // Send notification to patient
    await appointmentNotificationService.notifyAppointmentCreated(
      appointmentWithAssociations,
      req.authUser.patient
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
    // Only rollback if transaction hasn't been committed or rolled back
    if (transaction && !transaction.finished) {
      try {
        await transaction.rollback();
        logger.info("Transaction rolled back successfully");
      } catch (rollbackError) {
        logger.error("Error rolling back transaction:", rollbackError);
      }
    } else {
      logger.info("Transaction already finished, cannot rollback");
    }

    cleanUpFileImages(req);
    logger.error("Error creating appointment:", error);
    next(error);
  }
};

exports.getPatientAppointments = async (req, res, next) => {
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
      include: getAppointmentIncludes(),
      order: orderClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const formattedAppointments = await formatAppointmentsData(
      appointments.rows,
      {
        includePayment: true,
        includeDoctor: true,
        includePatient: true,
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
};

// Get patient appointment statistics
exports.getPatientAppointmentStats = async (req, res, next) => {
  try {
    // Check if user has a patient record
    if (!req.authUser.patient) {
      throw new BadRequestError("User is not registered as a patient");
    }

    // Validate that patientId is a valid integer
    const patientId = req.authUser.patient.id;
    if (!patientId || isNaN(parseInt(patientId))) {
      throw new BadRequestError("Invalid patient ID");
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
};
