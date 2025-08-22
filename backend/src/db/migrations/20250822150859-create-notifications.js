"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Notifications", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
        type: Sequelize.ENUM('consultation', 'prescription', 'payment', 'system', 'reminder', 'alert'),
        allowNull: false,
        defaultValue: "system",
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: "medium",
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      readAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: "Additional notification data",
      },
      scheduledAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "For scheduled notifications",
      },
      sentAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "When notification was actually sent",
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
    await queryInterface.addIndex("Notifications", ["user_id"]);
    await queryInterface.addIndex("Notifications", ["type"]);
    await queryInterface.addIndex("Notifications", ["priority"]);
    await queryInterface.addIndex("Notifications", ["isRead"]);
    await queryInterface.addIndex("Notifications", ["scheduledAt"]);
    await queryInterface.addIndex("Notifications", ["createdAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Notifications");
  },
};
