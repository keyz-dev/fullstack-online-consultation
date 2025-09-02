"use strict";

const {
  Consultation,
  ConsultationMessage,
  Appointment,
  User,
  Doctor,
  Patient,
  Specialty,
} = require("../db/models");
const crypto = require("crypto");
const { getIO } = require("../sockets");
const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require("../utils/errors");
const { formatImageUrl } = require("../utils/imageUtils");
const {
  formatConsultationData,
  formatConsultationListResponse,
} = require("../utils/returnFormats/consultationData");
const ConsultationSessionService = require("../services/consultationSessionService");
const consultationSessionService = require("../services/consultationSessionService");

class ConsultationController {
  /**
   * @desc    Get consultation messages
   * @route   GET /api/v1/consultations/:id/messages
   * @access  Private (Doctor/Patient)
   */
  async getConsultationMessages(req, res, next) {
    try {
      const { id } = req.params;

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
      });

      res.status(200).json({
        success: true,
        data: {
          messages: messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            sender: msg.sender.name,
            senderType: msg.senderType,
            type: msg.type,
            timestamp: msg.createdAt,
            fileUrl: msg.fileUrl ? formatImageUrl(msg.fileUrl) : null,
            fileName: msg.fileName,
            fileSize: msg.fileSize,
            mimeType: msg.mimeType,
          })),
        },
      });
    } catch (error) {
      console.error("Error fetching consultation messages:", error);
      return next(new Error("Failed to fetch consultation messages"));
    }
  }

  /**
   * @desc    Upload file for consultation
   * @route   POST /api/v1/consultations/:id/upload
   * @access  Private (Doctor/Patient)
   */
  async uploadConsultationFile(req, res, next) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return next(new BadRequestError("No file uploaded"));
      }

      const file = req.file;

      // Save file message to database (file.path is already formatted by multer middleware)
      const savedMessage = await ConsultationMessage.create({
        consultationId: parseInt(id),
        senderId: req.authUser.id,
        senderType: req.authUser.role === "doctor" ? "doctor" : "patient",
        type: file.mimetype.startsWith("image/") ? "image" : "file",
        content: `Shared ${file.originalname}`,
        fileUrl: file.path, // Use the path from multer (already formatted)
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        metadata: {
          uploadedAt: new Date().toISOString(),
        },
      });

      // Get consultation for room info
      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        return next(new NotFoundError("Consultation not found"));
      }

      // Format the file URL for serving
      const formattedFileUrl = formatImageUrl(file.path);

      // Emit file share event to room
      const { getIO } = require("../sockets");
      const io = getIO();
      io.in(consultation.roomId).emit("file_shared", {
        id: savedMessage.id,
        fileName: file.originalname,
        fileUrl: formattedFileUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: req.authUser.name,
        uploadedByType: req.authUser.role,
        timestamp: savedMessage.createdAt,
        consultationId: id,
      });

      res.status(200).json({
        success: true,
        data: {
          id: savedMessage.id,
          fileName: file.originalname,
          fileUrl: formattedFileUrl,
          fileSize: file.size,
          mimeType: file.mimetype,
          message: "File uploaded successfully",
        },
      });
    } catch (error) {
      console.error("Error uploading consultation file:", error);
      return next(new Error("Failed to upload file"));
    }
  }

  /**
   * @desc    Update consultation notes
   * @route   PUT /api/v1/consultations/:id
   * @access  Private (Doctor)
   */
  async updateConsultationNotes(req, res, next) {
    try {
      const { id } = req.params;
      const { notes, diagnosis } = req.body;

      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        return next(new NotFoundError("Consultation not found"));
      }

      // Update consultation notes
      if (notes !== undefined) consultation.notes = notes;
      if (diagnosis !== undefined) consultation.diagnosis = diagnosis;

      await consultation.save();

      res.status(200).json({
        success: true,
        data: {
          id: consultation.id,
          notes: consultation.notes,
          diagnosis: consultation.diagnosis,
          message: "Consultation updated successfully",
        },
      });
    } catch (error) {
      console.error("Error updating consultation:", error);
      return next(new Error("Failed to update consultation"));
    }
  }

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
                  {
                    model: Specialty,
                    as: "specialties",
                    through: { attributes: [] }, // Exclude junction table attributes
                  },
                ],
              },
              {
                model: require("../db/models").TimeSlot,
                as: "timeSlot",
                attributes: ["id", "date", "startTime", "endTime"],
              },
            ],
          },
        ],
      });

      if (!consultation) {
        return next(new NotFoundError("Consultation not found"));
      }

      // Allow re-initiation for in_progress consultations (in case of disconnection)
      if (consultation.status == "no_show") {
        return next(
          new BadRequestError(
            `Cannot initiate call for a consultation with status '${consultation.status}'.`
          )
        );
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

      // Generate room ID if not exists
      if (!consultation.roomId) {
        consultation.roomId = crypto.randomBytes(16).toString("hex");
      }

      // Only update status and startedAt if not already in progress
      if (consultation.status === "not_started") {
        consultation.status = "in_progress";
        consultation.startedAt = new Date();
        await consultation.save();
      }

      const callData = {
        consultationId: consultation.id,
        roomId: consultation.roomId,
        doctorUserId: consultation.appointment.doctor.user.id,
        doctorName: consultation.appointment.doctor.user.name,
        doctorSpecialty:
          consultation.appointment.doctor.specialties &&
          consultation.appointment.doctor.specialties.length > 0
            ? consultation.appointment.doctor.specialties[0].name
            : "General Practice",
        appointmentDate: consultation.appointment.timeSlot.date,
        appointmentTime: `${consultation.appointment.timeSlot.startTime} - ${consultation.appointment.timeSlot.endTime}`,
        patientName: consultation.appointment.patient.user.name,
      };

      const patientUserId = consultation.appointment.patient.user.id;
      console.log(
        `📞 Emitting video:call-initiated to user-${patientUserId}:`,
        callData
      );

      // Check if patient is connected
      const allSockets = await io.fetchSockets();
      const connectedPatientSocket = allSockets.find(
        (s) => s.userId === patientUserId
      );
      console.log(
        `🔍 Patient ${patientUserId} socket found:`,
        !!connectedPatientSocket
      );
      if (connectedPatientSocket) {
        console.log(
          `🏠 Patient socket rooms:`,
          Array.from(connectedPatientSocket.rooms)
        );
      }

      io.to(`user-${patientUserId}`).emit("video:call-initiated", callData);

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
   * @desc    Reset/Cancel a consultation (for stuck consultations)
   * @route   POST /api/v1/consultations/:id/reset
   * @access  Private (Doctor)
   */
  async resetConsultation(req, res, next) {
    try {
      const { id } = req.params;

      const consultation = await Consultation.findByPk(id, {
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
                    attributes: ["id", "name"],
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

      // Only allow doctor to reset their own consultations
      if (consultation.appointment.doctor.user.id !== req.authUser.id) {
        return next(
          new ForbiddenError(
            "You are not authorized to reset this consultation."
          )
        );
      }

      // Reset consultation to allow re-initiation
      consultation.status = "not_started";
      consultation.roomId = null;
      consultation.startedAt = null;
      await consultation.save();

      res.status(200).json({
        success: true,
        message: "Consultation has been reset and can be initiated again.",
        data: {
          consultationId: consultation.id,
          status: consultation.status,
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
      if (status && status !== "all") whereClause.status = status;
      if (type && type !== "all") whereClause.type = type;

      // Build appointment filter based on user role
      let appointmentWhere = {};
      if (appointmentId) {
        appointmentWhere = {
          "$appointment.id$": appointmentId,
        };
      }

      console.log("Appointment where: ", appointmentWhere);
      const formattedConsultations =
        await consultationSessionService.getAllUserConsultations(
          whereClause,
          appointmentWhere,
          page,
          limit,
          offset,
          {
            includeAppointment: true,
            includePatient: true,
            includeDoctor: true,
          }
        );

      res.status(200).json({
        success: true,
        data: formattedConsultations,
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

      // Format consultation data using the utility
      const formattedConsultation = formatConsultationData(consultation, {
        includeAppointment: true,
        includePatient: true,
        includeDoctor: true,
      });

      res.status(200).json({
        success: true,
        data: formattedConsultation,
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
      const isDoctor =
        consultation.appointment.doctor.user.id === req.authUser.id;
      const isPatient =
        consultation.appointment.patient.user.id === req.authUser.id;

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
      const isDoctor =
        consultation.appointment.doctor.user.id === req.authUser.id;
      const isPatient =
        consultation.appointment.patient.user.id === req.authUser.id;

      if (!isDoctor && !isPatient) {
        return next(
          new ForbiddenError(
            "You are not authorized to send messages in this consultation"
          )
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

  /**
   * @desc    Join consultation session
   * @route   POST /api/v1/consultations/:id/join
   * @access  Private (Doctor/Patient)
   */
  async joinConsultationSession(req, res, next) {
    try {
      const consultationId = req.params.id;
      const userId = req.authUser.id;
      const userRole = req.authUser.role;

      const sessionData = await ConsultationSessionService.joinSession(
        consultationId,
        userId,
        userRole
      );

      res.status(200).json({
        success: true,
        message: "Successfully joined consultation session",
        data: sessionData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Leave consultation session
   * @route   POST /api/v1/consultations/:id/leave
   * @access  Private (Doctor/Patient)
   */
  async leaveConsultationSession(req, res, next) {
    try {
      const consultationId = req.params.id;
      const userId = req.authUser.id;
      const userRole = req.authUser.role;

      await ConsultationSessionService.leaveSession(
        consultationId,
        userId,
        userRole
      );

      res.status(200).json({
        success: true,
        message: "Successfully left consultation session",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get consultation session status
   * @route   GET /api/v1/consultations/:id/session-status
   * @access  Private (Doctor/Patient)
   */
  async getConsultationSessionStatus(req, res, next) {
    try {
      const consultationId = req.params.id;
      const userId = req.authUser.id;

      const sessionStatus = await ConsultationSessionService.getSessionStatus(
        consultationId,
        userId
      );

      res.status(200).json({
        success: true,
        data: sessionStatus,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update consultation session heartbeat
   * @route   POST /api/v1/consultations/:id/heartbeat
   * @access  Private (Doctor/Patient)
   */
  async updateSessionHeartbeat(req, res, next) {
    try {
      const { id } = req.params;
      const { isConnected } = req.body;

      // Update consultation session heartbeat
      await ConsultationSessionService.updateSessionHeartbeat(
        id,
        req.authUser.id,
        isConnected
      );

      res.status(200).json({
        success: true,
        message: "Heartbeat updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel a consultation
   * @route   POST /api/v1/consultations/:id/cancel
   * @access  Private (Doctor only)
   */
  async cancelConsultation(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      // Find the consultation
      const consultation = await Consultation.findByPk(id, {
        include: [
          {
            model: Appointment,
            as: "appointment",
            include: [
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

      // Check if the authenticated user is the doctor assigned to this consultation
      if (consultation.appointment.doctor.user.id !== req.authUser.id) {
        return next(
          new ForbiddenError(
            "You are not authorized to cancel this consultation"
          )
        );
      }

      // Update consultation status to cancelled
      await consultation.update({
        status: "cancelled",
        endedAt: new Date(),
        notes: reason ? `Cancelled: ${reason}` : "Cancelled by doctor",
      });

      res.status(200).json({
        success: true,
        message: "Consultation cancelled successfully",
        data: {
          consultationId: consultation.id,
          status: consultation.status,
          cancelledAt: consultation.endedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConsultationController();
