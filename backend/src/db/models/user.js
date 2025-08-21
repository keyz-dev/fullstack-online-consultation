"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User has one patient profile
      User.hasOne(models.Patient, {
        foreignKey: "userId",
        as: "patient",
      });

      // User has one doctor profile
      User.hasOne(models.Doctor, {
        foreignKey: "userId",
        as: "doctor",
      });

      // User has many testimonials
      User.hasMany(models.Testimonial, {
        foreignKey: "userId",
        as: "testimonials",
      });

      // User has many application payments
      User.hasMany(models.ApplicationPayment, {
        foreignKey: "userId",
        as: "applicationPayments",
      });

      // User has many notifications
      User.hasMany(models.Notification, {
        foreignKey: "user_id",
        as: "notifications",
      });

      // User has many activity logs
      User.hasMany(models.ActivityLog, {
        foreignKey: "user_id",
        as: "activityLogs",
      });
    }

    // Instance method to check password
    async comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    }

    // Helper method to check if user is a doctor
    isDoctor() {
      return this.role === "doctor";
    }

    // Helper method to check if user is a patient
    isPatient() {
      return this.role === "patient";
    }

    // Helper method to check if user is an admin
    isAdmin() {
      return this.role === "admin";
    }

    // Helper method to check if user is a pharmacy
    isPharmacy() {
      return this.role === "pharmacy";
    }

    // Generate JWT token for authentication
    generateAuthToken() {
      const jwt = require("jsonwebtoken");
      const payload = {
        id: this.id,
        email: this.email,
        role: this.role,
      };
      return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME || "7d",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true, // Nullable for OAuth users
        validate: {
          len: [6, 255],
        },
      },
      role: {
        type: DataTypes.ENUM("patient", "doctor", "admin", "pharmacy"),
        allowNull: false,
        defaultValue: "patient",
        validate: {
          isIn: [["patient", "doctor", "admin", "pharmacy"]],
        },
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: true,
        validate: {
          isIn: [["male", "female", "other"]],
        },
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: true,
          isPast(value) {
            if (value && new Date(value) >= new Date()) {
              throw new Error("Date of birth must be in the past");
            }
          },
        },
      },
      address: {
        type: DataTypes.JSONB,
        allowNull: true,
        validate: {
          isValidAddress(value) {
            if (value && typeof value !== "object") {
              throw new Error("Address must be a valid object");
            }
          },
        },
      },
      avatar: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      authProvider: {
        type: DataTypes.ENUM("local", "google", "facebook", "apple"),
        defaultValue: "local",
        validate: {
          isIn: [["local", "google", "facebook", "apple"]],
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emailVerificationCode: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      emailVerificationExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      hasPaidApplicationFee: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
      indexes: [
        {
          fields: ["email"],
          unique: true,
        },
        {
          fields: ["role"],
        },
        {
          fields: ["isApproved"],
        },
        {
          fields: ["isActive"],
        },
        {
          fields: ["emailVerified"],
        },
        {
          fields: ["authProvider"],
        },
      ],
      hooks: {
        beforeCreate: async (user) => {
          // Generate verification code for doctors and pharmacies
          if (
            (user.role === "doctor" || user.role === "pharmacy") &&
            !user.emailVerified
          ) {
            user.emailVerificationCode = Math.floor(
              100000 + Math.random() * 900000
            ).toString();
            user.emailVerificationExpires = new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ); // 24 hours
          }

          // Ensure name and email are properly formatted
          if (user.name) {
            user.name = user.name.trim();
          }
          if (user.email) {
            user.email = user.email.toLowerCase().trim();
          }
        },
        beforeSave: async (user) => {
          // Only hash the password if it has been modified (or is new)
          if (user.changed("password") && user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }

          // Ensure name and email are properly formatted
          if (user.name) {
            user.name = user.name.trim();
          }
          if (user.email) {
            user.email = user.email.toLowerCase().trim();
          }
        },
      },
    }
  );
  return User;
};
