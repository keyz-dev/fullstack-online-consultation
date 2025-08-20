"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ContactInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ContactInformation is a system configuration table, no direct associations needed
    }
  }

  ContactInformation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [2, 50],
        },
      },
      displayName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
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
      isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      validationRegex: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      adminNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ContactInformation",
      tableName: "ContactInformations",
      timestamps: true,
      indexes: [
        {
          fields: ["type"],
          unique: true,
        },
        {
          fields: ["isActive"],
        },
      ],
    }
  );

  return ContactInformation;
};
