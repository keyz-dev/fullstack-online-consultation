"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Symptoms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      iconUrl: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      specialtyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Specialties",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.addIndex("Symptoms", ["name"]);
    await queryInterface.addIndex("Symptoms", ["specialtyId"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Symptoms");
  },
};
