"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Prescriptions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      consultationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Consultations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }, 
      status: {
        type: Sequelize.ENUM("active", "completed", "cancelled", "expired"),
        allowNull: false,
        defaultValue: "active",
      },
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      medications: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: "Array of prescribed medications",
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dosage: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: "Dosage information",
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "Duration in days",
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Prescription expiry date",
      },
      refills: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      refillsRemaining: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sideEffects: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      contraindications: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
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
    await queryInterface.addIndex("Prescriptions", ["consultationId"]);
    await queryInterface.addIndex("Prescriptions", ["status"]);
    await queryInterface.addIndex("Prescriptions", ["startDate"]);
    await queryInterface.addIndex("Prescriptions", ["endDate"]);
    await queryInterface.addIndex("Prescriptions", ["createdAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Prescriptions");
  },
};
