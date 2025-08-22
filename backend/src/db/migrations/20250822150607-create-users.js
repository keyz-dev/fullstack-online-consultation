"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Users table (CLEAN BUSINESS MODEL - NO APPLICATION DATA)
    await queryInterface.createTable("Users", {
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
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true, // For OAuth users
        validate: {
          len: [6, 255],
        },
      },
      role: {
        type: Sequelize.ENUM(
          "patient",
          "doctor",
          "admin",
          "pharmacy",
          "pending_doctor",
          "pending_pharmacy"
        ),
        allowNull: false,
        defaultValue: "patient",
      },
      gender: {
        type: Sequelize.ENUM("male", "female", "other"),
        allowNull: true,
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
          isPast: true,
        },
      },
      address: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      authProvider: {
        type: Sequelize.ENUM("local", "google", "facebook", "apple"),
        defaultValue: "local",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    await queryInterface.addIndex("Users", ["email"], { unique: true });
    await queryInterface.addIndex("Users", ["role"]);
    await queryInterface.addIndex("Users", ["isActive"]);
    await queryInterface.addIndex("Users", ["emailVerified"]);
    await queryInterface.addIndex("Users", ["authProvider"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
