"use strict";

const {
  Consultation,
  Appointment,
  Doctor,
  Patient,
  User,
  Specialty,
} = require("../db/models");
const { Op, sequelize } = require("sequelize");
const logger = require("../utils/logger");
const {
  formatConsultationListResponse,
  formatConsultationsData,
} = require("../utils/returnFormats/consultationData");
const { appointmentIncludes } = require("../utils/consultationIncludes");

class DoctorConsultationService {
  /**
   * Get consultations for a specific doctor with proper isolation
   */
  async getDoctorConsultations(doctorId, options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      appointmentId,
      includeAppointment = true,
      includePatient = true,
      includeDoctor = true,
    } = options;

    try {
      const offset = (page - 1) * limit;

      // Build where clause with doctor isolation
      const whereClause = {};
      if (status && status !== "all") whereClause.status = status;
      if (type && type !== "all") whereClause.type = type;

      if (appointmentId) {
        whereClause.appointmentId = appointmentId;
      }

      // Count total consultations for this doctor only
      const count = await Consultation.count({
        where: {
          ...whereClause,
        },
        include: [
          {
            model: Appointment,
            as: "appointment",
            where: {
              doctorId: doctorId,
            },
            include: appointmentIncludes,
          },
        ],
      });

      // Find consultations for this doctor only
      const consultations = await Consultation.findAll({
        where: {
          ...whereClause,
        },
        include: [
          {
            model: Appointment,
            as: "appointment",
            where: {
              doctorId: doctorId,
            },
            include: appointmentIncludes,
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
      });

      // Format consultations using the utility
      const formattedConsultations = formatConsultationListResponse(
        consultations,
        {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
        {
          includeAppointment,
          includePatient,
          includeDoctor,
        }
      );

      return formattedConsultations;
    } catch (error) {
      logger.error("Error getting doctor consultations:", error);
      throw error;
    }
  }

  /**
   * Get active consultations for a specific doctor
   */
  async getDoctorActiveConsultations(doctorId) {
    try {
      const whereClause = {
        status: {
          [Op.in]: ["in_progress", "not_started"],
        },
      };

      const consultations = await Consultation.findAll({
        where: whereClause,
        include: [
          {
            model: Appointment,
            as: "appointment",
            where: {
              // Filter by doctor ID at the appointment level
              doctorId: doctorId,
            },
            include: appointmentIncludes,
          },
        ],
        order: [
          ["lastActivity", "DESC"],
          ["startedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
      });

      const formattedConsultations = formatConsultationsData(consultations, {
        includeAppointment: true,
        includePatient: true,
        includeDoctor: true,
      });

      return formattedConsultations;
    } catch (error) {
      logger.error("Error getting doctor active consultations:", error);
      throw error;
    }
  }

  /**
   * Get consultation statistics for a specific doctor
   */
  async getDoctorConsultationStats(doctorId) {
    try {
      const totalConsultations = await Consultation.count({
        include: [
          {
            model: Appointment,
            as: "appointment",
            where: {
              doctorId,
            },
            include: [
              {
                model: Doctor,
                as: "doctor",
                include: [{ model: User, as: "user" }],
              },
            ],
          },
        ],
      });

      const statusCounts = await Consultation.findAll({
        include: [
          {
            model: Appointment,
            as: "appointment",
            where: {
              doctorId,
            },
            include: [
              {
                model: Doctor,
                as: "doctor",
                include: [{ model: User, as: "user" }],
              },
            ],
          },
        ],
        attributes: [
          "status",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        group: ["status"],
      });

      const stats = {
        total: totalConsultations,
        byStatus: {},
        recentActivity: [],
      };

      statusCounts.forEach((item) => {
        stats.byStatus[item.status] = parseInt(item.dataValues.count);
      });

      // Get recent consultations for activity tracking
      const recentConsultations = await Consultation.findAll({
        include: [
          {
            model: Appointment,
            as: "appointment",
            where: {
              doctorId,
            },
            include: appointmentIncludes,
          },
        ],
        limit: 5,
        order: [["updatedAt", "DESC"]],
      });

      stats.recentActivity = recentConsultations.map((consultation) => ({
        id: consultation.id,
        status: consultation.status,
        patientName: consultation.appointment?.patient?.user?.name || "Unknown",
        updatedAt: consultation.updatedAt,
      }));

      return stats;
    } catch (error) {
      logger.error("Error getting doctor consultation stats:", error);
      throw error;
    }
  }
}

module.exports = new DoctorConsultationService();
