"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Patients", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      bloodGroup: {
        type: Sequelize.ENUM("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"),
        allowNull: true,
      },
      allergies: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      emergencyContact: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      contactInfo: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      medicalDocuments: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      insuranceInfo: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      preferredLanguage: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: "English",
        validate: {
          len: [0, 50],
        },
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
    await queryInterface.addIndex("Patients", ["userId"], { unique: true });
    await queryInterface.addIndex("Patients", ["bloodGroup"]);
    await queryInterface.addIndex("Patients", ["allergies"], { using: "gin" });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Patients");
  },
};
