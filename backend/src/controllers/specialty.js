const {
  Specialty,
  Doctor,
  Symptom,
  User,
  DoctorSpecialty,
} = require("../db/models");
const {
  formatSpecialtyData,
  formatSpecialtiesData,
  formatSpecialtyStats,
} = require("../utils/returnFormats/specialtyData");
const {
  cleanUpFileImages,
  cleanUpInstanceImages,
} = require("../utils/imageCleanup");
const { BadRequestError, NotFoundError } = require("../utils/errors");

// Get all specialties with statistics
exports.getAllSpecialties = async (req, res, next) => {
  try {
    const {
      search = "",
      status = "",
      sortBy = "name",
      sortOrder = "ASC",
    } = req.query;

    // Build query
    const whereClause = {};

    // Search functionality
    if (search) {
      whereClause[require("sequelize").Op.or] = [
        { name: { [require("sequelize").Op.iLike]: `%${search}%` } },
        { description: { [require("sequelize").Op.iLike]: `%${search}%` } },
      ];
    }

    // Status filter
    if (status && status !== "all") {
      whereClause.isActive = status === "active";
    }

    // Build order clause
    const orderClause = [[sortBy, sortOrder.toUpperCase()]];

    const specialties = await Specialty.findAll({
      where: whereClause,
      order: orderClause,
      include: [
        {
          model: Symptom,
          as: "symptoms",
          attributes: ["id", "name", "iconUrl", "specialtyId"],
        },
      ],
    });

    // Get statistics for each specialty using proper joins
    const specialtiesWithStats = await Promise.all(
      specialties.map(async (specialty) => {
        // Count doctors for this specialty using proper joins
        const doctorCount = await Doctor.count({
          where: {
            isActive: true,
            isVerified: true,
          },
          include: [
            {
              model: Specialty,
              as: "specialties",
              through: { attributes: [] },
              where: { id: specialty.id },
            },
          ],
        });

        // Count symptoms for this specialty
        const symptomCount = await Symptom.count({
          where: {
            specialtyId: specialty.id,
          },
        });

        return formatSpecialtyData(specialty, {
          includeStats: true,
          doctorCount,
          symptomCount,
        });
      })
    );

    // Calculate overall statistics
    const stats = formatSpecialtyStats(specialties);

    res.status(200).json({
      success: true,
      data: specialtiesWithStats,
      stats,
      total: specialties.length,
    });
  } catch (error) {
    console.error("Error fetching specialties:", error);
    next(error);
  }
};

// Get single specialty by ID
exports.getSpecialtyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const specialty = await Specialty.findByPk(id, {
      include: [
        {
          model: Symptom,
          as: "symptoms",
          attributes: ["id", "name", "iconUrl", "specialtyId"],
        },
      ],
    });

    if (!specialty) {
      return next(new NotFoundError("Specialty not found"));
    }

    // Get statistics for this specialty using proper joins
    const doctorCount = await Doctor.count({
      where: {
        isActive: true,
        isVerified: true,
      },
      include: [
        {
          model: Specialty,
          as: "specialties",
          through: { attributes: [] },
          where: { id: specialty.id },
        },
      ],
    });

    const symptomCount = await Symptom.count({
      where: {
        specialtyId: specialty.id,
      },
    });

    const formattedSpecialty = formatSpecialtyData(specialty, {
      includeStats: true,
      doctorCount,
      symptomCount,
    });

    res.status(200).json({
      success: true,
      data: formattedSpecialty,
    });
  } catch (error) {
    console.error("Error fetching specialty:", error);
    next(error);
  }
};

// Create new specialty
exports.createSpecialty = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Check if specialty with same name already exists
    const existingSpecialty = await Specialty.findOne({
      where: { name: name.trim() },
    });

    if (existingSpecialty) {
      return next(
        new BadRequestError("Specialty with this name already exists")
      );
    }

    // Handle image upload
    const icon = req.file ? req.file.path : null;

    const specialty = await Specialty.create({
      name: name.trim(),
      description: description?.trim(),
      icon,
      isActive: true,
    });

    const formattedSpecialty = formatSpecialtyData(specialty);

    res.status(201).json({
      success: true,
      message: "Specialty created successfully",
      data: formattedSpecialty,
    });
  } catch (error) {
    await cleanUpFileImages(req);
    console.error("Error creating specialty:", error);
    next(error);
  }
};

