"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ActivityLogs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
        type: Sequelize.ENUM('create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import'),
        allowNull: false,
      },
      resource: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: "The resource being acted upon (e.g., 'user', 'consultation')",
      },
      resourceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "ID of the specific resource",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ipAddress: {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: "IPv4 or IPv6 address",
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: "Additional activity data",
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
    await queryInterface.addIndex("ActivityLogs", ["user_id"]);
    await queryInterface.addIndex("ActivityLogs", ["action"]);
    await queryInterface.addIndex("ActivityLogs", ["resource"]);
    await queryInterface.addIndex("ActivityLogs", ["resourceId"]);
    await queryInterface.addIndex("ActivityLogs", ["ipAddress"]);
    await queryInterface.addIndex("ActivityLogs", ["createdAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ActivityLogs");
  },
};
