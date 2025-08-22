"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DoctorSpecialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // DoctorSpecialty belongs to a doctor
      DoctorSpecialty.belongsTo(models.Doctor, {
        foreignKey: "doctorId",
        as: "doctor",
      });

      // DoctorSpecialty belongs to a specialty
      DoctorSpecialty.belongsTo(models.Specialty, {
        foreignKey: "specialtyId",
        as: "specialty",
      });
    }
  }

  DoctorSpecialty.init(
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
      specialtyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Specialties",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "DoctorSpecialty",
      tableName: "DoctorSpecialties",
      timestamps: true,
      indexes: [
        {
          fields: ["doctorId", "specialtyId"],
          unique: true,
        },
        {
          fields: ["doctorId"],
        },
        {
          fields: ["specialtyId"],
        },
      ],
    }
  );
  return DoctorSpecialty;
};
