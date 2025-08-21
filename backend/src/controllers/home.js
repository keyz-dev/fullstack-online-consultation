const {
  Specialty,
  Symptom,
  Testimonial,
  Q_and_A,
  Doctor,
} = require("../db/models");
const { Op } = require("sequelize");

class HomeController {
  // Get home page data
  async getHomeData(req, res) {
    try {
      // Get specialties with doctor count
      const specialties = await Specialty.findAll({
        limit: 5,
      });

      // Get doctor count for each specialty
      const specialtiesWithCount = await Promise.all(
        specialties.map(async (specialty) => {
          const doctorCount = await Doctor.count({
            where: {
              isActive: true,
              isApproved: true,
              specialties: {
                [Op.overlap]: [specialty.name],
              },
            },
          });

          return {
            ...specialty.toJSON(),
            doctorCount,
          };
        })
      );

      // Get symptoms/health concerns
      const symptoms = await Symptom.findAll({
        limit: 10,
      });

      // Get testimonials - temporarily disabled due to model issues
      const testimonials = [];

      // Get Q&A
      const qAndAs = await Q_and_A.findAll({
        where: {
          isActive: true,
        },
        limit: 5,
      });

      // Get statistics
      const doctorCount = await Doctor.count({
        where: {
          isActive: true,
          isApproved: true,
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
          symptoms,
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
          isApproved: true,
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
      const specialties = await Specialty.findAll();

      // Get doctor count for each specialty
      const specialtiesWithCount = await Promise.all(
        specialties.map(async (specialty) => {
          const doctorCount = await Doctor.count({
            where: {
              isActive: true,
              isApproved: true,
              specialties: {
                [Op.overlap]: [specialty.name],
              },
            },
          });

          return {
            ...specialty.toJSON(),
            doctorCount,
          };
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

      // Get doctors for this specialty
      const doctors = await Doctor.findAll({
        where: {
          isActive: true,
          isApproved: true,
          specialties: {
            [Op.overlap]: [specialty.name],
          },
        },
        include: [
          {
            model: require("../db/models").User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email", "avatar"],
          },
        ],
      });

      const specialtyWithDoctors = {
        ...specialty.toJSON(),
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
      const symptoms = await Symptom.findAll({
        where: {
          isActive: true,
        },
      });

      res.json({
        success: true,
        data: symptoms,
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

      // Get doctor count for each specialty
      const specialtiesWithCount = await Promise.all(
        specialties.map(async (specialty) => {
          const doctorCount = await Doctor.count({
            where: {
              isActive: true,
              isApproved: true,
              specialties: {
                [Op.overlap]: [specialty.name],
              },
            },
          });

          return {
            ...specialty.toJSON(),
            doctorCount,
          };
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

      const doctors = await Doctor.findAndCountAll({
        where: {
          isActive: true,
          isApproved: true,
          specialties: {
            [Op.overlap]: [specialty.name],
          },
        },
        include: [
          {
            model: require("../db/models").User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email", "avatar"],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
      });

      const totalPages = Math.ceil(doctors.count / limit);

      res.json({
        success: true,
        data: {
          doctors: doctors.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: doctors.count,
            totalPages,
          },
          specialty: {
            id: specialty.id,
            name: specialty.name,
            description: specialty.description,
          },
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
