"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ApplicationDocuments", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      applicationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "UserApplications",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      documentType: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: "license, certification, reference, etc.",
      },
      fileName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      fileUrl: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      fileSize: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mimeType: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      uploadedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      verifiedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      verifiedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      verificationNotes: {
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
    await queryInterface.addIndex("ApplicationDocuments", ["applicationId"]);
    await queryInterface.addIndex("ApplicationDocuments", ["documentType"]);
    await queryInterface.addIndex("ApplicationDocuments", ["uploadedAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ApplicationDocuments");
  },
};
