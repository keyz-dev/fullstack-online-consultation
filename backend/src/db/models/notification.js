"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Notification belongs to a user
      Notification.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }

    // Instance method to mark notification as read
    async markAsRead() {
      this.isRead = true;
      this.readAt = new Date();
      return await this.save();
    }

    // Instance method to check if notification is expired
    isExpired() {
      if (!this.expiresAt) return false;
      return new Date() > new Date(this.expiresAt);
    }

    // Instance method to check if notification is scheduled
    isScheduled() {
      return this.scheduledAt && new Date() < new Date(this.scheduledAt);
    }

    // Instance method to check if notification is urgent
    isUrgent() {
      return this.priority === "urgent";
    }

    // Instance method to check if notification is high priority
    isHighPriority() {
      return this.priority === "high" || this.priority === "urgent";
    }
  }

  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id", // Explicitly map to database field
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
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
        type: DataTypes.ENUM("low", "medium", "high", "urgent"),
        allowNull: false,
        defaultValue: "medium",
        validate: {
          isIn: [["low", "medium", "high", "urgent"]],
        },
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "isRead", // Explicitly map to database field
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "readAt", // Explicitly map to database field
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
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "When to send the notification",
        field: "scheduledAt", // Explicitly map to database field
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "sentAt", // Explicitly map to database field
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "expiresAt", // Explicitly map to database field
      },
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "Notifications",
      timestamps: true,
      indexes: [
        {
          fields: ["user_id"],
        },
        {
          fields: ["type"],
        },
        {
          fields: ["priority"],
        },
        {
          fields: ["isRead"],
        },
        {
          fields: ["scheduledAt"],
        },
        {
          fields: ["sentAt"],
        },
        {
          fields: ["expiresAt"],
        },
        {
          fields: ["user_id", "isRead"],
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

          // Set sentAt if not scheduled
          if (!notification.scheduledAt) {
            notification.sentAt = new Date();
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

          // Set readAt when marking as read
          if (notification.changed("isRead") && notification.isRead) {
            notification.readAt = new Date();
          }
        },
      },
    }
  );
  return Notification;
};
