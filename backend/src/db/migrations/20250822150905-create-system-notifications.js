"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SystemNotifications", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('announcement', 'maintenance', 'update', 'alert', 'info'),
        allowNull: false,
        defaultValue: "info",
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: "medium",
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      targetAudience: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
        comment: "Array of user roles to target (e.g., ['patient', 'doctor'])",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "When to start showing this notification",
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "When to stop showing this notification",
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: "Additional notification data",
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Indexes
    await queryInterface.addIndex("SystemNotifications", ["type"]);
    await queryInterface.addIndex("SystemNotifications", ["priority"]);
    await queryInterface.addIndex("SystemNotifications", ["isActive"]);
    await queryInterface.addIndex("SystemNotifications", ["startDate"]);
    await queryInterface.addIndex("SystemNotifications", ["endDate"]);
    await queryInterface.addIndex("SystemNotifications", ["createdBy"]);
    await queryInterface.addIndex("SystemNotifications", ["createdAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SystemNotifications");
  },
};
