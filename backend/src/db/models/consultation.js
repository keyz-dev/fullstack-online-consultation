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
      // Consultation belongs to an Appointment
      Consultation.belongsTo(models.Appointment, {
        foreignKey: "appointmentId",
        as: "appointment",
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
    }

    // Instance method to check if consultation is not started
    isNotStarted() {
      return this.status === "not_started";
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
      return this.status === "not_started";
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
      appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Appointments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: DataTypes.ENUM(
          "not_started",
          "in_progress",
          "completed",
          "cancelled",
          "no_show"
        ),
        allowNull: false,
        defaultValue: "not_started",
        validate: {
          isIn: [
            ["not_started", "in_progress", "completed", "cancelled", "no_show"],
          ],
        },
      },
      type: {
        type: DataTypes.ENUM("video_call", "voice_call", "chat", "in_person"),
        allowNull: false,
        validate: {
          isIn: [["video_call", "voice_call", "chat", "in_person"]],
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
    },
    {
      sequelize,
      modelName: "Consultation",
      tableName: "Consultations",
      timestamps: true,
      indexes: [
        {
          fields: ["appointmentId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["type"],
        },
        {
          fields: ["startedAt"],
        },
        {
          fields: ["endedAt"],
        },
        {
          fields: ["followUpDate"],
        },
      ],
      hooks: {
        beforeUpdate: (consultation) => {
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
