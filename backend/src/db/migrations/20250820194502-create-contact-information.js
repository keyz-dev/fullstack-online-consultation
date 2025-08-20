"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ContactInformations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      displayName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      icon: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      validationRegex: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      adminNotes: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex("ContactInformations", ["type"], {
      unique: true,
    });
    await queryInterface.addIndex("ContactInformations", ["isActive"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ContactInformations");
  },
};
