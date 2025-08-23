const { Symptom, Specialty } = require("../db/models");
const {
  cleanUpFileImages,
  cleanUpInstanceImages,
} = require("../utils/imageCleanup");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const { Op, fn, col } = require("sequelize");
const {
  formatSymptomData,
  formatSymptomsData,
  formatSymptomStats,
} = require("../utils/returnFormats/symptomData");

// Get all symptoms with filters and pagination
exports.getAllSymptoms = async (req, res, next) => {
  try {
    const {
      search = "",
      specialtyId = "",
      sortBy = "name",
      sortOrder = "ASC",
    } = req.query;

    // Build query
    const whereClause = {};
    const includeClause = [
      {
        model: Specialty,
        as: "specialty",
        attributes: ["id", "name"],
      },
    ];

    // Search functionality
    if (search) {
      whereClause[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
    }

    // Specialty filter
    if (specialtyId && specialtyId !== "all") {
      whereClause.specialtyId = specialtyId;
    }

    // Build order clause
    const orderClause = [[sortBy, sortOrder.toUpperCase()]];

    const symptoms = await Symptom.findAll({
      where: whereClause,
      include: includeClause,
      order: orderClause,
    });

    // Get statistics
    const stats = await getSymptomStats();

    res.status(200).json({
      success: true,
      data: formatSymptomsData(symptoms),
      stats: formatSymptomStats(stats),
      total: symptoms.length,
    });
  } catch (error) {
    next(error);
  }
};

// Get symptom statistics
exports.getSymptomStats = async (req, res, next) => {
  try {
    const stats = await getSymptomStats();
    res.status(200).json({
      success: true,
      data: formatSymptomStats(stats),
    });
  } catch (error) {
    next(error);
  }
};

// Get single symptom by ID
exports.getSymptomById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const symptom = await Symptom.findByPk(id, {
      include: [
        {
          model: Specialty,
          as: "specialty",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!symptom) {
      throw new NotFoundError("Symptom not found");
    }

    res.status(200).json({
      success: true,
      data: formatSymptomData(symptom),
    });
  } catch (error) {
    next(error);
  }
};

// Create new symptom
exports.createSymptom = async (req, res, next) => {
  try {
    const { name, specialtyId } = req.body;

    if (!name) {
      throw new BadRequestError("Symptom name is required");
    }

    if (!specialtyId) {
      throw new BadRequestError("Specialty is required");
    }

    // Check if symptom already exists
    const existingSymptom = await Symptom.findOne({
      where: { name: { [Op.iLike]: name } },
    });

    if (existingSymptom) {
      throw new BadRequestError("Symptom with this name already exists");
    }

    // Validate specialty
    const specialty = await Specialty.findByPk(specialtyId);
    if (!specialty) {
      throw new BadRequestError("Invalid specialty ID");
    }

    const symptomData = {
      name,
      specialtyId,
      iconUrl: req.file?.path || null,
    };

    const symptom = await Symptom.create(symptomData);

    // Fetch the created symptom with specialty info
    const createdSymptom = await Symptom.findByPk(symptom.id, {
      include: [
        {
          model: Specialty,
          as: "specialty",
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: formatSymptomData(createdSymptom),
      message: "Symptom created successfully",
    });
  } catch (error) {
    // Clean up uploaded file if creation fails
    if (req.file) {
      await cleanUpFileImages([req.file.path]);
    }
    next(error);
  }
};

// Update symptom
exports.updateSymptom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, specialtyId } = req.body;

    const symptom = await Symptom.findByPk(id);
    if (!symptom) {
      throw new NotFoundError("Symptom not found");
    }

    // Check if name is being changed and if it conflicts with existing symptom
    if (name && name !== symptom.name) {
      const existingSymptom = await Symptom.findOne({
        where: {
          name: { [Op.iLike]: name },
          id: { [Op.ne]: id },
        },
      });

      if (existingSymptom) {
        throw new BadRequestError("Symptom with this name already exists");
      }
    }

    // Validate specialty if provided
    if (specialtyId && specialtyId !== symptom.specialtyId) {
      if (specialtyId === "null" || specialtyId === "") {
        // Allow removing specialty association
        symptom.specialtyId = null;
      } else {
        const specialty = await Specialty.findByPk(specialtyId);
        if (!specialty) {
          throw new BadRequestError("Invalid specialty ID");
        }
        symptom.specialtyId = specialtyId;
      }
    }

    // Update fields
    if (name) symptom.name = name;
    if (req.file) {
      // Clean up old image if exists
      if (symptom.iconUrl) {
        await cleanUpInstanceImages([symptom.iconUrl]);
      }
      symptom.iconUrl = req.file.path;
    }

    await symptom.save();

    // Fetch updated symptom with specialty info
    const updatedSymptom = await Symptom.findByPk(id, {
      include: [
        {
          model: Specialty,
          as: "specialty",
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: formatSymptomData(updatedSymptom),
      message: "Symptom updated successfully",
    });
  } catch (error) {
    // Clean up uploaded file if update fails
    if (req.file) {
      await cleanUpFileImages([req.file.path]);
    }
    next(error);
  }
};

// Delete symptom
exports.deleteSymptom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const symptom = await Symptom.findByPk(id);
    if (!symptom) {
      throw new NotFoundError("Symptom not found");
    }

    // Clean up associated image
    if (symptom.iconUrl) {
      await cleanUpInstanceImages([symptom.iconUrl]);
    }

    await symptom.destroy();

    res.status(200).json({
      success: true,
      message: "Symptom deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get symptom statistics
async function getSymptomStats() {
  const totalSymptoms = await Symptom.count();

  // Get symptoms by specialty
  const symptomsBySpecialty = await Symptom.findAll({
    include: [
      {
        model: Specialty,
        as: "specialty",
        attributes: ["id", "name"],
      },
    ],
    attributes: ["specialtyId", [fn("COUNT", col("Symptom.id")), "count"]],
    group: ["specialtyId", "specialty.id", "specialty.name"],
  });

  const bySpecialty = symptomsBySpecialty.map((item) => ({
    specialtyId: item.specialtyId,
    specialtyName: item.specialty?.name || "Unassigned",
    count: parseInt(item.dataValues.count),
  }));

  // Get top symptoms (most recent)
  const topSymptoms = await Symptom.findAll({
    include: [
      {
        model: Specialty,
        as: "specialty",
        attributes: ["name"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: 10,
    attributes: ["id", "name", "iconUrl"],
  });

  return {
    total: totalSymptoms,
    bySpecialty,
    topSymptoms: formatSymptomsData(topSymptoms).map((symptom) => ({
      id: symptom.id,
      name: symptom.name,
      iconUrl: symptom.iconUrl,
      specialtyName: symptom.specialty?.name || "Unassigned",
    })),
  };
}
