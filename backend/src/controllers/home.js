const {
  Specialty,
  Symptom,
  Testimonial,
  QAndA,
  Doctor,
  User,
  DoctorSpecialty,
} = require("../db/models");
const { Op } = require("sequelize");
const { formatSpecialtyData } = require("../utils/returnFormats/specialtyData");
const { formatSymptomsData } = require("../utils/returnFormats/symptomData");

class HomeController {
  // Get home page data
  async getHomeData(req, res) {
    try {
      // Get specialties with doctor count
      const specialties = await Specialty.findAll({
        where: {
          isActive: true,
        },
        limit: 5,
      });

      // Get doctor count for each specialty using proper relationship queries
      const specialtiesWithCount = await Promise.all(
        specialties.map(async (specialty) => {
          // Use the relationship method to get doctors for this specialty
          const doctors = await specialty.getDoctors({
            where: {
              isActive: true,
              // Temporarily remove isVerified filter since doctors don't have this set
              // isVerified: true,
            },
          });

          return formatSpecialtyData(specialty, {
            includeStats: true,
            doctorCount: doctors.length,
          });
        })
      );

      // Get symptoms/health concerns
      const symptoms = await Symptom.findAll({
        limit: 10,
      });

      // Format symptoms using return format utility
      const formattedSymptoms = formatSymptomsData(symptoms);

      // Get testimonials - temporarily disabled due to model issues
      const testimonials = [];

      // Get Q&A
      const qAndAs = await QAndA.findAll({
        where: {
          isActive: true,
        },
        limit: 5,
      });

      // Get statistics
      const doctorCount = await Doctor.count({
        where: {
          isActive: true,
          // Temporarily remove isVerified filter since doctors don't have this set
          // isVerified: true,
        },
      });

      const stats = {
        doctorCount: doctorCount || 100,
        patientCount: 1000, // Placeholder - can be updated when we track patients
        satisfactionRate: 72, // Placeholder - can be updated when we have ratings
      };

      // Services data
      const services = [
        {
          name: "Video Consultation",
          image: "/images/services/consultation.jpg",
          description:
            "A secure online platform allowing patients to interact with healthcare providers via real-time video, enabling face-to-face consultations from the comfort of home.",
        },
        {
          name: "Book Appointment",
          image: "/images/services/appointment.jpg",
          description:
            "An easy-to-use scheduling system that allows users(patients and doctors) to schedule, reschedule, or cancel appointments, complete with calendar integration.",
        },
        {
          name: "Manage Notifications",
          image: "/images/services/notification.jpg",
          description:
            "Automated notifications via email or SMS to remind patients of upcoming appointments, follow-ups, and important health updates, ensuring they stay informed and engaged.",
        },
      ];

      res.json({
        success: true,
        data: {
          specialties: specialtiesWithCount,
          symptoms: formattedSymptoms,
          testimonials,
          qa: qAndAs,
          stats,
          services,
        },
      });
    } catch (error) {
      console.error("Error fetching home data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch home data",
        error: error.message,
      });
    }
  }

  // Get statistics for the home page
  async getStatistics() {
    try {
      const doctorCount = await Doctor.count({
        where: {
          isActive: true,
          // Temporarily remove isVerified filter since doctors don't have this set
          // isVerified: true,
        },
      });

      // For now, we'll use placeholder data for patients and satisfaction rate
      // These can be updated when we have more data
      return {
        doctorCount: doctorCount || 100,
        patientCount: 1000, // Placeholder - can be updated when we track patients
        satisfactionRate: 72, // Placeholder - can be updated when we have ratings
      };
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return {
        doctorCount: 100,
        patientCount: 1000,
        satisfactionRate: 72,
      };
    }
  }

  // Get services data
  getServices() {
    return [
      {
        name: "Video Consultation",
        image: "/images/services/consultation.jpg",
        description:
          "A secure online platform allowing patients to interact with healthcare providers via real-time video, enabling face-to-face consultations from the comfort of home.",
      },
      {
        name: "Book Appointment",
        image: "/images/services/appointment.jpg",
        description:
          "An easy-to-use scheduling system that allows users(patients and doctors) to schedule, reschedule, or cancel appointments, complete with calendar integration.",
      },
      {
        name: "Manage Notifications",
        image: "/images/services/notification.jpg",
        description:
          "Automated notifications via email or SMS to remind patients of upcoming appointments, follow-ups, and important health updates, ensuring they stay informed and engaged.",
      },
    ];
  }

  // Get all specialties for specialties page
  async getSpecialties(req, res) {
    try {
      const specialties = await Specialty.findAll({
        where: {
          isActive: true,
        },
      });

      // Get doctor count for each specialty using proper relationship queries
      const specialtiesWithCount = await Promise.all(
        specialties.map(async (specialty) => {
          // Use the relationship method to get doctors for this specialty
          const doctors = await specialty.getDoctors({
            where: {
              isActive: true,
              // Temporarily remove isVerified filter since doctors don't have this set
              // isVerified: true,
            },
          });

          return formatSpecialtyData(specialty, {
            includeStats: true,
            doctorCount: doctors.length,
          });
        })
      );

      res.json({
        success: true,
        data: specialtiesWithCount,
      });
    } catch (error) {
      console.error("Error fetching specialties:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch specialties",
        error: error.message,
      });
    }
  }

  // Get specialty details
  async getSpecialtyDetails(req, res) {
    try {
      const { id } = req.params;

      const specialty = await Specialty.findByPk(id);

      if (!specialty) {
        return res.status(404).json({
          success: false,
          message: "Specialty not found",
        });
      }

      // Get doctors for this specialty using relationship method
      const doctors = await specialty.getDoctors({
        where: {
          isActive: true,
          // Temporarily remove isVerified filter since doctors don't have this set
          // isVerified: true,
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "avatar"],
          },
        ],
      });

      const formattedSpecialty = formatSpecialtyData(specialty);
      const specialtyWithDoctors = {
        ...formattedSpecialty,
        doctors,
      };

      res.json({
        success: true,
        data: specialtyWithDoctors,
      });
    } catch (error) {
      console.error("Error fetching specialty details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch specialty details",
        error: error.message,
      });
    }
  }

  // Get all symptoms
  async getSymptoms(req, res) {
    try {
      const symptoms = await Symptom.findAll();

      const formattedSymptoms = formatSymptomsData(symptoms);

      res.json({
        success: true,
        data: formattedSymptoms,
      });
    } catch (error) {
      console.error("Error fetching symptoms:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch symptoms",
        error: error.message,
      });
    }
  }

  // Search specialties
  async searchSpecialties(req, res) {
    try {
      const { q, limit = 10 } = req.query;

      let whereClause = {
        isActive: true,
      };

      if (q) {
        whereClause.name = {
          [Op.iLike]: `%${q}%`,
        };
      }

      const specialties = await Specialty.findAll({
        where: whereClause,
        limit: parseInt(limit),
        order: [["name", "ASC"]],
      });

      // Get doctor count for each specialty using proper relationship queries
      const specialtiesWithCount = await Promise.all(
        specialties.map(async (specialty) => {
          // Use the relationship method to get doctors for this specialty
          const doctors = await specialty.getDoctors({
            where: {
              isActive: true,
              // Temporarily remove isVerified filter since doctors don't have this set
              // isVerified: true,
            },
          });

          return formatSpecialtyData(specialty, {
            includeStats: true,
            doctorCount: doctors.length,
          });
        })
      );

      res.json({
        success: true,
        data: specialtiesWithCount,
      });
    } catch (error) {
      console.error("Error searching specialties:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search specialties",
        error: error.message,
      });
    }
  }

  // Get doctors by specialty
  async getDoctorsBySpecialty(req, res) {
    try {
      const { specialtyId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const specialty = await Specialty.findByPk(specialtyId);
      if (!specialty) {
        return res.status(404).json({
          success: false,
          message: "Specialty not found",
        });
      }

      const offset = (page - 1) * limit;

      // Use the relationship method to get doctors for this specialty
      const doctors = await specialty.getDoctors({
        where: {
          isActive: true,
          // Temporarily remove isVerified filter since doctors don't have this set
          // isVerified: true,
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "avatar"],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
      });

      // Get total count for pagination
      const totalCount = await specialty.countDoctors({
        where: {
          isActive: true,
          // Temporarily remove isVerified filter since doctors don't have this set
          // isVerified: true,
        },
      });

      const totalPages = Math.ceil(totalCount / limit);

      const formattedSpecialty = formatSpecialtyData(specialty);

      res.json({
        success: true,
        data: {
          doctors,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalCount,
            totalPages,
          },
          specialty: formattedSpecialty,
        },
      });
    } catch (error) {
      console.error("Error fetching doctors by specialty:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch doctors by specialty",
        error: error.message,
      });
    }
  }
}

module.exports = new HomeController();
