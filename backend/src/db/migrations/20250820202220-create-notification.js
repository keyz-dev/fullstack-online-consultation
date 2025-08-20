"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Notifications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      type: {
        type: Sequelize.ENUM(
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
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      related_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      related_model: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      priority: {
        type: Sequelize.ENUM("low", "medium", "high", "urgent"),
        allowNull: false,
        defaultValue: "medium",
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      read_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      target_role: {
        type: Sequelize.ENUM("patient", "doctor", "admin", "all"),
        allowNull: false,
        defaultValue: "all",
      },
      category: {
        type: Sequelize.ENUM(
          "appointments",
          "consultations",
          "payments",
          "pharmacy",
          "system",
          "promotions"
        ),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add indexes for better performance
    await queryInterface.addIndex("Notifications", ["user_id"]);
    await queryInterface.addIndex("Notifications", ["is_read"]);
    await queryInterface.addIndex("Notifications", ["type"]);
    await queryInterface.addIndex("Notifications", ["priority"]);
    await queryInterface.addIndex("Notifications", ["target_role"]);
    await queryInterface.addIndex("Notifications", ["category"]);
    await queryInterface.addIndex("Notifications", ["createdAt"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Notifications");
  },
};
