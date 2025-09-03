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

class PatientConsultationService {
  /**
   * Get consultations for a specific patient with proper isolation
   */
  async getPatientConsultations(patientId, options = {}) {
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

      // Build where clause with patient isolation
      const whereClause = {};
      if (status && status !== "all") whereClause.status = status;
      if (type && type !== "all") whereClause.type = type;

      if (appointmentId) {
        whereClause.appointmentId = appointmentId;
      }

      // Count total consultations for this patient only
      const count = await Consultation.count({
        where: {
          ...whereClause,
        },
        include: [
          {
            model: Appointment,
            as: "appointment",
            where: {
              patientId,
            },
            include: appointmentIncludes,
          },
        ],
      });

      // Find consultations for this patient only
      const consultations = await Consultation.findAll({
        where: {
          ...whereClause,
        },
        include: [
          {
            model: Appointment,
            as: "appointment",
            where: {
              patientId,
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
      logger.error("Error getting patient consultations:", error);
      throw error;
    }
  }

  /**
   * Get active consultations for a specific patient
   */
  async getPatientActiveConsultations(patientId) {
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
              patientId,
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
      logger.error("Error getting patient active consultations:", error);
      throw error;
    }
  }

  /**
   * Get consultation statistics for a specific patient
   */
  async getPatientConsultationStats(patientId) {
    try {
      const totalConsultations = await Consultation.count({
        include: [
          {
            model: Appointment,
            as: "appointment",
            where: {
              patientId,
            },
            include: [
              {
                model: Patient,
                as: "patient",
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
              // Filter by patient ID at the appointment level
              patientId,
            },
            include: [
              {
                model: Patient,
                as: "patient",
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
        where: {
          ...whereClause,
        },
        include: [
          {
            model: Appointment,
            as: "appointment",
            where: { patientId },
            include: appointmentIncludes,
          },
        ],
        limit: 5,
        order: [["updatedAt", "DESC"]],
      });

      stats.recentActivity = recentConsultations.map((consultation) => ({
        id: consultation.id,
        status: consultation.status,
        doctorName: consultation.appointment?.doctor?.user?.name || "Unknown",
        updatedAt: consultation.updatedAt,
      }));

      return stats;
    } catch (error) {
      logger.error("Error getting patient consultation stats:", error);
      throw error;
    }
  }
}

module.exports = new PatientConsultationService();
