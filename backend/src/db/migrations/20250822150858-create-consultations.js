"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Consultations", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Appointments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM(
          "not_started",
          "in_progress",
          "completed",
          "cancelled",
          "no_show"
        ),
        allowNull: false,
        defaultValue: "not_started",
      },
      type: {
        type: Sequelize.ENUM("video_call", "voice_call", "chat", "in_person"),
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
        comment: "Duration in minutes",
      },
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      followUpDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      followUpNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
      review: {
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
    await queryInterface.addIndex("Consultations", ["appointmentId"]);
    await queryInterface.addIndex("Consultations", ["status"]);
    await queryInterface.addIndex("Consultations", ["type"]);
    await queryInterface.addIndex("Consultations", ["startedAt"]);
    await queryInterface.addIndex("Consultations", ["endedAt"]);
    await queryInterface.addIndex("Consultations", ["followUpDate"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Consultations");
  },
};
