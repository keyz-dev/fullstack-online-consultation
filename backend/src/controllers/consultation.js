"use strict";

const {
  Consultation,
  ConsultationMessage,
  Appointment,
  User,
  Doctor,
  Patient,
} = require("../db/models");
const crypto = require("crypto");
const { getIO } = require("../sockets");
const { NotFoundError, ForbiddenError } = require("../utils/errors");

class ConsultationController {
  /**
   * @desc    Initiate a video call for a consultation
   * @route   POST /api/v1/consultations/:id/initiate
   * @access  Private (Doctor)
   */
  async initiateCall(req, res, next) {
    try {
      const { id } = req.params;

      const consultation = await Consultation.findByPk(id, {
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
                    attributes: ["id", "name", "email"],
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
                ],
              },
            ],
          },
        ],
      });

      if (!consultation) {
        return next(new NotFoundError("Consultation not found"));
      }

      if (consultation.appointment.doctor.user.id !== req.authUser.id) {
        return next(
          new ForbiddenError(
            "You are not authorized to start this consultation."
          )
        );
      }

      if (consultation.status !== "not_started") {
        return res.status(400).json({
          success: false,
          message: `Cannot initiate call for a consultation with status '${consultation.status}'.`,
        });
      }

      const io = getIO();
      const patientSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => s.userId === consultation.appointment.patient.user.id
      );

      if (!patientSocket) {
        return res.status(200).json({
          success: true,
          patientOnline: false,
          message: "Patient is not currently online. You can try again later.",
          patientContact: {
            email: consultation.appointment.patient.user.email,
          },
        });
      }

      if (!consultation.roomId) {
        consultation.roomId = crypto.randomBytes(16).toString("hex");
      }

      consultation.status = "in_progress";
      consultation.startedAt = new Date();
      await consultation.save();

      io.to(`user-${consultation.appointment.patient.user.id}`).emit(
        "video:incoming-call",
        {
          roomId: consultation.roomId,
          consultationId: consultation.id,
          caller: {
            name: consultation.appointment.doctor.user.name,
            avatar: consultation.appointment.doctor.user.avatar,
          },
        }
      );

      return res.status(200).json({
        success: true,
        patientOnline: true,
        message: "Call initiated. Waiting for the patient to respond.",
        data: {
          roomId: consultation.roomId,
          consultationId: consultation.id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get consultations for the authenticated user
   * @route   GET /api/v1/consultations
   * @access  Private
   */
  async getConsultations(req, res, next) {
    try {
      const { page = 1, limit = 10, status, type, appointmentId } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;

      // Build appointment filter based on user role
      let appointmentWhere = {};
      if (appointmentId) {
        appointmentWhere = {
          "$appointment.id$": appointmentId,
        };
      }

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
                ],
              },
            ],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        data: {
          consultations,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get single consultation by ID
   * @route   GET /api/v1/consultations/:id
   * @access  Private
   */
  async getConsultation(req, res, next) {
    try {
      const { id } = req.params;

      const consultation = await Consultation.findByPk(id, {
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
                ],
              },
            ],
          },
        ],
      });

      if (!consultation) {
        return next(new NotFoundError("Consultation not found"));
      }

      // Check authorization
      const isDoctor =
        consultation.appointment.doctor.user.id === req.authUser.id;
      const isPatient =
        consultation.appointment.patient.user.id === req.authUser.id;

      if (!isDoctor && !isPatient) {
        return next(
          new ForbiddenError("You are not authorized to view this consultation")
        );
      }

      res.status(200).json({
        success: true,
        data: consultation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get messages for a consultation
   * @route   GET /api/v1/consultations/:id/messages
   * @access  Private
   */
  async getMessages(req, res, next) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      // First, get and verify the consultation
      const consultation = await Consultation.findByPk(id, {
        include: [
          {
            model: Appointment,
            as: "appointment",
            include: [
              {
                model: Patient,
                as: "patient",
                include: [{ model: User, as: "user", attributes: ["id"] }],
              },
              {
                model: Doctor,
                as: "doctor", 
                include: [{ model: User, as: "user", attributes: ["id"] }],
              },
            ],
          },
        ],
      });

      if (!consultation) {
        return next(new NotFoundError("Consultation not found"));
      }

      // Check authorization
      const isDoctor = consultation.appointment.doctor.user.id === req.authUser.id;
      const isPatient = consultation.appointment.patient.user.id === req.authUser.id;

      if (!isDoctor && !isPatient) {
        return next(
          new ForbiddenError("You are not authorized to view these messages")
        );
      }

      // Get messages
      const messages = await ConsultationMessage.findAll({
        where: { consultationId: id },
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "name", "avatar"],
          },
        ],
        order: [["createdAt", "ASC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      // Count total messages
      const totalMessages = await ConsultationMessage.count({
        where: { consultationId: id },
      });

      res.status(200).json({
        success: true,
        data: {
          messages,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalMessages / limit),
            totalItems: totalMessages,
            itemsPerPage: parseInt(limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Send a message in a consultation
   * @route   POST /api/v1/consultations/:id/messages
   * @access  Private
   */
  async sendMessage(req, res, next) {
    try {
      const { id } = req.params;
      const { content, type = "text" } = req.body;

      // Verify the consultation exists and user has access
      const consultation = await Consultation.findByPk(id, {
        include: [
          {
            model: Appointment,
            as: "appointment",
            include: [
              {
                model: Patient,
                as: "patient",
                include: [{ model: User, as: "user", attributes: ["id"] }],
              },
              {
                model: Doctor,
                as: "doctor",
                include: [{ model: User, as: "user", attributes: ["id"] }],
              },
            ],
          },
        ],
      });

      if (!consultation) {
        return next(new NotFoundError("Consultation not found"));
      }

      // Check authorization
      const isDoctor = consultation.appointment.doctor.user.id === req.authUser.id;
      const isPatient = consultation.appointment.patient.user.id === req.authUser.id;

      if (!isDoctor && !isPatient) {
        return next(
          new ForbiddenError("You are not authorized to send messages in this consultation")
        );
      }

      // Determine sender type
      const senderType = isDoctor ? "doctor" : "patient";

      // Create message
      const message = await ConsultationMessage.create({
        consultationId: id,
        senderId: req.authUser.id,
        senderType,
        type,
        content,
      });

      // Include sender info in response
      const messageWithSender = await ConsultationMessage.findByPk(message.id, {
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "name", "avatar"],
          },
        ],
      });

      // Emit to room via socket
      const io = getIO();
      io.to(consultation.roomId).emit("chat_message", messageWithSender);

      res.status(201).json({
        success: true,
        data: messageWithSender,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConsultationController();
