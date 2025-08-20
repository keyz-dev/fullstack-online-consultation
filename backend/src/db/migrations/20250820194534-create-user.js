"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
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
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true, // Nullable for OAuth users
      },
      role: {
        type: Sequelize.ENUM("patient", "doctor", "admin", "pharmacy"),
        allowNull: false,
        defaultValue: "patient",
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      gender: {
        type: Sequelize.ENUM("male", "female", "other"),
        allowNull: true,
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      address: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      authProvider: {
        type: Sequelize.ENUM("local", "google", "facebook", "apple"),
        allowNull: true,
        defaultValue: "local",
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emailVerificationCode: {
        type: Sequelize.STRING(6),
        allowNull: true,
      },
      emailVerificationExpires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      hasPaidApplicationFee: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    // Add indexes for better performance
    await queryInterface.addIndex("Users", ["email"], { unique: true });
    await queryInterface.addIndex("Users", ["role"]);
    await queryInterface.addIndex("Users", ["isApproved"]);
    await queryInterface.addIndex("Users", ["isActive"]);
    await queryInterface.addIndex("Users", ["emailVerified"]);
    await queryInterface.addIndex("Users", ["authProvider"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
