"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ActivityLogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      target_model: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      target_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      activity_type: {
        type: Sequelize.ENUM(
          "user_registration",
          "doctor_application",
          "pharmacy_request",
          "consultation",
          "payment",
          "prescription",
          "system",
          "admin_action"
        ),
        allowNull: false,
        defaultValue: "system",
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
    await queryInterface.addIndex("ActivityLogs", ["user_id"]);
    await queryInterface.addIndex("ActivityLogs", ["activity_type"]);
    await queryInterface.addIndex("ActivityLogs", ["createdAt"]);
    await queryInterface.addIndex("ActivityLogs", [
      "target_model",
      "target_id",
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ActivityLogs");
  },
};
