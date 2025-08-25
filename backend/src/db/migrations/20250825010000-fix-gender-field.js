"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, let's check if the gender column exists and what type it is
    const tableDescription = await queryInterface.describeTable("Users");

    if (tableDescription.gender) {
      // If gender column exists, we need to update it
      // First, drop the existing column
      await queryInterface.removeColumn("Users", "gender");
    }

    // Add the gender column with the correct ENUM type
    await queryInterface.addColumn("Users", "gender", {
      type: Sequelize.ENUM("male", "female", "other"),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the gender column
    await queryInterface.removeColumn("Users", "gender");
  },
};
