"use strict";

const { Consultation, Appointment, Doctor, Patient, User } = require("../db/models");
const { Op } = require("sequelize");
const logger = require("../utils/logger");
const { formatImageUrl } = require("../utils/imageUtils");

class ConsultationSessionService {
  /**
   * Get active consultations for a user (doctor or patient)
   */
  async getActiveConsultationsForUser(userId, userRole) {
    try {
      const whereClause = {
        status: {
          [Op.in]: ['in_progress', 'not_started']
        }
      };

      // Build role-specific filters
      const appointmentInclude = {
        model: Appointment,
        as: "appointment",
        include: [
          {
            model: Doctor,
            as: "doctor",
            include: [{ model: User, as: "user" }]
          },
          {
            model: Patient,
            as: "patient",
            include: [{ model: User, as: "user" }]
          }
        ]
      };

      // Add user role filter to main where clause
      if (userRole === 'doctor') {
        whereClause['$appointment.doctor.user.id$'] = userId;
      } else if (userRole === 'patient') {
        whereClause['$appointment.patient.user.id$'] = userId;
      }

      const consultations = await Consultation.findAll({
        where: whereClause,
        include: [appointmentInclude],
        order: [['lastActivity', 'DESC'], ['startedAt', 'DESC'], ['createdAt', 'DESC']]
      });

      return consultations.map(consultation => {
        const consultationData = consultation.toJSON();
        
        // Ensure we have the required nested data
        if (!consultationData.appointment || 
            !consultationData.appointment.patient || 
            !consultationData.appointment.doctor ||
            !consultationData.appointment.patient.user ||
            !consultationData.appointment.doctor.user) {
          console.error('❌ Incomplete consultation data for ID:', consultation.id);
          return null;
        }

        return {
          ...consultationData,
          canRejoin: consultation.status === 'in_progress' && consultation.roomId,
          isActive: consultation.status === 'in_progress',
          // Flatten patient and doctor data for easier frontend access
          patient: {
            id: consultationData.appointment.patient.id,
            name: consultationData.appointment.patient.user.name,
            email: consultationData.appointment.patient.user.email,
            phone: consultationData.appointment.patient.user.phoneNumber,
            avatar: formatImageUrl(consultationData.appointment.patient.user.avatar),
          },
          doctor: {
            id: consultationData.appointment.doctor.id,
            name: consultationData.appointment.doctor.user.name,
            email: consultationData.appointment.doctor.user.email,
            specialty: consultationData.appointment.doctor.specialties,
            avatar: formatImageUrl(consultationData.appointment.doctor.user.avatar),
          },
          participantStatus: consultation.participantStatus || {
            doctor: { connected: false, lastSeen: null, joinedAt: null },
            patient: { connected: false, lastSeen: null, joinedAt: null }
          }
        };
      }).filter(Boolean);
    } catch (error) {
      logger.error('Error getting active consultations:', error);
      throw error;
    }
  }

