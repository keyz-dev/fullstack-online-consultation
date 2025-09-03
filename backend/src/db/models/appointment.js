"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Appointment belongs to a TimeSlot
      Appointment.belongsTo(models.TimeSlot, {
        foreignKey: "timeSlotId",
        as: "timeSlot",
      });

      // Appointment belongs to a Patient
      Appointment.belongsTo(models.Patient, {
        foreignKey: "patientId",
        as: "patient",
      });

      // Appointment belongs to a Doctor
      Appointment.belongsTo(models.Doctor, {
        foreignKey: "doctorId",
        as: "doctor",
      });

      // Appointment has one Consultation (actual session)
      Appointment.hasOne(models.Consultation, {
        foreignKey: "appointmentId",
        as: "consultation",
      });

      // Appointment has many payments
      Appointment.hasMany(models.Payment, {
        foreignKey: "appointmentId",
        as: "payments",
      });
    }

    // Instance method to check if appointment is pending payment
    isPendingPayment() {
      return this.status === "pending_payment";
    }

    // Instance method to check if appointment is paid
    isPaid() {
      return this.status === "paid";
    }

    // Instance method to check if appointment is confirmed
    isConfirmed() {
      return this.status === "confirmed";
    }

    // Instance method to check if appointment is in progress
    isInProgress() {
      return this.status === "in_progress";
    }

    // Instance method to check if appointment is completed
    isCompleted() {
      return this.status === "completed";
    }

    // Instance method to check if appointment is cancelled
    isCancelled() {
      return this.status === "cancelled";
    }

    // Instance method to check if appointment is no show
    isNoShow() {
      return this.status === "no_show";
    }

    // Instance method to check if appointment can be cancelled
    canBeCancelled() {
      return ["pending_payment", "paid", "confirmed"].includes(this.status);
    }

    // Instance method to get appointment date and time
    getAppointmentDateTime() {
      if (this.timeSlot) {
        return `${this.timeSlot.date} ${this.timeSlot.startTime}`;
      }
      return null;
    }

    // Instance method to get doctor info through timeSlot
    async getDoctor() {
      if (this.timeSlot && this.timeSlot.availability) {
        return await this.timeSlot.availability.getDoctor();
      }
      return null;
    }

    // Instance method to get symptoms details
    async getSymptoms() {
      if (this.symptomIds && this.symptomIds.length > 0) {
        const { Symptom } = sequelize.models;
        return await Symptom.findAll({
          where: { id: this.symptomIds },
        });
      }
      return [];
    }
  }

  Appointment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      timeSlotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "TimeSlots",
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
      status: {
        type: DataTypes.ENUM(
          "pending_payment",
          "paid",
          "confirmed",
          "in_progress",
          "completed",
          "cancelled",
          "no_show"
        ),
        allowNull: false,
        defaultValue: "pending_payment",
        validate: {
          isIn: [
            [
              "pending_payment",
              "paid",
              "confirmed",
              "in_progress",
              "completed",
              "cancelled",
              "no_show",
            ],
          ],
        },
      },
      consultationType: {
        type: DataTypes.ENUM("online", "physical"),
        allowNull: false,
        validate: {
          isIn: [["online", "physical"]],
        },
      },
      symptomIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: [],
        validate: {
          isValidSymptomIds(value) {
            if (value && !Array.isArray(value)) {
              throw new Error("Symptom IDs must be an array");
            }
            if (value && value.some((id) => !Number.isInteger(id) || id <= 0)) {
              throw new Error("All symptom IDs must be positive integers");
            }
          },
        },
        comment: "Array of symptom IDs from the Symptom model",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
        comment: "Additional notes for doctor preparation",
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
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Payment fields
      paymentStatus: {
        type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: [["pending", "paid", "failed", "refunded"]],
        },
      },
      paymentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "Consultation fee amount",
      },
      campayTransactionId: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Campay transaction reference",
      },
    },
    {
      sequelize,
      modelName: "Appointment",
      tableName: "Appointments",
      timestamps: true,
      indexes: [
        {
          fields: ["timeSlotId"],
        },
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
          fields: ["consultationType"],
        },
        {
          fields: ["paymentStatus"],
        },
        {
          fields: ["campayTransactionId"],
        },
        {
          fields: ["patientId", "status"],
        },
        {
          fields: ["cancelledAt"],
        },
      ],
      hooks: {
        beforeCreate: (appointment) => {
          // Ensure symptomIds is an array
          if (
            appointment.symptomIds &&
            !Array.isArray(appointment.symptomIds)
          ) {
            appointment.symptomIds = [appointment.symptomIds];
          }
        },
        beforeUpdate: (appointment) => {
          // Ensure symptomIds is an array
          if (
            appointment.symptomIds &&
            !Array.isArray(appointment.symptomIds)
          ) {
            appointment.symptomIds = [appointment.symptomIds];
          }

          // Set cancelledAt when status changes to cancelled
          if (
            appointment.changed("status") &&
            appointment.status === "cancelled"
          ) {
            appointment.cancelledAt = new Date();
          }
        },
        afterUpdate: async (appointment) => {
          // If appointment is cancelled, mark the time slot as available again
          if (
            appointment.changed("status") &&
            appointment.status === "cancelled"
          ) {
            const { TimeSlot } = sequelize.models;
            await TimeSlot.update(
              { isBooked: false },
              { where: { id: appointment.timeSlotId } }
            );
          }
        },
      },
    }
  );
  return Appointment;
};
