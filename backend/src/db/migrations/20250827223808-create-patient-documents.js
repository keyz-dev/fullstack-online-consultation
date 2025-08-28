"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PatientDocuments", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Patients",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      documentType: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: "medical_report, prescription, lab_result, xray, etc.",
      },
      fileName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      fileUrl: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      fileSize: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      mimeType: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      uploadedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
    await queryInterface.addIndex("PatientDocuments", ["patientId"]);
    await queryInterface.addIndex("PatientDocuments", ["documentType"]);
    await queryInterface.addIndex("PatientDocuments", ["uploadedAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PatientDocuments");
  },
};
