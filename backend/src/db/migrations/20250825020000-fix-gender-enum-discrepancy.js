"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, let's check the current state of the gender column
    const tableDescription = await queryInterface.describeTable("Users");

    if (tableDescription.gender) {
      // Drop the existing gender column
      await queryInterface.removeColumn("Users", "gender");
    }

    // Drop the existing enum type if it exists
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Users_gender";'
    );

    // Create the new enum type with all three values
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Users_gender" AS ENUM ('male', 'female', 'other');
    `);

    // Add the gender column with the correct ENUM type and make it nullable
    await queryInterface.addColumn("Users", "gender", {
      type: Sequelize.ENUM("male", "female", "other"),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the gender column
    await queryInterface.removeColumn("Users", "gender");

    // Drop the enum type
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Users_gender";'
    );
  },
};
