"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Patient belongs to a user
      Patient.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // Patient has many consultations
      Patient.hasMany(models.Consultation, {
        foreignKey: "patientId",
        as: "consultations",
      });

      // Patient has many payments
      Patient.hasMany(models.Payment, {
        foreignKey: "patientId",
        as: "payments",
      });

      // Patient has many prescriptions
      Patient.hasMany(models.Prescription, {
        foreignKey: "patientId",
        as: "prescriptions",
      });

      // Patient has many drug orders
      Patient.hasMany(models.DrugOrder, {
        foreignKey: "patientId",
        as: "drugOrders",
      });

      // Patient has many testimonials
      Patient.hasMany(models.Testimonial, {
        foreignKey: "patientId",
        as: "testimonials",
      });
    }
  }

  Patient.init(
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
      bloodGroup: {
        type: DataTypes.ENUM("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"),
        allowNull: true,
        validate: {
          isIn: [["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]],
        },
      },
      allergies: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        validate: {
          isValidAllergies(value) {
            if (value && !Array.isArray(value)) {
              throw new Error("Allergies must be an array");
            }
          },
        },
      },
      emergencyContact: {
        type: DataTypes.JSONB,
        allowNull: true,
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
      medicalDocuments: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        validate: {
          isValidDocuments(value) {
            if (value && !Array.isArray(value)) {
              throw new Error("Medical documents must be an array");
            }
          },
        },
      },
      insuranceInfo: {
        type: DataTypes.JSONB,
        allowNull: true,
        validate: {
          isValidInsuranceInfo(value) {
            if (value && typeof value !== "object") {
              throw new Error("Insurance info must be a valid object");
            }
          },
        },
      },
      preferredLanguage: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "English",
        validate: {
          len: [0, 50],
        },
      },
    },
    {
      sequelize,
      modelName: "Patient",
      tableName: "Patients",
      timestamps: true,
      indexes: [
        {
          fields: ["userId"],
          unique: true,
        },
        {
          fields: ["bloodGroup"],
        },
        {
          fields: ["allergies"],
          using: "gin",
        },
      ],
      hooks: {
        beforeCreate: (patient) => {
          // Ensure preferred language is properly formatted
          if (patient.preferredLanguage) {
            patient.preferredLanguage = patient.preferredLanguage.trim();
          }
        },
        beforeUpdate: (patient) => {
          // Ensure preferred language is properly formatted
          if (patient.preferredLanguage) {
            patient.preferredLanguage = patient.preferredLanguage.trim();
          }
        },
      },
    }
  );
  return Patient;
};
