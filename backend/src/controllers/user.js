const {
  User,
  Patient,
  Doctor,
  Pharmacy,
  ActivityLog,
} = require("../db/models");
const { Op } = require("sequelize");
const formatUserData = require("../utils/returnFormats/userData");
const { getIO } = require("../sockets");
const logger = require("../utils/logger");

// Get all users with filters and pagination
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      role = "all",
      status = "all",
      verified = "all",
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const offset = (page - 1) * limit;
    const currentUserId = req.authUser.id; // Exclude current admin user

    // Build where clause
    const whereClause = {
      id: { [Op.ne]: currentUserId }, // Exclude current user
    };

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Role filter
    if (role !== "all") {
      whereClause.role = role;
    }

    // Status filter
    if (status !== "all") {
      whereClause.isActive = status === "active";
    }

    // Email verification filter
    if (verified !== "all") {
      whereClause.emailVerified = verified === "verified";
    }

    // Get users with associations
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "bloodGroup", "emergencyContact", "contactInfo"],
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: ["id", "licenseNumber", "experience", "contactInfo"],
        },
        {
          model: Pharmacy,
          as: "pharmacy",
          attributes: ["id", "name", "licenseNumber", "contactInfo"],
        },
      ],
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "gender",
        "dob",
        "avatar",
        "isActive",
        "emailVerified",
        "createdAt",
        "updatedAt",
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Format user data
    const formattedUsers = users.map((user) => formatUserData(user));

    res.json({
      success: true,
      data: formattedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const currentUserId = req.authUser.id;

    // Get total users (excluding current admin)
    const totalUsers = await User.count({
      where: { id: { [Op.ne]: currentUserId } },
    });

    // Get active users
    const activeUsers = await User.count({
      where: {
        id: { [Op.ne]: currentUserId },
        isActive: true,
      },
    });

    // Get verified users
    const verifiedUsers = await User.count({
      where: {
        id: { [Op.ne]: currentUserId },
        emailVerified: true,
      },
    });

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRegistrations = await User.count({
      where: {
        id: { [Op.ne]: currentUserId },
        createdAt: { [Op.gte]: thirtyDaysAgo },
      },
    });

    // Get users by role
    const usersByRole = await User.findAll({
      where: { id: { [Op.ne]: currentUserId } },
      attributes: [
        "role",
        [User.sequelize.fn("COUNT", User.sequelize.col("id")), "count"],
      ],
      group: ["role"],
    });

    const roleStats = usersByRole.reduce((acc, item) => {
      acc[item.role] = parseInt(item.dataValues.count);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        recentRegistrations,
        byRole: roleStats,
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
      error: error.message,
    });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.authUser.id;

    if (parseInt(id) === currentUserId) {
      return res.status(403).json({
        success: false,
        message: "Cannot view your own profile in admin panel",
      });
    }

    const user = await User.findByPk(id, {
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "bloodGroup", "emergencyContact", "contactInfo"],
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: [
            "id",
            "licenseNumber",
            "experience",
            "bio",
            "contactInfo",
          ],
        },
        {
          model: Pharmacy,
          as: "pharmacy",
          attributes: [
            "id",
            "name",
            "licenseNumber",
            "description",
            "contactInfo",
          ],
        },

        {
          model: ActivityLog,
          as: "activityLogs",
          attributes: ["id", "action", "description", "createdAt"],
          order: [["createdAt", "DESC"]],
          limit: 10,
        },
      ],
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "gender",
        "dob",
        "address",
        "avatar",
        "isActive",
        "emailVerified",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const formattedUser = formatUserData(user);

    res.json({
      success: true,
      data: formattedUser,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

// Update user status (activate/deactivate)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const currentUserId = req.authUser.id;

    if (parseInt(id) === currentUserId) {
      return res.status(403).json({
        success: false,
        message: "Cannot modify your own account status",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.update({ isActive });

    // Log the activity
    await ActivityLog.create({
      user_id: currentUserId,
      action: "UPDATE_USER_STATUS",
      description: `Updated user ${user.name} (${user.email}) status to ${isActive ? "active" : "inactive"}`,
    });

    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

// Get user activity logs
const getUserActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const currentUserId = req.authUser.id;

    if (parseInt(id) === currentUserId) {
      return res.status(403).json({
        success: false,
        message: "Cannot view your own activity in admin panel",
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: activities } = await ActivityLog.findAndCountAll({
      where: { user_id: id },
      attributes: ["id", "action", "description", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user activity",
      error: error.message,
    });
  }
};

// Get user presence status (for doctors to check patient availability)
const getUserPresence = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user (patient)
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "role", "isActive"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is a patient
    if (user.role !== "patient") {
      return res.status(400).json({
        success: false,
        message: "Can only check presence for patients",
      });
    }

    // Get Socket.io instance to check active connections
    let isOnline = false;

    try {
      const io = getIO();
      // Check if user has any active socket connections
      const sockets = await io.fetchSockets();

      isOnline = sockets.some((socket) => socket.userId === user.id);
    } catch (error) {
      console.warn(
        "Socket.io not available for presence check:",
        error.message
      );
      // Fallback to false if socket not available
      isOnline = false;
    }

    logger.info(user.name + " isOnline? ", isOnline);
    logger.info(user.name + " isActive? ", user.isActive);

    res.json({
      success: true,
      data: {
        userId: user.id,
        isOnline: isOnline && user.isActive,
        userName: user.name,
        userEmail: user.email,
      },
    });
  } catch (error) {
    console.error("Error checking user presence:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check user presence",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserStats,
  getUserById,
  updateUserStatus,
  getUserActivity,
  getUserPresence,
};
