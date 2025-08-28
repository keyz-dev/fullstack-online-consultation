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
  Symptom,
  Specialty,
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
const { Op } = require("sequelize");

exports.getDoctorAppointments = async (req, res, next) => {
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

    // Get doctor ID from authenticated user
    const doctorId = req.authUser.doctor.id;

    let whereClause = {
      doctorId: doctorId,
      status: ["paid", "confirmed", "in_progress", "completed"],
      paymentStatus: "paid",
    };

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
      whereClause["$patient.user.name$"] = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // Sort options
    let orderClause = [["createdAt", "DESC"]];
    if (sortBy === "date") {
      orderClause = [["createdAt", "ASC"]];
    } else if (sortBy === "patient") {
      orderClause = [["createdAt", "ASC"]];
    } else if (sortBy === "status") {
      orderClause = [["status", "ASC"]];
    }

    const appointments = await Appointment.findAndCountAll({
      where: whereClause,
      include: getAppointmentIncludes(true, true, false), // Don't include doctor since we're filtering by doctor
      order: orderClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const formattedAppointments = await formatAppointmentsData(
      appointments.rows,
      {
        includePayment: true,
        includeDoctor: false, // Don't include doctor since we're filtering by doctor
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
    logger.error("Error fetching doctor appointments:", error);
    next(error);
  }
};

// Get doctor appointment statistics
exports.getDoctorAppointmentStats = async (req, res, next) => {
  try {
    const doctorId = req.authUser.doctor.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get all appointments for the doctor using direct doctorId relationship
    const allAppointments = await Appointment.findAll({
      where: {
        doctorId: doctorId,
        status: ["paid", "confirmed", "in_progress", "completed"], // Only count active appointments
        paymentStatus: "paid",
      },
      include: [
        {
          model: TimeSlot,
          as: "timeSlot",
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
          (apt.status === "confirmed" || apt.status === "paid")
        );
      }).length,
      thisWeek: allAppointments.filter((apt) => {
        const aptDate = new Date(apt.timeSlot.date);
        return (
          aptDate >= startOfWeek &&
          (apt.status === "confirmed" || apt.status === "paid")
        );
      }).length,
      thisMonth: allAppointments.filter((apt) => {
        const aptDate = new Date(apt.timeSlot.date);
        return (
          aptDate >= startOfMonth &&
          (apt.status === "confirmed" || apt.status === "paid")
        );
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
};
