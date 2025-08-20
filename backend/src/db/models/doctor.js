"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Doctor belongs to a user
      Doctor.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // Doctor has many consultations
      Doctor.hasMany(models.Consultation, {
        foreignKey: "doctorId",
        as: "consultations",
      });

      // Doctor has many payments
      Doctor.hasMany(models.Payment, {
        foreignKey: "doctorId",
        as: "payments",
      });

      // Doctor has many prescriptions
      Doctor.hasMany(models.Prescription, {
        foreignKey: "doctorId",
        as: "prescriptions",
      });

      // Doctor has many availabilities
      Doctor.hasMany(models.DoctorAvailability, {
        foreignKey: "doctorId",
        as: "availabilities",
      });

      // Doctor has many testimonials
      Doctor.hasMany(models.Testimonial, {
        foreignKey: "doctorId",
        as: "testimonials",
      });
    }
  }
  Doctor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      licenseNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [5, 50],
        },
      },
      experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 50,
        },
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
      },
      education: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      languages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        validate: {
          isValidLanguages(value) {
            if (value && (!Array.isArray(value) || value.length === 0)) {
              throw new Error("Languages must be a non-empty array");
            }
          },
        },
      },
      specialties: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        validate: {
          isValidSpecialties(value) {
            if (value && (!Array.isArray(value) || value.length === 0)) {
              throw new Error("Specialties must be a non-empty array");
            }
          },
        },
      },
      clinicAddress: {
        type: DataTypes.JSONB,
        allowNull: true,
        validate: {
          isValidAddress(value) {
            if (value && typeof value !== "object") {
              throw new Error("Clinic address must be a valid object");
            }
          },
        },
      },
      operationalHospital: {
        type: DataTypes.STRING(200),
        allowNull: true,
        validate: {
          len: [0, 200],
        },
      },
      contactInfo: {
        type: DataTypes.JSONB,
        allowNull: true,
        validate: {
          isValidContactInfo(value) {
            if (value && typeof value !== "object") {
              throw new Error("Contact info must be a valid object");
            }
          },
        },
      },
      documents: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      paymentMethods: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      consultationFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      consultationDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
        validate: {
          min: 15,
          max: 120,
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      averageRating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        validate: {
          min: 0,
          max: 5,
        },
      },
      totalReviews: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      adminNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
    },
    {
      sequelize,
      modelName: "Doctor",
      tableName: "Doctors",
      timestamps: true,
      indexes: [
        {
          fields: ["userId"],
          unique: true,
        },
        {
          fields: ["licenseNumber"],
          unique: true,
        },
        {
          fields: ["isApproved"],
        },
        {
          fields: ["isVerified"],
        },
        {
          fields: ["isActive"],
        },
        {
          fields: ["averageRating"],
        },
        {
          fields: ["specialties"],
          using: "gin",
        },
      ],
      hooks: {
        beforeCreate: (doctor) => {
          // Ensure license number is properly formatted
          if (doctor.licenseNumber) {
            doctor.licenseNumber = doctor.licenseNumber.trim().toUpperCase();
          }
          if (doctor.bio) {
            doctor.bio = doctor.bio.trim();
          }
        },
        beforeUpdate: (doctor) => {
          // Ensure license number is properly formatted
          if (doctor.licenseNumber) {
            doctor.licenseNumber = doctor.licenseNumber.trim().toUpperCase();
          }
          if (doctor.bio) {
            doctor.bio = doctor.bio.trim();
          }
        },
      },
    }
  );
  return Doctor;
};
