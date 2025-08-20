"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SystemNotifications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
          "announcement",
          "maintenance",
          "update",
          "alert",
          "promotion"
        ),
        allowNull: false,
        defaultValue: "announcement",
      },
      target_roles: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: ["patient", "doctor", "admin"],
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.addIndex("SystemNotifications", ["is_active"]);
    await queryInterface.addIndex("SystemNotifications", ["type"]);
    await queryInterface.addIndex("SystemNotifications", ["expires_at"]);
    await queryInterface.addIndex("SystemNotifications", ["createdAt"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SystemNotifications");
  },
};
