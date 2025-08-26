"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TimeSlot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // TimeSlot belongs to a DoctorAvailability
      TimeSlot.belongsTo(models.DoctorAvailability, {
        foreignKey: "doctorAvailabilityId",
        as: "availability",
      });

      // TimeSlot has one Appointment (when booked)
      TimeSlot.hasOne(models.Appointment, {
        foreignKey: "timeSlotId",
        as: "appointment",
      });
    }

    // Instance method to check if slot is available for booking
    isAvailableForBooking() {
      return this.isAvailable && !this.isBooked;
    }

    // Instance method to get formatted time range
    getTimeRange() {
      return `${this.startTime} - ${this.endTime}`;
    }

    // Instance method to get full date and time
    getFullDateTime() {
      return `${this.date} ${this.startTime}`;
    }

    // Instance method to check if slot is in the past
    isInPast() {
      const now = new Date();
      const slotDateTime = new Date(`${this.date} ${this.startTime}`);
      return slotDateTime < now;
    }

    // Instance method to check if slot is today
    isToday() {
      const today = new Date().toISOString().split("T")[0];
      return this.date === today;
    }
  }

  TimeSlot.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      doctorAvailabilityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "DoctorAvailabilities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          isAfterStartTime(value) {
            if (value && this.startTime && value <= this.startTime) {
              throw new Error("End time must be after start time");
            }
          },
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isNotPast(value) {
            if (value && new Date(value) < new Date().setHours(0, 0, 0, 0)) {
              throw new Error("Date cannot be in the past");
            }
          },
        },
      },
      isBooked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "TimeSlot",
      tableName: "TimeSlots",
      timestamps: true,
      indexes: [
        {
          fields: ["doctorAvailabilityId"],
        },
        {
          fields: ["date"],
        },
        {
          fields: ["startTime"],
        },
        {
          fields: ["isBooked"],
        },
        {
          fields: ["date", "startTime"],
        },
        {
          fields: ["doctorAvailabilityId", "date"],
        },
      ],
      hooks: {
        beforeCreate: (timeSlot) => {
          // Ensure times are properly formatted
          if (timeSlot.startTime) {
            timeSlot.startTime = timeSlot.startTime.toString().slice(0, 5);
          }
          if (timeSlot.endTime) {
            timeSlot.endTime = timeSlot.endTime.toString().slice(0, 5);
          }
        },
        beforeUpdate: (timeSlot) => {
          // Ensure times are properly formatted
          if (timeSlot.startTime) {
            timeSlot.startTime = timeSlot.startTime.toString().slice(0, 5);
          }
          if (timeSlot.endTime) {
            timeSlot.endTime = timeSlot.endTime.toString().slice(0, 5);
          }
        },
      },
    }
  );
  return TimeSlot;
};
