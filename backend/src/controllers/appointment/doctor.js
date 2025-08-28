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
    logger.error("Error fetching doctor appointments:", error);
    next(error);
  }
};

// Get doctor appointment statistics
exports.getDoctorAppointmentStats = async (req, res, next) => {
  try {
    // Check if user has a doctor record
    if (!req.authUser.doctor) {
      // Try to load the doctor record explicitly
      const userWithDoctor = await User.findByPk(req.authUser.id, {
        include: [
          {
            model: Doctor,
            as: "doctor",
          },
        ],
      });

      if (!userWithDoctor || !userWithDoctor.doctor) {
        throw new BadRequestError("User is not registered as a doctor");
      }

      // Update the authUser with the loaded doctor data
      req.authUser = userWithDoctor;
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
};
