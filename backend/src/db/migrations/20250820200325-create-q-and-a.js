"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Q_and_As", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      answer: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM(
          "general",
          "consultation",
          "prescription",
          "pharmacy",
          "payment",
          "technical",
          "emergency_care",
          "preventive_care",
          "nutrition",
          "mental_health",
          "sleep_health",
          "fitness",
          "home_care",
          "infectious_diseases"
        ),
        allowNull: false,
        defaultValue: "general",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.addIndex("Q_and_As", ["category"]);
    await queryInterface.addIndex("Q_and_As", ["isActive"]);
    await queryInterface.addIndex("Q_and_As", ["priority"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Q_and_As");
  },
};
