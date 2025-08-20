"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SystemNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // System notifications don't have direct associations as they are broadcast messages
    }
  }
  SystemNotification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 2000],
        },
      },
      type: {
        type: DataTypes.ENUM(
          "announcement",
          "maintenance",
          "update",
          "alert",
          "promotion"
        ),
        allowNull: false,
        defaultValue: "announcement",
        validate: {
          isIn: [
            ["announcement", "maintenance", "update", "alert", "promotion"],
          ],
        },
      },
      target_roles: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: ["patient", "doctor", "admin"],
        validate: {
          notEmpty: true,
          isValidRoles(value) {
            const validRoles = ["patient", "doctor", "admin"];
            if (!Array.isArray(value) || value.length === 0) {
              throw new Error("Target roles must be a non-empty array");
            }
            for (const role of value) {
              if (!validRoles.includes(role)) {
                throw new Error(
                  `Invalid role: ${role}. Must be one of: ${validRoles.join(", ")}`
                );
              }
            }
          },
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isFutureDate(value) {
            if (value && new Date(value) <= new Date()) {
              throw new Error("Expiration date must be in the future");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "SystemNotification",
      tableName: "SystemNotifications",
      timestamps: true,
      indexes: [
        {
          fields: ["is_active"],
        },
        {
          fields: ["type"],
        },
        {
          fields: ["expires_at"],
        },
        {
          fields: ["createdAt"],
        },
      ],
      hooks: {
        beforeCreate: (systemNotification) => {
          // Ensure title and message are properly formatted
          if (systemNotification.title) {
            systemNotification.title = systemNotification.title.trim();
          }
          if (systemNotification.message) {
            systemNotification.message = systemNotification.message.trim();
          }
        },
        beforeUpdate: (systemNotification) => {
          // Ensure title and message are properly formatted
          if (systemNotification.title) {
            systemNotification.title = systemNotification.title.trim();
          }
          if (systemNotification.message) {
            systemNotification.message = systemNotification.message.trim();
          }
        },
      },
    }
  );
  return SystemNotification;
};
