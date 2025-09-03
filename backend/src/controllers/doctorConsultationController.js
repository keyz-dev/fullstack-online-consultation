"use strict";

const doctorConsultationService = require("../services/doctorConsultationService");
const { NotFoundError, UnauthorizedError } = require("../utils/errors");

class DoctorConsultationController {
  /**
   * @desc    Get consultations for the authenticated doctor
   * @route   GET /api/v1/consultations/doctor
   * @access  Private (Doctor only)
   */
  async getDoctorConsultations(req, res, next) {
    try {
      // Ensure user is a doctor
      if (req.authUser.role !== "doctor") {
        return next(
          new UnauthorizedError("Only doctors can access this endpoint")
        );
      }

      // Ensure doctor profile exists
      if (!req.authUser.doctor) {
        return next(new NotFoundError("Doctor profile not found"));
      }

      const { page = 1, limit = 10, status, type, appointmentId } = req.query;

      const consultations =
        await doctorConsultationService.getDoctorConsultations(
          req.authUser.doctor.id,
          {
            page: parseInt(page),
            limit: parseInt(limit),
            status,
            type,
            appointmentId,
          }
        );

      res.status(200).json({
        success: true,
        data: consultations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get active consultations for the authenticated doctor
   * @route   GET /api/v1/consultations/doctor/active
   * @access  Private (Doctor only)
   */
  async getDoctorActiveConsultations(req, res, next) {
    try {
      // Ensure user is a doctor
      if (req.authUser.role !== "doctor") {
        return next(
          new UnauthorizedError("Only doctors can access this endpoint")
        );
      }

      // Ensure doctor profile exists
      if (!req.authUser.doctor) {
        return next(new NotFoundError("Doctor profile not found"));
      }

      const consultations =
        await doctorConsultationService.getDoctorActiveConsultations(
          req.authUser.doctor.id
        );

      res.status(200).json({
        success: true,
        data: {
          activeConsultations: consultations || [],
          count: consultations?.length || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get consultation statistics for the authenticated doctor
   * @route   GET /api/v1/consultations/doctor/stats
   * @access  Private (Doctor only)
   */
  async getDoctorConsultationStats(req, res, next) {
    try {
      // Ensure user is a doctor
      if (req.authUser.role !== "doctor") {
        return next(
          new UnauthorizedError("Only doctors can access this endpoint")
        );
      }

      // Ensure doctor profile exists
      if (!req.authUser.doctor) {
        return next(new NotFoundError("Doctor profile not found"));
      }

      const stats = await doctorConsultationService.getDoctorConsultationStats(
        req.authUser.doctor.id
      );

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DoctorConsultationController();
