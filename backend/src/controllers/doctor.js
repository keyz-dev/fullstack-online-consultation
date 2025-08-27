const {
  Doctor,
  User,
  Specialty,
  Symptom,
  DoctorAvailability,
  DoctorSpecialty,
} = require("../db/models");
const { Op } = require("sequelize");
const {
  formatDoctorData,
  formatDoctorsData,
} = require("../utils/returnFormats/doctorData");

class DoctorsController {
  // Get all doctors with filters and pagination
  async getAllDoctors(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        search = "",
        specialtyId,
        symptomId,
        experience,
        consultationFeeMin,
        consultationFeeMax,
        rating,
        availability,
        sortBy = "name",
        sortOrder = "ASC",
      } = req.query;

      const offset = (page - 1) * limit;

      // Build where clause for doctors
      let doctorWhere = {
        isActive: true,
        // Temporarily remove isVerified filter since doctors don't have this set
        // isVerified: true,
      };

      // Build where clause for user search
      let userWhere = {};
      if (search) {
        userWhere.name = {
          [Op.iLike]: `%${search}%`,
        };
      }

      // Build include clause
      let includes = [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "name",
            "email",
            "avatar",
            "phoneNumber",
            "gender",
            "dob",
          ],
          where: userWhere,
        },
        {
          model: Specialty,
          as: "specialties",
          through: { attributes: [] },
          attributes: ["id", "name", "description", "icon"],
        },
      ];

      // Add specialty filter
      if (specialtyId) {
        includes[1].where = { id: specialtyId };
      }

      // Add symptom filter through specialties
      if (symptomId) {
        includes.push({
          model: Specialty,
          as: "specialties",
          through: { attributes: [] },
          include: [
            {
              model: Symptom,
              as: "symptoms",
              where: { id: symptomId },
              through: { attributes: [] },
            },
          ],
        });
      }

      // Add experience filter
      if (experience) {
        const [minExp, maxExp] = experience.split("-").map(Number);
        if (maxExp) {
          doctorWhere.experience = {
            [Op.between]: [minExp, maxExp],
          };
        } else {
          doctorWhere.experience = {
            [Op.gte]: minExp,
          };
        }
      }

      // Add consultation fee filter
      if (consultationFeeMin || consultationFeeMax) {
        doctorWhere.consultationFee = {};
        if (consultationFeeMin) {
          doctorWhere.consultationFee[Op.gte] = parseFloat(consultationFeeMin);
        }
        if (consultationFeeMax) {
          doctorWhere.consultationFee[Op.lte] = parseFloat(consultationFeeMax);
        }
      }

      // Add rating filter
      if (rating) {
        doctorWhere.averageRating = {
          [Op.gte]: parseFloat(rating),
        };
      }

      // Add availability filter
      if (availability) {
        includes.push({
          model: DoctorAvailability,
          as: "availabilities",
          where: {
            consultationType: availability,
            isAvailable: true,
          },
        });
      }

      // Build order clause - avoid complex nested ordering
      let order = [];
      switch (sortBy) {
        case "experience":
          order.push(["experience", sortOrder]);
          break;
        case "rating":
          order.push(["averageRating", sortOrder]);
          break;
        case "fee":
          order.push(["consultationFee", sortOrder]);
          break;
        default:
          // Default to experience for now, we'll sort by name manually
          order.push(["experience", "ASC"]);
      }

      const doctors = await Doctor.findAndCountAll({
        where: doctorWhere,
        include: includes,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: order,
        distinct: true,
      });

      // Sort by name manually if requested
      if (sortBy === "name") {
        doctors.rows.sort((a, b) => {
          const nameA = a.user?.name || "";
          const nameB = b.user?.name || "";
          return sortOrder === "ASC"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        });
      }

      const totalPages = Math.ceil(doctors.count / limit);

      // Format doctors data using utility
      const formattedDoctors = formatDoctorsData(doctors.rows);

      res.json({
        success: true,
        data: {
          doctors: formattedDoctors,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: doctors.count,
            totalPages,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch doctors",
        error: error.message,
      });
    }
  }

  // Get doctor by ID with full details
  async getDoctorById(req, res) {
    try {
      const { id } = req.params;

      const doctor = await Doctor.findOne({
        where: {
          id: id,
          isActive: true,
          // Temporarily remove isVerified filter since doctors don't have this set
          // isVerified: true,
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
              "avatar",
              "phoneNumber",
              "gender",
              "dob",
            ],
          },
          {
            model: Specialty,
            as: "specialties",
            through: { attributes: [] },
            attributes: ["id", "name", "description", "icon"],
          },
          {
            model: DoctorAvailability,
            as: "availabilities",
            where: { isAvailable: true },
            required: false,
          },
        ],
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }

      // Format doctor data using utility
      const formattedDoctor = formatDoctorData(doctor, {
        includeAvailabilities: true,
      });

      res.json({
        success: true,
        data: formattedDoctor,
      });
    } catch (error) {
      console.error("Error fetching doctor:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch doctor",
        error: error.message,
      });
    }
  }

  // Search doctors by name
  async searchDoctors(req, res) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const offset = (page - 1) * limit;

      const doctors = await Doctor.findAndCountAll({
        where: {
          isActive: true,
          // Temporarily remove isVerified filter since doctors don't have this set
          // isVerified: true,
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "name",
              "email",
              "avatar",
              "phoneNumber",
              "gender",
              "dob",
            ],
            where: {
              name: {
                [Op.iLike]: `%${q}%`,
              },
            },
          },
          {
            model: Specialty,
            as: "specialties",
            through: { attributes: [] },
            attributes: ["id", "name", "description", "icon"],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["experience", "ASC"]], // Avoid nested table ordering
        distinct: true,
      });

      const totalPages = Math.ceil(doctors.count / limit);

      // Format doctors data using utility
      const formattedDoctors = formatDoctorsData(doctors.rows);

      res.json({
        success: true,
        data: {
          doctors: formattedDoctors,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: doctors.count,
            totalPages,
          },
        },
      });
    } catch (error) {
      console.error("Error searching doctors:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search doctors",
        error: error.message,
      });
    }
  }
}

module.exports = new DoctorsController();