// Update specialty
exports.updateSpecialty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const specialty = await Specialty.findByPk(id);
    if (!specialty) {
      return next(new NotFoundError("Specialty not found"));
    }

    // Check if name is being changed and if it conflicts with existing specialty
    if (name && name.trim() !== specialty.name) {
      const existingSpecialty = await Specialty.findOne({
        where: {
          name: name.trim(),
          id: { [require("sequelize").Op.ne]: id },
        },
      });

      if (existingSpecialty) {
        return next(
          new BadRequestError("Specialty with this name already exists")
        );
      }
    }

    // Handle image upload
    if (req.file) {
      // Clean up old image if it exists
      if (specialty.icon) {
        await cleanUpInstanceImages(specialty);
      }
      specialty.icon = req.file.path;
    }

    // Update fields
    if (name !== undefined) specialty.name = name.trim();
    if (description !== undefined) specialty.description = description?.trim();
    if (isActive !== undefined) specialty.isActive = isActive;

    await specialty.save();

    const formattedSpecialty = formatSpecialtyData(specialty);

    res.status(200).json({
      success: true,
      message: "Specialty updated successfully",
      data: formattedSpecialty,
    });
  } catch (error) {
    await cleanUpFileImages(req);
    console.error("Error updating specialty:", error);
    next(error);
  }
};

// Delete specialty
exports.deleteSpecialty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const specialty = await Specialty.findByPk(id);
    if (!specialty) {
      return next(new NotFoundError("Specialty not found"));
    }

    // Check if specialty is being used by doctors using proper joins
    const doctorCount = await Doctor.count({
      where: {
        isActive: true,
        isVerified: true,
      },
      include: [
        {
          model: Specialty,
          as: "specialties",
          through: { attributes: [] },
          where: { id: specialty.id },
        },
      ],
    });

    if (doctorCount > 0) {
      return next(
        new BadRequestError(
          `Cannot delete specialty. It is being used by ${doctorCount} doctor(s)`
        )
      );
    }

    // Check if specialty has symptoms
    const symptomCount = await Symptom.count({
      where: { specialtyId: id },
    });

    if (symptomCount > 0) {
      return next(
        new BadRequestError(
          `Cannot delete specialty. It has ${symptomCount} associated symptom(s)`
        )
      );
    }

    // Clean up image if it exists
    if (specialty.icon) {
      await cleanUpInstanceImages(specialty);
    }

    await specialty.destroy();

    res.status(200).json({
      success: true,
      message: "Specialty deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting specialty:", error);
    next(error);
  }
};

// Get specialty statistics
exports.getSpecialtyStats = async (req, res, next) => {
  try {
    const totalSpecialties = await Specialty.count();
    const activeSpecialties = await Specialty.count({
      where: { isActive: true },
    });
    const inactiveSpecialties = totalSpecialties - activeSpecialties;

    // Get top specialties by doctor count using proper joins
    const specialties = await Specialty.findAll();
    const specialtiesWithDoctorCounts = await Promise.all(
      specialties.map(async (specialty) => {
        const doctorCount = await Doctor.count({
          where: {
            isActive: true,
            isVerified: true,
          },
          include: [
            {
              model: Specialty,
              as: "specialties",
              through: { attributes: [] },
              where: { id: specialty.id },
            },
          ],
        });

        return {
          id: specialty.id,
          name: specialty.name,
          doctorCount,
        };
      })
    );

    // Sort by doctor count and get top 5
    const topSpecialties = specialtiesWithDoctorCounts
      .sort((a, b) => b.doctorCount - a.doctorCount)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        total: totalSpecialties,
        active: activeSpecialties,
        inactive: inactiveSpecialties,
        topSpecialties,
      },
    });
  } catch (error) {
    console.error("Error fetching specialty statistics:", error);
    next(error);
  }
};
