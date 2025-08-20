"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ApplicationPayments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      applicationType: {
        type: Sequelize.ENUM("doctor", "pharmacy"),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.ENUM("card", "bank_transfer", "mobile_money"),
        allowNull: false,
      },
      transactionId: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "completed", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending",
      },
      refundAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      refundReason: {
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
    await queryInterface.addIndex("ApplicationPayments", ["userId"]);
    await queryInterface.addIndex("ApplicationPayments", ["applicationType"]);
    await queryInterface.addIndex("ApplicationPayments", ["status"]);
    await queryInterface.addIndex("ApplicationPayments", ["transactionId"], {
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ApplicationPayments");
  },
};
