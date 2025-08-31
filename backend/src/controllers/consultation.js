"use strict";

const {
  Consultation,
  Appointment,
  User,
  Doctor,
  Patient,
} = require("../db/models");
const crypto = require("crypto");
const { getIO } = require("../sockets");
const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require("../utils/errors");

class ConsultationController {
  /**
   * @desc    Get consultation messages
   * @route   GET /api/v1/consultations/:id/messages
   * @access  Private (Doctor/Patient)
   */
  async getConsultationMessages(req, res, next) {
    try {
      const { id } = req.params;
      const { ConsultationMessage } = require("../db/models");
      const { formatImageUrl } = require("../utils/imageUtils");

      const messages = await ConsultationMessage.findAll({
        where: { consultationId: id },
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "name", "avatar"]
          }
        ],
        order: [["createdAt", "ASC"]]
      });

      res.status(200).json({
        success: true,
        data: {
          messages: messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender: msg.sender.name,
            senderType: msg.senderType,
            type: msg.type,
            timestamp: msg.createdAt,
            fileUrl: msg.fileUrl ? formatImageUrl(msg.fileUrl) : null,
            fileName: msg.fileName,
            fileSize: msg.fileSize,
            mimeType: msg.mimeType
          }))
        }
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
      const { ConsultationMessage } = require("../db/models");
      const { formatImageUrl } = require("../utils/imageUtils");
      
      if (!req.file) {
        return next(new BadRequestError("No file uploaded"));
      }

      const file = req.file;

      // Save file message to database (file.path is already formatted by multer middleware)
      const savedMessage = await ConsultationMessage.create({
        consultationId: parseInt(id),
        senderId: req.user.id,
        senderType: req.user.role === 'doctor' ? 'doctor' : 'patient',
        type: file.mimetype.startsWith('image/') ? 'image' : 'file',
        content: `Shared ${file.originalname}`,
        fileUrl: file.path, // Use the path from multer (already formatted)
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        metadata: {
          uploadedAt: new Date().toISOString()
        }
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
        uploadedBy: req.user.name,
        uploadedByType: req.user.role,
        timestamp: savedMessage.createdAt,
        consultationId: id
      });

      res.status(200).json({
        success: true,
        data: {
          id: savedMessage.id,
          fileName: file.originalname,
          fileUrl: formattedFileUrl,
          fileSize: file.size,
          mimeType: file.mimetype,
          message: "File uploaded successfully"
        }
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
          message: "Consultation updated successfully"
        }
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
      if (consultation.status !== "not_started" && consultation.status !== "in_progress") {
        return next(
          new BadRequestError(
            `Cannot initiate call for a consultation with status '${consultation.status}'.`
          )
        );
      }

      console.log("\n\n About to initiate the call");

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

      console.log("\n\nThe new consultation");

      const callData = {
        consultationId: consultation.id,
        roomId: consultation.roomId,
        doctorName: consultation.appointment.doctor.user.name,
        doctorSpecialty: "General Practice", // TODO: Get from doctor specialty
        appointmentDate: consultation.appointment.timeSlot.date,
        appointmentTime: `${consultation.appointment.timeSlot.startTime} - ${consultation.appointment.timeSlot.endTime}`,
        patientName: consultation.appointment.patient.user.name,
      };

      const patientUserId = consultation.appointment.patient.user.id;
      console.log(
        `📞 Emitting video_call_initiated to user-${patientUserId}:`,
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

      io.to(`user-${patientUserId}`).emit("video_call_initiated", callData);

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
}

module.exports = new ConsultationController();
