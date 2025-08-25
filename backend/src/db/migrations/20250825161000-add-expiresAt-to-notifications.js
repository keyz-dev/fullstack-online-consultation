"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the missing expiresAt column
    await queryInterface.addColumn("Notifications", "expiresAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Add index for expiresAt
    await queryInterface.addIndex("Notifications", ["expiresAt"]);
  },

  async down(queryInterface, Sequelize) {
    // Remove the index first
    await queryInterface.removeIndex("Notifications", ["expiresAt"]);

    // Remove the expiresAt column
    await queryInterface.removeColumn("Notifications", "expiresAt");
  },
};
