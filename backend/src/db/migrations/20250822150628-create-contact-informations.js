"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ContactInformations", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      iconUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: "defaultIcon.png",
      },
      inputType: {
        type: Sequelize.ENUM("phone", "email", "url", "text", "time"),
        allowNull: false,
        defaultValue: "text",
        comment: "Type of input field to render in the frontend",
      },
      placeholder: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: "Placeholder text for the input field",
      },
      validationPattern: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: "Regex pattern for validation (optional)",
      },
      isRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Whether this contact method requires a value",
      },
      displayOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Order in which to display this contact method",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Whether this contact method is available for selection",
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
    await queryInterface.addIndex("ContactInformations", ["name"]);
    await queryInterface.addIndex("ContactInformations", ["displayOrder"]);
    await queryInterface.addIndex("ContactInformations", ["isActive"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ContactInformations");
  },
};
