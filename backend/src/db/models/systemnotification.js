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
      // No associations needed for SystemNotification
    }

    // Instance method to check if notification is active
    isActive() {
      return this.isActive === true;
    }

    // Instance method to check if notification is global
    isGlobal() {
      return this.isGlobal === true;
    }

    // Instance method to check if notification is critical
    isCritical() {
      return this.priority === "critical";
    }

    // Instance method to check if notification is high priority
    isHighPriority() {
      return this.priority === "high" || this.priority === "critical";
    }

    // Instance method to check if notification is currently valid
    isCurrentlyValid() {
      const now = new Date();

      if (this.startDate && now < new Date(this.startDate)) {
        return false;
      }

      if (this.endDate && now > new Date(this.endDate)) {
        return false;
      }

      return this.isActive;
    }

    // Instance method to check if notification targets a specific role
    targetsRole(role) {
      if (this.isGlobal) return true;
      if (!this.targetRoles || this.targetRoles.length === 0) return false;
      return this.targetRoles.includes(role);
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
      type: {
        type: DataTypes.ENUM(
          "maintenance",
          "update",
          "announcement",
          "security",
          "feature",
          "general"
        ),
        allowNull: false,
        validate: {
          isIn: [
            [
              "maintenance",
              "update",
              "announcement",
              "security",
              "feature",
              "general",
            ],
          ],
        },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high", "critical"),
        allowNull: false,
        defaultValue: "medium",
        validate: {
          isIn: [["low", "medium", "high", "critical"]],
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isGlobal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Whether this notification should be shown to all users",
      },
      targetRoles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        comment: "Specific roles this notification targets",
        validate: {
          isValidTargetRoles(value) {
            if (value && !Array.isArray(value)) {
              throw new Error("Target roles must be an array");
            }
            if (value) {
              const validRoles = [
                "patient",
                "doctor",
                "admin",
                "pharmacy",
                "pending_doctor",
                "pending_pharmacy",
              ];
              for (const role of value) {
                if (!validRoles.includes(role)) {
                  throw new Error(`Invalid role: ${role}`);
                }
              }
            }
          },
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "When to start showing this notification",
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "When to stop showing this notification",
        validate: {
          isAfterStartDate(value) {
            if (
              value &&
              this.startDate &&
              new Date(value) <= new Date(this.startDate)
            ) {
              throw new Error("End date must be after start date");
            }
          },
        },
      },
      actionUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "URL to redirect to when notification is clicked",
        validate: {
          isUrl: true,
          len: [0, 500],
        },
      },
      actionText: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "Text for the action button",
        validate: {
          len: [0, 100],
        },
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "Additional data for the notification",
        validate: {
          isValidData(value) {
            if (value && typeof value !== "object") {
              throw new Error("Data must be a valid object");
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
          fields: ["type"],
        },
        {
          fields: ["priority"],
        },
        {
          fields: ["isActive"],
        },
        {
          fields: ["isGlobal"],
        },
        {
          fields: ["startDate"],
        },
        {
          fields: ["endDate"],
        },
        {
          fields: ["targetRoles"],
          using: "gin",
        },
      ],
      hooks: {
        beforeCreate: (notification) => {
          // Ensure title and message are properly formatted
          if (notification.title) {
            notification.title = notification.title.trim();
          }
          if (notification.message) {
            notification.message = notification.message.trim();
          }
          if (notification.actionText) {
            notification.actionText = notification.actionText.trim();
          }
        },
        beforeUpdate: (notification) => {
          // Ensure title and message are properly formatted
          if (notification.title) {
            notification.title = notification.title.trim();
          }
          if (notification.message) {
            notification.message = notification.message.trim();
          }
          if (notification.actionText) {
            notification.actionText = notification.actionText.trim();
          }
        },
      },
    }
  );
  return SystemNotification;
};
