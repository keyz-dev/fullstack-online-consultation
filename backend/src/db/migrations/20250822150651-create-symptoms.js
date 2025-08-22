"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Symptoms", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          len: [2, 100],
        },
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

    // Indexes
    await queryInterface.addIndex("Symptoms", ["name"]);
    await queryInterface.addIndex("Symptoms", ["specialtyId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Symptoms");
  },
};
