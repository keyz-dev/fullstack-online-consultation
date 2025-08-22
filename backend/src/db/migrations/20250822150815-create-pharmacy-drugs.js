"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PharmacyDrugs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      pharmacyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Pharmacies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      genericName: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dosageForm: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      strength: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      manufacturer: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: "USD",
      },
      stockQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      requiresPrescription: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      imageUrl: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(100),
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
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.addIndex("PharmacyDrugs", ["pharmacyId"]);
    await queryInterface.addIndex("PharmacyDrugs", ["name"]);
    await queryInterface.addIndex("PharmacyDrugs", ["genericName"]);
    await queryInterface.addIndex("PharmacyDrugs", ["category"]);
    await queryInterface.addIndex("PharmacyDrugs", ["isAvailable"]);
    await queryInterface.addIndex("PharmacyDrugs", ["requiresPrescription"]);
    await queryInterface.addIndex("PharmacyDrugs", ["stockQuantity"]);
    await queryInterface.addIndex("PharmacyDrugs", ["expiryDate"]);
    await queryInterface.addIndex("PharmacyDrugs", ["pharmacyId", "name"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PharmacyDrugs");
  },
};
