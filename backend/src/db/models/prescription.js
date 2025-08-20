"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Prescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Prescription belongs to a patient
      Prescription.belongsTo(models.User, {
        foreignKey: "patientId",
        as: "patient",
      });

      // Prescription belongs to a doctor
      Prescription.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctor",
      });

      // Prescription belongs to a consultation
      Prescription.belongsTo(models.Consultation, {
        foreignKey: "consultationId",
        as: "consultation",
      });

      // Prescription has many drug orders
      Prescription.hasMany(models.DrugOrder, {
        foreignKey: "prescriptionId",
        as: "drugOrders",
      });
    }
  }
  Prescription.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      consultationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Consultations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      prescriptionNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [5, 50],
        },
      },
      diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 2000],
        },
      },
      symptoms: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      prescriptionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      validUntil: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isFutureDate(value) {
            if (value && new Date(value) <= new Date()) {
              throw new Error("Prescription validity must be in the future");
            }
          },
        },
      },
      status: {
        type: DataTypes.ENUM(
          "active",
          "expired",
          "cancelled",
          "completed",
          "suspended"
        ),
        allowNull: false,
        defaultValue: "active",
        validate: {
          isIn: [["active", "expired", "cancelled", "completed", "suspended"]],
        },
      },
      allergies: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      doctorSignature: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      recommendedPharmacy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        validate: {
          len: [0, 200],
        },
      },
      followUpRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      followUpDate: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isFutureDate(value) {
            if (value && new Date(value) <= new Date()) {
              throw new Error("Follow-up date must be in the future");
            }
          },
        },
      },
      patientAcknowledged: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      patientAcknowledgedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Prescription",
      tableName: "Prescriptions",
      timestamps: true,
      indexes: [
        {
          fields: ["patientId"],
        },
        {
          fields: ["doctorId"],
        },
        {
          fields: ["consultationId"],
        },
        {
          fields: ["prescriptionNumber"],
          unique: true,
        },
        {
          fields: ["status"],
        },
        {
          fields: ["prescriptionDate"],
        },
        {
          fields: ["validUntil"],
        },
        {
          fields: ["followUpRequired"],
        },
      ],
      hooks: {
        beforeCreate: (prescription) => {
          // Generate prescription number if not provided
          if (!prescription.prescriptionNumber) {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            prescription.prescriptionNumber = `PRES-${timestamp}-${random}`;
          }

          // Ensure text fields are properly formatted
          if (prescription.diagnosis) {
            prescription.diagnosis = prescription.diagnosis.trim();
          }
          if (prescription.notes) {
            prescription.notes = prescription.notes.trim();
          }
          if (prescription.recommendedPharmacy) {
            prescription.recommendedPharmacy =
              prescription.recommendedPharmacy.trim();
          }
        },
        beforeUpdate: (prescription) => {
          // Ensure text fields are properly formatted
          if (prescription.diagnosis) {
            prescription.diagnosis = prescription.diagnosis.trim();
          }
          if (prescription.notes) {
            prescription.notes = prescription.notes.trim();
          }
          if (prescription.recommendedPharmacy) {
            prescription.recommendedPharmacy =
              prescription.recommendedPharmacy.trim();
          }
        },
      },
    }
  );
  return Prescription;
};
