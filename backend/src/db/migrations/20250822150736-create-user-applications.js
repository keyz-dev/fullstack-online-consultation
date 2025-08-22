"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserApplications", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      applicationType: {
        type: Sequelize.ENUM("doctor", "pharmacy"),
        allowNull: false,
      },
      typeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "References Doctor.id or Pharmacy.id based on applicationType",
      },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "under_review",
          "approved",
          "rejected",
          "suspended"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      applicationVersion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      adminReview: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      adminNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      submittedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      reviewedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      approvedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rejectedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      suspendedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rejectionReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      suspensionReason: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.addIndex("UserApplications", [
      "userId",
      "applicationType",
    ]);
    await queryInterface.addIndex("UserApplications", ["status"]);
    await queryInterface.addIndex("UserApplications", ["submittedAt"]);
    await queryInterface.addIndex("UserApplications", [
      "typeId",
      "applicationType",
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserApplications");
  },
};
