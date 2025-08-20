"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ConsultationMessages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      consultationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Foreign key constraint will be added after Consultations table is created
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
        type: Sequelize.ENUM("patient", "doctor", "admin"),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      messageType: {
        type: Sequelize.ENUM("text", "image", "file", "prescription", "system"),
        allowNull: false,
        defaultValue: "text",
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
    await queryInterface.addIndex("ConsultationMessages", ["consultationId"]);
    await queryInterface.addIndex("ConsultationMessages", ["senderId"]);
    await queryInterface.addIndex("ConsultationMessages", ["senderType"]);
    await queryInterface.addIndex("ConsultationMessages", ["messageType"]);
    await queryInterface.addIndex("ConsultationMessages", ["isRead"]);
    await queryInterface.addIndex("ConsultationMessages", ["createdAt"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ConsultationMessages");
  },
};
