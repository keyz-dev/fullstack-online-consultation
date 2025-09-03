"use strict";

const patientConsultationService = require("../services/patientConsultationService");
const { NotFoundError, UnauthorizedError } = require("../utils/errors");

class PatientConsultationController {
  /**
   * @desc    Get consultations for the authenticated patient
   * @route   GET /api/v1/consultations/patient
   * @access  Private (Patient only)
   */
  async getPatientConsultations(req, res, next) {
    try {
      // Ensure user is a patient
      if (req.authUser.role !== "patient") {
        return next(
          new UnauthorizedError("Only patients can access this endpoint")
        );
      }

      // Ensure patient profile exists
      if (!req.authUser.patient) {
        return next(new NotFoundError("Patient profile not found"));
      }

      const { page = 1, limit = 10, status, type, appointmentId } = req.query;

      const consultations =
        await patientConsultationService.getPatientConsultations(
          req.authUser.patient.id,
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
   * @desc    Get active consultations for the authenticated patient
   * @route   GET /api/v1/consultations/patient/active
   * @access  Private (Patient only)
   */
  async getPatientActiveConsultations(req, res, next) {
    try {
      // Ensure user is a patient
      if (req.authUser.role !== "patient") {
        return next(
          new UnauthorizedError("Only patients can access this endpoint")
        );
      }

      // Ensure patient profile exists
      if (!req.authUser.patient) {
        return next(new NotFoundError("Patient profile not found"));
      }

      const consultations =
        await patientConsultationService.getPatientActiveConsultations(
          req.authUser.patient.id
        );

      res.status(200).json({
        success: true,
        data: {
          activeConsultations: consultations,
          count: consultations.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get consultation statistics for the authenticated patient
   * @route   GET /api/v1/consultations/patient/stats
   * @access  Private (Patient only)
   */
  async getPatientConsultationStats(req, res, next) {
    try {
      // Ensure user is a patient
      if (req.authUser.role !== "patient") {
        return next(
          new UnauthorizedError("Only patients can access this endpoint")
        );
      }

      // Ensure patient profile exists
      if (!req.authUser.patient) {
        return next(new NotFoundError("Patient profile not found"));
      }

      const stats =
        await patientConsultationService.getPatientConsultationStats(
          req.authUser.patient.id
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

module.exports = new PatientConsultationController();
