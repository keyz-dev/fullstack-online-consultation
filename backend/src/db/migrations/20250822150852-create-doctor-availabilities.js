"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DoctorAvailabilities", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Doctors",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      dayOfWeek: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 6,
        },
        comment: "0 = Sunday, 1 = Monday, ..., 6 = Saturday",
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      maxPatients: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
        },
      },
      consultationDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30,
        validate: {
          min: 15,
          max: 120,
        },
        comment: "Duration in minutes",
      },
      consultationType: {
        type: Sequelize.ENUM("online", "physical", "both"),
        allowNull: false,
        defaultValue: "online",
        comment: "The type of consultation",
      },
      consultationFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: "Consultation fee in XAF",
      },
      // Invalidation support
      isInvalidated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Whether this availability has been invalidated",
      },
      invalidationReason: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Reason for invalidation",
      },
      invalidatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "When this availability was invalidated",
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
    await queryInterface.addIndex("DoctorAvailabilities", ["doctorId"]);
    await queryInterface.addIndex("DoctorAvailabilities", ["dayOfWeek"]);
    await queryInterface.addIndex("DoctorAvailabilities", ["isAvailable"]);
    await queryInterface.addIndex("DoctorAvailabilities", ["isInvalidated"]);
    await queryInterface.addIndex("DoctorAvailabilities", [
      "doctorId",
      "dayOfWeek",
    ]);
    await queryInterface.addIndex("DoctorAvailabilities", [
      "doctorId",
      "isAvailable",
      "isInvalidated",
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DoctorAvailabilities");
  },
};
