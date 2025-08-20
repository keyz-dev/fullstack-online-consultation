"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Consultations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      consultationType: {
        type: Sequelize.ENUM("video", "audio", "chat", "in_person"),
        allowNull: false,
        defaultValue: "video",
      },
      status: {
        type: Sequelize.ENUM(
          "scheduled",
          "confirmed",
          "in_progress",
          "completed",
          "cancelled",
          "no_show"
        ),
        allowNull: false,
        defaultValue: "scheduled",
      },
      scheduledAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      startedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      meetingId: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      meetingUrl: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      recordingUrl: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      symptoms: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      treatment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      consultationFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cancelledBy: {
        type: Sequelize.ENUM("patient", "doctor", "admin", "system"),
        allowNull: true,
      },
      cancellationReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cancelledAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      patientRating: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      patientFeedback: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      patientConnectionQuality: {
        type: Sequelize.ENUM("excellent", "good", "fair", "poor"),
        allowNull: true,
      },
      doctorConnectionQuality: {
        type: Sequelize.ENUM("excellent", "good", "fair", "poor"),
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
    await queryInterface.addIndex("Consultations", ["patientId"]);
    await queryInterface.addIndex("Consultations", ["doctorId"]);
    await queryInterface.addIndex("Consultations", ["status"]);
    await queryInterface.addIndex("Consultations", ["scheduledAt"]);
    await queryInterface.addIndex("Consultations", ["consultationType"]);
    await queryInterface.addIndex("Consultations", ["isPaid"]);
    await queryInterface.addIndex("Consultations", ["meetingId"], {
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Consultations");
  },
};
