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
      Consultation.belongsTo(models.Patient, {
        foreignKey: "patientId",
        as: "patient",
      });

      // Consultation belongs to a doctor
      Consultation.belongsTo(models.Doctor, {
        foreignKey: "doctorId",
        as: "doctor",
      });

      // Consultation has many consultation messages
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

    // Instance method to check if consultation is scheduled
    isScheduled() {
      return this.status === "scheduled";
    }

    // Instance method to check if consultation is in progress
    isInProgress() {
      return this.status === "in_progress";
    }

    // Instance method to check if consultation is completed
    isCompleted() {
      return this.status === "completed";
    }

    // Instance method to check if consultation is cancelled
    isCancelled() {
      return this.status === "cancelled";
    }

    // Instance method to check if consultation is no show
    isNoShow() {
      return this.status === "no_show";
    }

    // Instance method to check if consultation can be started
    canBeStarted() {
      return this.status === "scheduled" && new Date() >= this.scheduledAt;
    }

    // Instance method to check if consultation can be cancelled
    canBeCancelled() {
      return this.status === "scheduled" && new Date() < this.scheduledAt;
    }

    // Instance method to calculate duration
    calculateDuration() {
      if (this.startedAt && this.endedAt) {
        const durationMs = new Date(this.endedAt) - new Date(this.startedAt);
        return Math.round(durationMs / (1000 * 60)); // Convert to minutes
      }
      return null;
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
          model: "Patients",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Doctors",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: DataTypes.ENUM(
          "scheduled",
          "in_progress",
          "completed",
          "cancelled",
          "no_show"
        ),
        allowNull: false,
        defaultValue: "scheduled",
        validate: {
          isIn: [
            ["scheduled", "in_progress", "completed", "cancelled", "no_show"],
          ],
        },
      },
      type: {
        type: DataTypes.ENUM("video_call", "voice_call", "chat", "in_person"),
        allowNull: false,
        defaultValue: "video_call",
        validate: {
          isIn: [["video_call", "voice_call", "chat", "in_person"]],
        },
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isFuture(value) {
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
        comment: "Duration in minutes",
        validate: {
          min: 0,
        },
      },
      symptoms: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        validate: {
          isValidSymptoms(value) {
            if (value && !Array.isArray(value)) {
              throw new Error("Symptoms must be an array");
            }
          },
        },
      },
      diagnosis: {
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
          len: [0, 5000],
        },
      },
      followUpDate: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isFuture(value) {
            if (value && new Date(value) <= new Date()) {
              throw new Error("Follow-up date must be in the future");
            }
          },
        },
      },
      followUpNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      cancellationReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 500],
        },
      },
      cancelledBy: {
        type: DataTypes.ENUM("patient", "doctor", "system"),
        allowNull: true,
        validate: {
          isIn: [["patient", "doctor", "system"]],
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
          fields: ["type"],
        },
        {
          fields: ["patientId", "doctorId"],
        },
      ],
      hooks: {
        beforeCreate: (consultation) => {
          // Ensure symptoms is an array
          if (consultation.symptoms && !Array.isArray(consultation.symptoms)) {
            consultation.symptoms = [consultation.symptoms];
          }
        },
        beforeUpdate: (consultation) => {
          // Ensure symptoms is an array
          if (consultation.symptoms && !Array.isArray(consultation.symptoms)) {
            consultation.symptoms = [consultation.symptoms];
          }

          // Calculate duration when consultation ends
          if (
            consultation.changed("endedAt") &&
            consultation.endedAt &&
            consultation.startedAt
          ) {
            consultation.duration = consultation.calculateDuration();
          }
        },
      },
    }
  );
  return Consultation;
};
