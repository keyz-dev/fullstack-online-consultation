"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ContactInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }

  ContactInformation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      iconUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "defaultIcon.png",
        validate: {
          len: [0, 255],
        },
      },
      inputType: {
        type: DataTypes.ENUM("phone", "email", "url", "text", "time"),
        allowNull: false,
        defaultValue: "text",
        comment: "Type of input field to render in the frontend",
      },
      placeholder: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Placeholder text for the input field",
      },
      validationPattern: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "Regex pattern for validation (optional)",
      },
      isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Whether this contact method requires a value",
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Order in which to display this contact method",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Whether this contact method is available for selection",
      },
    },
    {
      sequelize,
      modelName: "ContactInformation",
      tableName: "ContactInformations",
      timestamps: true,
      indexes: [
        {
          fields: ["name"],
        },
        {
          fields: ["displayOrder"],
        },
        {
          fields: ["isActive"],
        },
      ],
      hooks: {
        beforeCreate: (contactInfo) => {
          // Ensure name is properly formatted
          if (contactInfo.name) {
            contactInfo.name = contactInfo.name.trim();
          }
        },
        beforeUpdate: (contactInfo) => {
          // Ensure name is properly formatted
          if (contactInfo.name) {
            contactInfo.name = contactInfo.name.trim();
          }
        },
      },
    }
  );
  return ContactInformation;
};
