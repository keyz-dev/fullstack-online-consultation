"use strict";

const {
  Consultation,
  Doctor,
  Patient,
  DoctorAvailability,
  User,
  Specialty,
} = require("../db/models");
const { Op } = require("sequelize");
const { sendNotification } = require("../services/notificationService");
const { validateConsultationData } = require("../utils/validation");

class ConsultationController {
  // ===== CONSULTATION/APPOINTMENT MANAGEMENT =====

  /**
   * Create a new consultation/appointment
   */
  async createConsultation(req, res) {
    try {
      const { doctorId, scheduledAt, type, symptoms, notes } = req.body;
      const patientId = req.user.id;

      // Validate input data
      const validation = validateConsultationData(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        });
      }

      // Check if doctor exists and is active
      const doctor = await Doctor.findOne({
        where: { id: doctorId, status: "active" },
        include: [{ model: User, as: "user" }],
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found or not active",
        });
      }

      // Check if the requested time slot is available
      const isSlotAvailable = await this.checkSlotAvailability(
        doctorId,
        scheduledAt,
        type
      );
      if (!isSlotAvailable) {
        return res.status(400).json({
          success: false,
          message: "Requested time slot is not available",
        });
      }

      // Create consultation
      const consultation = await Consultation.create({
        patientId,
        doctorId,
        scheduledAt: new Date(scheduledAt),
        type,
        symptoms: symptoms || [],
        notes,
        status: "scheduled",
      });

      // Send notifications
      await sendNotification({
        userId: doctorId,
        type: "appointment_booked",
        title: "New Appointment Booked",
        message: `You have a new ${type} appointment scheduled for ${new Date(scheduledAt).toLocaleString()}`,
        data: { consultationId: consultation.id },
      });

      await sendNotification({
        userId: patientId,
        type: "appointment_confirmed",
        title: "Appointment Confirmed",
        message: `Your ${type} appointment with Dr. ${doctor.user.firstName} ${doctor.user.lastName} has been confirmed`,
        data: { consultationId: consultation.id },
      });

      // Get consultation with related data
      const consultationWithDetails = await Consultation.findByPk(
        consultation.id,
        {
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
        }
      );

      res.status(201).json({
        success: true,
        message: "Consultation created successfully",
        data: consultationWithDetails,
      });
    } catch (error) {
      console.error("Error creating consultation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create consultation",
        error: error.message,
      });
    }
  }

  /**
   * Get consultations with filtering and pagination
   */
  async getConsultations(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        type,
        startDate,
        endDate,
        doctorId,
        patientId,
        search,
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Add filters based on user role
      if (req.user.role === "doctor") {
        whereClause.doctorId = req.user.id;
      } else if (req.user.role === "patient") {
        whereClause.patientId = req.user.id;
      }

      // Apply additional filters
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      if (doctorId) whereClause.doctorId = doctorId;
      if (patientId) whereClause.patientId = patientId;

      // Date range filter
      if (startDate || endDate) {
        whereClause.scheduledAt = {};
        if (startDate) whereClause.scheduledAt[Op.gte] = new Date(startDate);
        if (endDate) whereClause.scheduledAt[Op.lte] = new Date(endDate);
      }

      const consultations = await Consultation.findAndCountAll({
        where: whereClause,
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
        order: [["scheduledAt", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        success: true,
        data: {
          consultations: consultations.rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(consultations.count / limit),
            totalItems: consultations.count,
            itemsPerPage: parseInt(limit),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching consultations:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch consultations",
        error: error.message,
      });
    }
  }

  /**
   * Get single consultation by ID
   */
  async getConsultation(req, res) {
    try {
      const { id } = req.params;

      const consultation = await Consultation.findByPk(id, {
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
      });

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: "Consultation not found",
        });
      }

      // Check if user has access to this consultation
      if (
        req.user.role !== "admin" &&
        consultation.doctorId !== req.user.id &&
        consultation.patientId !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      res.json({
        success: true,
        data: consultation,
      });
    } catch (error) {
      console.error("Error fetching consultation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch consultation",
        error: error.message,
      });
    }
  }

  /**
   * Update consultation
   */
  async updateConsultation(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: "Consultation not found",
        });
      }

      // Check if user has permission to update
      if (
        req.user.role !== "admin" &&
        consultation.doctorId !== req.user.id &&
        consultation.patientId !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Update consultation
      await consultation.update(updateData);

      res.json({
        success: true,
        message: "Consultation updated successfully",
        data: consultation,
      });
    } catch (error) {
      console.error("Error updating consultation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update consultation",
        error: error.message,
      });
    }
  }

  /**
   * Delete consultation (soft delete)
   */
  async deleteConsultation(req, res) {
    try {
      const { id } = req.params;

      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: "Consultation not found",
        });
      }

      // Check if user has permission to delete
      if (
        req.user.role !== "admin" &&
        consultation.doctorId !== req.user.id &&
        consultation.patientId !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Soft delete
      await consultation.update({
        status: "cancelled",
        cancelledBy: req.user.role,
      });

      res.json({
        success: true,
        message: "Consultation deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting consultation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete consultation",
        error: error.message,
      });
    }
  }

  // ===== AVAILABILITY MANAGEMENT =====

  /**
   * Get doctor availability
   */
  async getDoctorAvailability(req, res) {
    try {
      const { doctorId } = req.params;

      const availability = await DoctorAvailability.findAll({
        where: { doctorId, isAvailable: true },
        order: [
          ["dayOfWeek", "ASC"],
          ["startTime", "ASC"],
        ],
      });

      res.json({
        success: true,
        data: availability,
      });
    } catch (error) {
      console.error("Error fetching doctor availability:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch doctor availability",
        error: error.message,
      });
    }
  }

  /**
   * Set doctor availability
   */
  async setDoctorAvailability(req, res) {
    try {
      const { availabilities } = req.body;
      const doctorId = req.user.id;

      // Delete existing availability
      await DoctorAvailability.destroy({ where: { doctorId } });

      // Create new availability
      const newAvailabilities = await DoctorAvailability.bulkCreate(
        availabilities.map((avail) => ({ ...avail, doctorId }))
      );

      res.json({
        success: true,
        message: "Availability updated successfully",
        data: newAvailabilities,
      });
    } catch (error) {
      console.error("Error setting doctor availability:", error);
      res.status(500).json({
        success: false,
        message: "Failed to set doctor availability",
        error: error.message,
      });
    }
  }

  /**
   * Get available time slots for a doctor
   */
  async getAvailableSlots(req, res) {
    try {
      const { doctorId } = req.params;
      const { date, type = "video_call" } = req.query;

      const requestedDate = new Date(date);
      const dayOfWeek = requestedDate.getDay();

      // Get doctor's availability for the day
      const availability = await DoctorAvailability.findOne({
        where: { doctorId, dayOfWeek, isAvailable: true },
      });

      if (!availability) {
        return res.json({
          success: true,
          data: [],
        });
      }

      // Get existing consultations for the date
      const existingConsultations = await Consultation.findAll({
        where: {
          doctorId,
          scheduledAt: {
            [Op.between]: [
              new Date(requestedDate.setHours(0, 0, 0, 0)),
              new Date(requestedDate.setHours(23, 59, 59, 999)),
            ],
          },
          status: { [Op.in]: ["scheduled", "in_progress"] },
        },
      });

      // Generate available slots
      const slots = this.generateTimeSlots(availability, existingConsultations);

      res.json({
        success: true,
        data: slots,
      });
    } catch (error) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch available slots",
        error: error.message,
      });
    }
  }

  // ===== CONSULTATION ACTIONS =====

  /**
   * Start consultation
   */
  async startConsultation(req, res) {
    try {
      const { id } = req.params;

      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: "Consultation not found",
        });
      }

      if (consultation.status !== "scheduled") {
        return res.status(400).json({
          success: false,
          message: "Consultation cannot be started",
        });
      }

      await consultation.update({
        status: "in_progress",
        startedAt: new Date(),
      });

      res.json({
        success: true,
        message: "Consultation started successfully",
        data: consultation,
      });
    } catch (error) {
      console.error("Error starting consultation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to start consultation",
        error: error.message,
      });
    }
  }

  /**
   * End consultation
   */
  async endConsultation(req, res) {
    try {
      const { id } = req.params;
      const { diagnosis, notes, prescription } = req.body;

      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: "Consultation not found",
        });
      }

      if (consultation.status !== "in_progress") {
        return res.status(400).json({
          success: false,
          message: "Consultation cannot be ended",
        });
      }

      const endedAt = new Date();
      const duration = Math.round(
        (endedAt - consultation.startedAt) / (1000 * 60)
      ); // minutes

      await consultation.update({
        status: "completed",
        endedAt,
        duration,
        diagnosis,
        notes,
        prescription,
      });

      res.json({
        success: true,
        message: "Consultation ended successfully",
        data: consultation,
      });
    } catch (error) {
      console.error("Error ending consultation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to end consultation",
        error: error.message,
      });
    }
  }

  /**
   * Cancel consultation
   */
  async cancelConsultation(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: "Consultation not found",
        });
      }

      if (
        consultation.status === "completed" ||
        consultation.status === "cancelled"
      ) {
        return res.status(400).json({
          success: false,
          message: "Consultation cannot be cancelled",
        });
      }

      await consultation.update({
        status: "cancelled",
        cancellationReason: reason,
        cancelledBy: req.user.role,
      });

      res.json({
        success: true,
        message: "Consultation cancelled successfully",
        data: consultation,
      });
    } catch (error) {
      console.error("Error cancelling consultation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to cancel consultation",
        error: error.message,
      });
    }
  }

  /**
   * Reschedule consultation
   */
  async rescheduleConsultation(req, res) {
    try {
      const { id } = req.params;
      const { scheduledAt } = req.body;

      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: "Consultation not found",
        });
      }

      if (consultation.status !== "scheduled") {
        return res.status(400).json({
          success: false,
          message: "Consultation cannot be rescheduled",
        });
      }

      // Check if new slot is available
      const isSlotAvailable = await this.checkSlotAvailability(
        consultation.doctorId,
        scheduledAt,
        consultation.type,
        consultation.id
      );

      if (!isSlotAvailable) {
        return res.status(400).json({
          success: false,
          message: "Requested time slot is not available",
        });
      }

      await consultation.update({
        scheduledAt: new Date(scheduledAt),
      });

      res.json({
        success: true,
        message: "Consultation rescheduled successfully",
        data: consultation,
      });
    } catch (error) {
      console.error("Error rescheduling consultation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to reschedule consultation",
        error: error.message,
      });
    }
  }

  // ===== HELPER METHODS =====

  /**
   * Check if a time slot is available
   */
  async checkSlotAvailability(
    doctorId,
    scheduledAt,
    type,
    excludeConsultationId = null
  ) {
    const requestedDate = new Date(scheduledAt);
    const dayOfWeek = requestedDate.getDay();

    // Check doctor availability
    const availability = await DoctorAvailability.findOne({
      where: { doctorId, dayOfWeek, isAvailable: true },
    });

    if (!availability) return false;

    // Check for conflicts
    const whereClause = {
      doctorId,
      scheduledAt: {
        [Op.between]: [
          new Date(requestedDate.getTime() - 30 * 60 * 1000), // 30 minutes before
          new Date(requestedDate.getTime() + 30 * 60 * 1000), // 30 minutes after
        ],
      },
      status: { [Op.in]: ["scheduled", "in_progress"] },
    };

    if (excludeConsultationId) {
      whereClause.id = { [Op.ne]: excludeConsultationId };
    }

    const conflictingConsultation = await Consultation.findOne({
      where: whereClause,
    });
    return !conflictingConsultation;
  }

  /**
   * Generate time slots based on availability
   */
  generateTimeSlots(availability, existingConsultations) {
    const slots = [];
    const startTime = new Date(`2000-01-01 ${availability.startTime}`);
    const endTime = new Date(`2000-01-01 ${availability.endTime}`);
    const duration = availability.consultationDuration || 30;

    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60 * 1000);

      // Check if slot conflicts with existing consultations
      const hasConflict = existingConsultations.some((consultation) => {
        const consultationTime = new Date(consultation.scheduledAt);
        return Math.abs(consultationTime - currentTime) < duration * 60 * 1000;
      });

      if (!hasConflict) {
        slots.push({
          startTime: currentTime.toTimeString().slice(0, 5),
          endTime: slotEnd.toTimeString().slice(0, 5),
          available: true,
        });
      }

      currentTime = slotEnd;
    }

    return slots;
  }

  // ===== PLACEHOLDER METHODS FOR FUTURE IMPLEMENTATION =====

  async joinVideoCall(req, res) {
    // TODO: Implement video call joining logic
    res.json({
      success: true,
      message: "Video call joining - to be implemented",
    });
  }

  async leaveVideoCall(req, res) {
    // TODO: Implement video call leaving logic
    res.json({
      success: true,
      message: "Video call leaving - to be implemented",
    });
  }

  async handleSignal(req, res) {
    // TODO: Implement WebRTC signaling
    res.json({
      success: true,
      message: "WebRTC signaling - to be implemented",
    });
  }

  async sendMessage(req, res) {
    // TODO: Implement chat messaging
    res.json({ success: true, message: "Chat messaging - to be implemented" });
  }

  async getMessages(req, res) {
    // TODO: Implement message retrieval
    res.json({
      success: true,
      data: [],
      message: "Message retrieval - to be implemented",
    });
  }

  async rateConsultation(req, res) {
    // TODO: Implement rating system
    res.json({ success: true, message: "Rating system - to be implemented" });
  }

  async getConsultationRating(req, res) {
    // TODO: Implement rating retrieval
    res.json({
      success: true,
      data: null,
      message: "Rating retrieval - to be implemented",
    });
  }

  async getAllConsultations(req, res) {
    // TODO: Implement admin consultation retrieval
    res.json({
      success: true,
      data: [],
      message: "Admin consultation retrieval - to be implemented",
    });
  }

  async getConsultationStats(req, res) {
    // TODO: Implement consultation statistics
    res.json({
      success: true,
      data: {},
      message: "Consultation statistics - to be implemented",
    });
  }
}

module.exports = new ConsultationController();
