"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Consultation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Consultation belongs to a patient
      Consultation.belongsTo(models.User, {
        foreignKey: "patientId",
        as: "patient",
      });

      // Consultation belongs to a doctor
      Consultation.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctor",
      });

      // Consultation has many messages
      Consultation.hasMany(models.ConsultationMessage, {
        foreignKey: "consultationId",
        as: "messages",
      });

      // Consultation has many prescriptions
      Consultation.hasMany(models.Prescription, {
        foreignKey: "consultationId",
        as: "prescriptions",
      });

      // Consultation has many payments
      Consultation.hasMany(models.Payment, {
        foreignKey: "consultationId",
        as: "payments",
      });
    }
  }
  Consultation.init(
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
      appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      consultationType: {
        type: DataTypes.ENUM("video", "audio", "chat", "in_person"),
        allowNull: false,
        defaultValue: "video",
        validate: {
          isIn: [["video", "audio", "chat", "in_person"]],
        },
      },
      status: {
        type: DataTypes.ENUM(
          "scheduled",
          "confirmed",
          "in_progress",
          "completed",
          "cancelled",
          "no_show"
        ),
        allowNull: false,
        defaultValue: "scheduled",
        validate: {
          isIn: [
            [
              "scheduled",
              "confirmed",
              "in_progress",
              "completed",
              "cancelled",
              "no_show",
            ],
          ],
        },
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isFutureDate(value) {
            if (value && new Date(value) <= new Date()) {
              throw new Error("Scheduled time must be in the future");
            }
          },
        },
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      meetingId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      meetingUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      recordingUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      symptoms: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      diagnosis: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
      },
      treatment: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
      },
      consultationFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cancelledBy: {
        type: DataTypes.ENUM("patient", "doctor", "admin", "system"),
        allowNull: true,
        validate: {
          isIn: [["patient", "doctor", "admin", "system"]],
        },
      },
      cancellationReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 500],
        },
      },
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      patientRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
      patientFeedback: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      patientConnectionQuality: {
        type: DataTypes.ENUM("excellent", "good", "fair", "poor"),
        allowNull: true,
        validate: {
          isIn: [["excellent", "good", "fair", "poor"]],
        },
      },
      doctorConnectionQuality: {
        type: DataTypes.ENUM("excellent", "good", "fair", "poor"),
        allowNull: true,
        validate: {
          isIn: [["excellent", "good", "fair", "poor"]],
        },
      },
    },
    {
      sequelize,
      modelName: "Consultation",
      tableName: "Consultations",
      timestamps: true,
      indexes: [
        {
          fields: ["patientId"],
        },
        {
          fields: ["doctorId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["scheduledAt"],
        },
        {
          fields: ["consultationType"],
        },
        {
          fields: ["isPaid"],
        },
        {
          fields: ["meetingId"],
          unique: true,
        },
      ],
      hooks: {
        beforeCreate: (consultation) => {
          // Ensure text fields are properly formatted
          if (consultation.reason) {
            consultation.reason = consultation.reason.trim();
          }
          if (consultation.diagnosis) {
            consultation.diagnosis = consultation.diagnosis.trim();
          }
          if (consultation.treatment) {
            consultation.treatment = consultation.treatment.trim();
          }
          if (consultation.notes) {
            consultation.notes = consultation.notes.trim();
          }
          if (consultation.cancellationReason) {
            consultation.cancellationReason =
              consultation.cancellationReason.trim();
          }
          if (consultation.patientFeedback) {
            consultation.patientFeedback = consultation.patientFeedback.trim();
          }
        },
        beforeUpdate: (consultation) => {
          // Ensure text fields are properly formatted
          if (consultation.reason) {
            consultation.reason = consultation.reason.trim();
          }
          if (consultation.diagnosis) {
            consultation.diagnosis = consultation.diagnosis.trim();
          }
          if (consultation.treatment) {
            consultation.treatment = consultation.treatment.trim();
          }
          if (consultation.notes) {
            consultation.notes = consultation.notes.trim();
          }
          if (consultation.cancellationReason) {
            consultation.cancellationReason =
              consultation.cancellationReason.trim();
          }
          if (consultation.patientFeedback) {
            consultation.patientFeedback = consultation.patientFeedback.trim();
          }
        },
      },
    }
  );
  return Consultation;
};
