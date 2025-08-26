"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ConsultationMessages", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      consultationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Consultations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      senderType: {
        type: Sequelize.ENUM("patient", "doctor", "system"),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
          "text",
          "image",
          "file",
          "prescription",
          "diagnosis",
          "system"
        ),
        allowNull: false,
        defaultValue: "text",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fileUrl: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      fileName: {
        type: Sequelize.STRING(255),
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
      isRead: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      readAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: "Additional data for the message",
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
    await queryInterface.addIndex("ConsultationMessages", ["consultationId"]);
    await queryInterface.addIndex("ConsultationMessages", ["senderId"]);
    await queryInterface.addIndex("ConsultationMessages", ["senderType"]);
    await queryInterface.addIndex("ConsultationMessages", ["type"]);
    await queryInterface.addIndex("ConsultationMessages", ["isRead"]);
    await queryInterface.addIndex("ConsultationMessages", ["createdAt"]);
    await queryInterface.addIndex("ConsultationMessages", [
      "consultationId",
      "createdAt",
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ConsultationMessages");
  },
};
