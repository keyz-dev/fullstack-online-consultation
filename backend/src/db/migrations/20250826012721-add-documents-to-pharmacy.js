"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the missing expiresAt column
    await queryInterface.addColumn("Pharmacies", "documents", {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    // Add language column
    await queryInterface.addColumn("Pharmacies", "languages", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    // Add index for documents
    await queryInterface.addIndex("Pharmacies", ["documents"]);
  },

  async down(queryInterface, Sequelize) {
    // Remove the index first
    await queryInterface.removeIndex("Pharmacies", ["documents"]);

    // Remove the documents column
    await queryInterface.removeColumn("Pharmacies", "documents");

    // Remove the languages column
    await queryInterface.removeColumn("Pharmacies", "languages");
  },
};
