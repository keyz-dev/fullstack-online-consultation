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
} = require("../utils/returnFormats/consultationData");

class PatientConsultationService {
  /**
   * Get consultations for a specific patient with proper isolation
   */
  async getPatientConsultations(patientUserId, options = {}) {
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

      // Build appointment filter - CRITICAL: Only show consultations for this patient
      const appointmentWhere = {
        "$appointment.patient.user.id$": patientUserId, // Ensure patient isolation
      };

      if (appointmentId) {
        appointmentWhere["$appointment.id$"] = appointmentId;
      }

      // Count total consultations for this patient only
      const count = await Consultation.count({
        where: {
          ...whereClause,
          ...appointmentWhere,
        },
        include: [
          {
            model: Appointment,
            as: "appointment",
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
                    through: { attributes: [] },
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
          },
        ],
      });

      // Find consultations for this patient only
      const consultations = await Consultation.findAll({
        where: {
          ...whereClause,
          ...appointmentWhere,
        },
        include: [
          {
            model: Appointment,
            as: "appointment",
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
                    through: { attributes: [] },
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
  async getPatientActiveConsultations(patientUserId) {
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
              // Filter by patient ID at the appointment level
              patientId: patientUserId,
            },
            include: [
              {
                model: Doctor,
                as: "doctor",
                include: [{ model: User, as: "user" }],
              },
              {
                model: Patient,
                as: "patient",
                include: [{ model: User, as: "user" }],
              },
            ],
          },
        ],
        order: [
          ["lastActivity", "DESC"],
          ["startedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
      });

      return consultations;
    } catch (error) {
      logger.error("Error getting patient active consultations:", error);
      throw error;
    }
  }

  /**
   * Get consultation statistics for a specific patient
   */
  async getPatientConsultationStats(patientUserId) {
    try {
      const totalConsultations = await Consultation.count({
        include: [
          {
            model: Appointment,
            as: "appointment",
            where: {
              // Filter by patient ID at the appointment level
              patientId: patientUserId,
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
              patientId: patientUserId,
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
          ...appointmentWhere,
        },
        include: [
          {
            model: Appointment,
            as: "appointment",
            include: [
              {
                model: Doctor,
                as: "doctor",
                include: [{ model: User, as: "user" }],
              },
              {
                model: Patient,
                as: "patient",
                include: [{ model: User, as: "user" }],
              },
            ],
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
