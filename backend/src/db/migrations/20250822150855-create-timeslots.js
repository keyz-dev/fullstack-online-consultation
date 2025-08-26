"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TimeSlots", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      doctorAvailabilityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "DoctorAvailabilities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      isBooked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.addIndex("TimeSlots", ["doctorAvailabilityId"]);
    await queryInterface.addIndex("TimeSlots", ["date"]);
    await queryInterface.addIndex("TimeSlots", ["startTime"]);
    await queryInterface.addIndex("TimeSlots", ["isBooked"]);
    await queryInterface.addIndex("TimeSlots", ["date", "startTime"]);
    await queryInterface.addIndex("TimeSlots", [
      "doctorAvailabilityId",
      "date",
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TimeSlots");
  },
};
