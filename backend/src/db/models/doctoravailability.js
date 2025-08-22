"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DoctorAvailability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // DoctorAvailability belongs to a doctor
      DoctorAvailability.belongsTo(models.Doctor, {
        foreignKey: "doctorId",
        as: "doctor",
      });
    }

    // Instance method to check if availability is active
    isActive() {
      return this.isAvailable === true;
    }

    // Instance method to get day name
    getDayName() {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[this.dayOfWeek] || "Unknown";
    }

    // Instance method to check if time is within availability
    isTimeWithinAvailability(time) {
      const checkTime = new Date(`2000-01-01 ${time}`);
      const startTime = new Date(`2000-01-01 ${this.startTime}`);
      const endTime = new Date(`2000-01-01 ${this.endTime}`);

      return checkTime >= startTime && checkTime <= endTime;
    }

    // Instance method to get available slots
    getAvailableSlots() {
      if (!this.isAvailable) return [];

      const slots = [];
      const startTime = new Date(`2000-01-01 ${this.startTime}`);
      const endTime = new Date(`2000-01-01 ${this.endTime}`);
      const duration = this.consultationDuration || 30;

      let currentTime = new Date(startTime);

      while (currentTime < endTime) {
        const slotEnd = new Date(currentTime.getTime() + duration * 60000);
        if (slotEnd <= endTime) {
          slots.push({
            start: currentTime.toTimeString().slice(0, 5),
            end: slotEnd.toTimeString().slice(0, 5),
          });
        }
        currentTime = slotEnd;
      }

      return slots;
    }
  }

  DoctorAvailability.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      dayOfWeek: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 6,
        },
        comment: "0 = Sunday, 1 = Monday, ..., 6 = Saturday",
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
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      maxPatients: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
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
        comment: "Duration in minutes",
      },
    },
    {
      sequelize,
      modelName: "DoctorAvailability",
      tableName: "DoctorAvailabilities",
      timestamps: true,
      indexes: [
        {
          fields: ["doctorId"],
        },
        {
          fields: ["dayOfWeek"],
        },
        {
          fields: ["isAvailable"],
        },
        {
          fields: ["doctorId", "dayOfWeek"],
        },
      ],
      hooks: {
        beforeCreate: (availability) => {
          // Ensure times are properly formatted
          if (availability.startTime) {
            availability.startTime = availability.startTime
              .toString()
              .slice(0, 5);
          }
          if (availability.endTime) {
            availability.endTime = availability.endTime.toString().slice(0, 5);
          }
        },
        beforeUpdate: (availability) => {
          // Ensure times are properly formatted
          if (availability.startTime) {
            availability.startTime = availability.startTime
              .toString()
              .slice(0, 5);
          }
          if (availability.endTime) {
            availability.endTime = availability.endTime.toString().slice(0, 5);
          }
        },
      },
    }
  );
  return DoctorAvailability;
};
