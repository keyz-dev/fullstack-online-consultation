"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DoctorAvailabilities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      breakStartTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      breakEndTime: {
        type: Sequelize.TIME,
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

    // Add indexes
    await queryInterface.addIndex("DoctorAvailabilities", ["doctorId"]);
    await queryInterface.addIndex("DoctorAvailabilities", ["dayOfWeek"]);
    await queryInterface.addIndex("DoctorAvailabilities", ["isAvailable"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DoctorAvailabilities");
  },
};
