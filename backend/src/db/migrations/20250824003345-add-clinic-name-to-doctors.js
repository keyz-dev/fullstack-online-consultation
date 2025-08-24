"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add clinicName column to Doctors table
    await queryInterface.addColumn("Doctors", "clinicName", {
      type: Sequelize.STRING(200),
      allowNull: true,
      validate: {
        len: [0, 200],
      },
    });

    // Add index for clinicName column
    await queryInterface.addIndex("Doctors", ["clinicName"], {
      using: "gin",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove index first
    await queryInterface.removeIndex("Doctors", ["clinicName"]);

    // Remove clinicName column
    await queryInterface.removeColumn("Doctors", "clinicName");
  },
};
