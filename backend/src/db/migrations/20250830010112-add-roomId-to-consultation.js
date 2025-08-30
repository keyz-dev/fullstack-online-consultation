"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Consultations", "roomId", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      comment: "Unique identifier for the video/voice call room",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Consultations", "roomId");
  },
};
