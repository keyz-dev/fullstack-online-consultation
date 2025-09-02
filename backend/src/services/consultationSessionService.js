"use strict";

const {
  Consultation,
  Appointment,
  Doctor,
  Patient,
  User,
  Specialty,
} = require("../db/models");
const { Op } = require("sequelize");
const logger = require("../utils/logger");
const {
  formatConsultationListResponse,
} = require("../utils/returnFormats/consultationData");

class ConsultationSessionService {
  /**
   * Get all consultations for a user, doctor, patient, or admin
   */

  async getAllUserConsultations(
    whereClause = {},
    appointmentWhere = {},
    page = 1,
    limit = 10,
    offset,
    userIncludeOptions = {
      includeAppointment: true,
      includePatient: true,
      includeDoctor: true,
    }
  ) {
    // Count total consultations
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
              model: Patient,
              as: "patient",
            },
            {
              model: Doctor,
              as: "doctor",
            },
          ],
        },
      ],
    });

    // Find consultations with full data
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
              model: Doctor,
              as: "doctor",
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "name", "avatar"],
                },
                {
                  model: Specialty,
                  as: "specialties",
                  through: { attributes: [] }, // Exclude junction table attributes
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

    // Format consultations data using the utility
    const formattedConsultations = formatConsultationListResponse(
      consultations,
      {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
      userIncludeOptions
    );

    return formattedConsultations;
  }

  /**
   * Join a consultation session
   */
  async joinSession(consultationId, userId, userRole) {
    try {
      const consultation = await Consultation.findByPk(consultationId, {
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
      });

      if (!consultation) {
        throw new Error("Consultation not found");
      }

      // Verify user has access to this consultation
      const doctorUserId = consultation.appointment.doctor.user.id;
      const patientUserId = consultation.appointment.patient.user.id;

      if (userId !== doctorUserId && userId !== patientUserId) {
        throw new Error("Unauthorized access to consultation");
      }

      // Update participant status
      const currentParticipantStatus = consultation.participantStatus || {
        doctor: { connected: false, lastSeen: null, joinedAt: null },
        patient: { connected: false, lastSeen: null, joinedAt: null },
      };

      const participantKey = userRole === "doctor" ? "doctor" : "patient";
      currentParticipantStatus[participantKey] = {
        connected: true,
        lastSeen: new Date(),
        joinedAt: new Date(),
      };

      // Only set in_progress when BOTH parties have joined
      const bothJoined =
        currentParticipantStatus.doctor.connected &&
        currentParticipantStatus.patient.connected;

      // Update consultation
      await consultation.update({
        participantStatus: currentParticipantStatus,
        lastActivity: new Date(),
        status: bothJoined ? "in_progress" : consultation.status,
        startedAt: bothJoined
          ? consultation.startedAt || new Date()
          : consultation.startedAt,
      });

      logger.info(
        `User ${userId} (${userRole}) joined consultation session ${consultationId}`
      );

      return {
        consultationId: consultation.id,
        roomId: consultation.roomId,
        status: consultation.status,
        participantStatus: currentParticipantStatus,
        canStart: true,
      };
    } catch (error) {
      logger.error("Error joining consultation session:", error);
      throw error;
    }
  }

  /**
   * Leave a consultation session
   */
  async leaveSession(consultationId, userId, userRole) {
    try {
      const consultation = await Consultation.findByPk(consultationId);

      if (!consultation) {
        throw new Error("Consultation not found");
      }

      // Update participant status
      const currentParticipantStatus = consultation.participantStatus || {
        doctor: { connected: false, lastSeen: null, joinedAt: null },
        patient: { connected: false, lastSeen: null, joinedAt: null },
      };

      const participantKey = userRole === "doctor" ? "doctor" : "patient";
      currentParticipantStatus[participantKey] = {
        ...currentParticipantStatus[participantKey],
        connected: false,
        lastSeen: new Date(),
      };

      // Check if both participants have left
      const bothDisconnected =
        !currentParticipantStatus.doctor.connected &&
        !currentParticipantStatus.patient.connected;

      await consultation.update({
        participantStatus: currentParticipantStatus,
        lastActivity: new Date(),
        // Only end consultation if both have left and it's been running for a while
        status:
          bothDisconnected && consultation.status === "in_progress"
            ? "completed"
            : consultation.status,
        endedAt:
          bothDisconnected && consultation.status === "in_progress"
            ? new Date()
            : consultation.endedAt,
      });

      logger.info(
        `User ${userId} (${userRole}) left consultation session ${consultationId}`
      );

      return {
        success: true,
        bothDisconnected,
        sessionEnded: bothDisconnected,
      };
    } catch (error) {
      logger.error("Error leaving consultation session:", error);
      throw error;
    }
  }

  /**
   * Get session status for a consultation
   */
  async getSessionStatus(consultationId, userId) {
    try {
      const consultation = await Consultation.findByPk(consultationId, {
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
      });

      if (!consultation) {
        throw new Error("Consultation not found");
      }

      const doctorUserId = consultation.appointment.doctor.user.id;
      const patientUserId = consultation.appointment.patient.user.id;

      if (userId !== doctorUserId && userId !== patientUserId) {
        throw new Error("Unauthorized access to consultation");
      }

      const participantStatus = consultation.participantStatus || {
        doctor: { connected: false, lastSeen: null, joinedAt: null },
        patient: { connected: false, lastSeen: null, joinedAt: null },
      };

      return {
        consultationId: consultation.id,
        roomId: consultation.roomId,
        status: consultation.status,
        participantStatus,
        canRejoin: consultation.status === "in_progress" && consultation.roomId,
        isActive: consultation.status === "in_progress",
        lastActivity: consultation.lastActivity,
        duration: consultation.calculateDuration(),
        doctorInfo: {
          id: doctorUserId,
          name: consultation.appointment.doctor.user.name,
          connected: participantStatus.doctor.connected,
        },
        patientInfo: {
          id: patientUserId,
          name: consultation.appointment.patient.user.name,
          connected: participantStatus.patient.connected,
        },
      };
    } catch (error) {
      logger.error("Error getting session status:", error);
      throw error;
    }
  }

  /**
   * Update heartbeat for session presence
   */
  async updateHeartbeat(consultationId, userId, userRole) {
    try {
      const consultation = await Consultation.findByPk(consultationId);

      if (!consultation) {
        throw new Error("Consultation not found");
      }

      const currentParticipantStatus = consultation.participantStatus || {
        doctor: { connected: false, lastSeen: null, joinedAt: null },
        patient: { connected: false, lastSeen: null, joinedAt: null },
      };

      const participantKey = userRole === "doctor" ? "doctor" : "patient";
      currentParticipantStatus[participantKey] = {
        ...currentParticipantStatus[participantKey],
        connected: true,
        lastSeen: new Date(),
      };

      await consultation.update({
        participantStatus: currentParticipantStatus,
        lastActivity: new Date(),
      });

      return { success: true };
    } catch (error) {
      logger.error("Error updating heartbeat:", error);
      throw error;
    }
  }

  /**
   * Clean up stale sessions (to be called periodically)
   */
  async cleanupStaleSessions() {
    try {
      const staleThreshold = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago

      const staleSessions = await Consultation.findAll({
        where: {
          status: "in_progress",
          lastActivity: {
            [Op.lt]: staleThreshold,
          },
        },
      });

      for (const consultation of staleSessions) {
        const participantStatus = consultation.participantStatus || {};

        // Mark all participants as disconnected
        if (participantStatus.doctor)
          participantStatus.doctor.connected = false;
        if (participantStatus.patient)
          participantStatus.patient.connected = false;

        await consultation.update({
          participantStatus,
          status: "completed",
          endedAt: new Date(),
        });

        logger.info(
          `Cleaned up stale consultation session: ${consultation.id}`
        );
      }

      return staleSessions.length;
    } catch (error) {
      logger.error("Error cleaning up stale sessions:", error);
      throw error;
    }
  }
}

module.exports = new ConsultationSessionService();
