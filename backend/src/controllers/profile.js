const { User, Patient, Doctor, Pharmacy } = require("../db/models");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const {
  userUpdateSchema,
  userPasswordUpdateSchema,
} = require("../schema/userSchema");
const {
  cleanUpInstanceImages,
  cleanUpFileImages,
} = require("../utils/imageCleanup");
const formatUserData = require("../utils/returnFormats/userData");

// Get currently logged in user profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.authUser.id, {
      include: [
        { model: Patient, as: "patient" },
        { model: Doctor, as: "doctor" },
        { model: Pharmacy, as: "pharmacy" },
      ],
    });

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    res.status(200).json({
      success: true,
      data: formatUserData(user),
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.authUser.id);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    const { name, email, gender, dob, address, bio } = req.body;

    // Update fields if provided
    if (name) user.name = name;
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({
        where: { email, id: { [User.sequelize.Op.ne]: user.id } },
      });
      if (existingUser) {
        return next(new BadRequestError("Email is already in use"));
      }
      user.email = email;
      user.emailVerified = false; // Require re-verification
    }
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (address) user.address = address;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: formatUserData(user),
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
};

// Update user password
exports.updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.authUser.id);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return next(new BadRequestError("Current password is incorrect"));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update user avatar
exports.updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.authUser.id);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    if (!req.file) {
      return next(new BadRequestError("No avatar file provided"));
    }

    // Clean up old avatar if exists
    if (user.avatar) {
      await cleanUpInstanceImages(user, ["avatar"]);
    }

    user.avatar = req.file.path;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: { avatar: user.avatar },
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
};

// Delete user avatar
exports.deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.authUser.id);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    if (user.avatar) {
      await cleanUpInstanceImages(user, ["avatar"]);
      user.avatar = null;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Avatar removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics
exports.getUserStats = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.authUser.id);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    // Get user-specific statistics based on role
    let stats = {
      memberSince: user.createdAt,
      lastLogin: user.updatedAt,
    };

    // Add role-specific stats
    switch (user.role) {
      case "admin":
        stats = {
          ...stats,
          totalUsers: await User.count(),
          totalDoctors: await User.count({ where: { role: "doctor" } }),
          totalPharmacies: await User.count({ where: { role: "pharmacy" } }),
          totalPatients: await User.count({ where: { role: "patient" } }),
          // Add more admin-specific stats
        };
        break;
      case "doctor":
        // Add doctor-specific stats
        break;
      case "patient":
        // Add patient-specific stats
        break;
      case "pharmacy":
        // Add pharmacy-specific stats
        break;
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Update user preferences
exports.updatePreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByPk(req.authUser.id);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      data: { preferences: user.preferences },
    });
  } catch (error) {
    next(error);
  }
};
