"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Prescriptions", "doctorId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Doctors",
        key: "id",
      },
      comment: "the doctor who generates the prescription",
    });

    await queryInterface.addColumn("Prescriptions", "patientId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Patients",
        key: "id",
      },
      comment: "the patient who receives the prescription",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Prescriptions", "doctorId");
    await queryInterface.removeColumn("Prescriptions", "patientId");
  },
};
