"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Symptom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Symptom belongs to a specialty
      Symptom.belongsTo(models.Specialty, {
        foreignKey: "specialtyId",
        as: "specialty",
      });
    }
  }

  Symptom.init(
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
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      iconUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      specialtyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Specialties",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Symptom",
      tableName: "Symptoms",
      timestamps: true,
      indexes: [
        {
          fields: ["name"],
        },
        {
          fields: ["specialtyId"],
        },
      ],
    }
  );
  return Symptom;
};
