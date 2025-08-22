"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Specialty has many symptoms
      Specialty.hasMany(models.Symptom, {
        foreignKey: "specialtyId",
        as: "symptoms",
      });

      // Specialty belongs to many doctors through DoctorSpecialties
      Specialty.belongsToMany(models.Doctor, {
        through: "DoctorSpecialties",
        foreignKey: "specialtyId",
        otherKey: "doctorId",
        as: "doctors",
      });
    }
  }

  Specialty.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Specialty",
      tableName: "Specialties",
      timestamps: true,
      indexes: [
        {
          fields: ["name"],
          unique: true,
        },
        {
          fields: ["isActive"],
        },
      ],
    }
  );
  return Specialty;
};
