"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PharmacyDrugs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      drugName: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      genericName: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
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
    await queryInterface.addIndex("PharmacyDrugs", ["pharmacyId"]);
    await queryInterface.addIndex("PharmacyDrugs", ["drugName"]);
    await queryInterface.addIndex("PharmacyDrugs", ["category"]);
    await queryInterface.addIndex("PharmacyDrugs", ["isAvailable"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PharmacyDrugs");
  },
};
