"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DoctorSpecialties", {
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
      specialtyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Specialties",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // Unique constraint to prevent duplicate relationships
    await queryInterface.addIndex(
      "DoctorSpecialties",
      ["doctorId", "specialtyId"],
      {
        unique: true,
      }
    );
    await queryInterface.addIndex("DoctorSpecialties", ["doctorId"]);
    await queryInterface.addIndex("DoctorSpecialties", ["specialtyId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DoctorSpecialties");
  },
};