  /**
   * Join a consultation session
   */
  async joinSession(consultationId, userId, userRole) {
    try {
      const consultation = await Consultation.findByPk(consultationId, {
        include: [{
          model: Appointment,
          as: "appointment",
          include: [
            { model: Doctor, as: "doctor", include: [{ model: User, as: "user" }] },
            { model: Patient, as: "patient", include: [{ model: User, as: "user" }] }
          ]
        }]
      });

      if (!consultation) {
        throw new Error('Consultation not found');
      }

      // Verify user has access to this consultation
      const doctorUserId = consultation.appointment.doctor.user.id;
      const patientUserId = consultation.appointment.patient.user.id;

      if (userId !== doctorUserId && userId !== patientUserId) {
        throw new Error('Unauthorized access to consultation');
      }

      // Update participant status
      const currentParticipantStatus = consultation.participantStatus || {
        doctor: { connected: false, lastSeen: null, joinedAt: null },
        patient: { connected: false, lastSeen: null, joinedAt: null }
      };

      const participantKey = userRole === 'doctor' ? 'doctor' : 'patient';
      currentParticipantStatus[participantKey] = {
        connected: true,
        lastSeen: new Date(),
        joinedAt: new Date()
      };

      // Update consultation
      await consultation.update({
        participantStatus: currentParticipantStatus,
        lastActivity: new Date(),
        status: consultation.status === 'not_started' ? 'in_progress' : consultation.status,
        startedAt: consultation.startedAt || new Date()
      });

      logger.info(`User ${userId} (${userRole}) joined consultation session ${consultationId}`);

      return {
        consultationId: consultation.id,
        roomId: consultation.roomId,
        status: consultation.status,
        participantStatus: currentParticipantStatus,
        canStart: true
      };
    } catch (error) {
      logger.error('Error joining consultation session:', error);
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
        throw new Error('Consultation not found');
      }

      // Update participant status
      const currentParticipantStatus = consultation.participantStatus || {
        doctor: { connected: false, lastSeen: null, joinedAt: null },
        patient: { connected: false, lastSeen: null, joinedAt: null }
      };

      const participantKey = userRole === 'doctor' ? 'doctor' : 'patient';
      currentParticipantStatus[participantKey] = {
        ...currentParticipantStatus[participantKey],
        connected: false,
        lastSeen: new Date()
      };

      // Check if both participants have left
      const bothDisconnected = !currentParticipantStatus.doctor.connected && 
                              !currentParticipantStatus.patient.connected;

      await consultation.update({
        participantStatus: currentParticipantStatus,
        lastActivity: new Date(),
        // Only end consultation if both have left and it's been running for a while
        status: bothDisconnected && consultation.status === 'in_progress' ? 'completed' : consultation.status,
        endedAt: bothDisconnected && consultation.status === 'in_progress' ? new Date() : consultation.endedAt
      });

      logger.info(`User ${userId} (${userRole}) left consultation session ${consultationId}`);

      return {
        success: true,
        bothDisconnected,
        sessionEnded: bothDisconnected
      };
    } catch (error) {
      logger.error('Error leaving consultation session:', error);
      throw error;
    }
  }

  /**
   * Get session status for a consultation
   */
  async getSessionStatus(consultationId, userId) {
    try {
      const consultation = await Consultation.findByPk(consultationId, {
        include: [{
          model: Appointment,
          as: "appointment",
          include: [
            { model: Doctor, as: "doctor", include: [{ model: User, as: "user" }] },
            { model: Patient, as: "patient", include: [{ model: User, as: "user" }] }
          ]
        }]
      });

      if (!consultation) {
        throw new Error('Consultation not found');
      }

      const doctorUserId = consultation.appointment.doctor.user.id;
      const patientUserId = consultation.appointment.patient.user.id;

      if (userId !== doctorUserId && userId !== patientUserId) {
        throw new Error('Unauthorized access to consultation');
      }

      const participantStatus = consultation.participantStatus || {
        doctor: { connected: false, lastSeen: null, joinedAt: null },
        patient: { connected: false, lastSeen: null, joinedAt: null }
      };

      return {
        consultationId: consultation.id,
        roomId: consultation.roomId,
        status: consultation.status,
        participantStatus,
        canRejoin: consultation.status === 'in_progress' && consultation.roomId,
        isActive: consultation.status === 'in_progress',
        lastActivity: consultation.lastActivity,
        duration: consultation.calculateDuration(),
        doctorInfo: {
          id: doctorUserId,
          name: consultation.appointment.doctor.user.name,
          connected: participantStatus.doctor.connected
        },
        patientInfo: {
          id: patientUserId,
          name: consultation.appointment.patient.user.name,
          connected: participantStatus.patient.connected
        }
      };
    } catch (error) {
      logger.error('Error getting session status:', error);
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
        throw new Error('Consultation not found');
      }

      const currentParticipantStatus = consultation.participantStatus || {
        doctor: { connected: false, lastSeen: null, joinedAt: null },
        patient: { connected: false, lastSeen: null, joinedAt: null }
      };

      const participantKey = userRole === 'doctor' ? 'doctor' : 'patient';
      currentParticipantStatus[participantKey] = {
        ...currentParticipantStatus[participantKey],
        connected: true,
        lastSeen: new Date()
      };

      await consultation.update({
        participantStatus: currentParticipantStatus,
        lastActivity: new Date()
      });

      return { success: true };
    } catch (error) {
      logger.error('Error updating heartbeat:', error);
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
          status: 'in_progress',
          lastActivity: {
            [Op.lt]: staleThreshold
          }
        }
      });

      for (const consultation of staleSessions) {
        const participantStatus = consultation.participantStatus || {};
        
        // Mark all participants as disconnected
        if (participantStatus.doctor) participantStatus.doctor.connected = false;
        if (participantStatus.patient) participantStatus.patient.connected = false;

        await consultation.update({
          participantStatus,
          status: 'completed',
          endedAt: new Date()
        });

        logger.info(`Cleaned up stale consultation session: ${consultation.id}`);
      }

      return staleSessions.length;
    } catch (error) {
      logger.error('Error cleaning up stale sessions:', error);
      throw error;
    }
  }
}

module.exports = new ConsultationSessionService();