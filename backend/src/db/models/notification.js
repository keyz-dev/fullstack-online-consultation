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
      // define association here
      Notification.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
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
        references: {
          model: "Users",
          key: "id",
        },
      },
      type: {
        type: DataTypes.ENUM(
          // Patient notifications
          "appointment_confirmed",
          "appointment_reminder",
          "appointment_cancelled",
          "prescription_ready",
          "payment_successful",
          "payment_failed",
          "consultation_message",
          "consultation_completed",

          // Doctor notifications
          "new_consultation_request",
          "consultation_confirmed",
          "consultation_cancelled",
          "pharmacy_application_approved",
          "pharmacy_application_rejected",
          "new_review",
          "payment_received",

          // Admin notifications
          "doctor_application_submitted",
          "pharmacy_request_submitted",
          "payment_dispute",
          "system_alert",
          "user_reported",

          // General notifications
          "system",
          "promotion",
          "announcement"
        ),
        allowNull: false,
        validate: {
          isIn: [
            [
              "appointment_confirmed",
              "appointment_reminder",
              "appointment_cancelled",
              "prescription_ready",
              "payment_successful",
              "payment_failed",
              "consultation_message",
              "consultation_completed",
              "new_consultation_request",
              "consultation_confirmed",
              "consultation_cancelled",
              "pharmacy_application_approved",
              "pharmacy_application_rejected",
              "new_review",
              "payment_received",
              "doctor_application_submitted",
              "pharmacy_request_submitted",
              "payment_dispute",
              "system_alert",
              "user_reported",
              "system",
              "promotion",
              "announcement",
            ],
          ],
        },
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
          len: [1, 1000],
        },
      },
      related_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      related_model: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 100],
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
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      read_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      target_role: {
        type: DataTypes.ENUM("patient", "doctor", "admin", "all"),
        allowNull: false,
        defaultValue: "all",
        validate: {
          isIn: [["patient", "doctor", "admin", "all"]],
        },
      },
      category: {
        type: DataTypes.ENUM(
          "appointments",
          "consultations",
          "payments",
          "pharmacy",
          "system",
          "promotions"
        ),
        allowNull: false,
        validate: {
          isIn: [
            [
              "appointments",
              "consultations",
              "payments",
              "pharmacy",
              "system",
              "promotions",
            ],
          ],
        },
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
          fields: ["is_read"],
        },
        {
          fields: ["type"],
        },
        {
          fields: ["priority"],
        },
        {
          fields: ["target_role"],
        },
        {
          fields: ["category"],
        },
        {
          fields: ["createdAt"],
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
        },
        beforeUpdate: (notification) => {
          // Set read_at timestamp when notification is marked as read
          if (
            notification.changed("is_read") &&
            notification.is_read &&
            !notification.read_at
          ) {
            notification.read_at = new Date();
          }
        },
      },
    }
  );
  return Notification;
};
