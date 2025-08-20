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
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      breakStartTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      breakEndTime: {
        type: DataTypes.TIME,
        allowNull: true,
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
      ],
    }
  );

  return DoctorAvailability;
};
