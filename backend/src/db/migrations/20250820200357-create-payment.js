"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      transactionId: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      consultationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // Foreign key constraint will be added after Consultations table is created
      },
      drugOrderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // Foreign key constraint will be added after DrugOrders table is created
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: "XAF",
      },
      paymentMethod: {
        type: Sequelize.ENUM("mobile_money", "card", "bank_transfer", "cash"),
        allowNull: false,
      },
      paymentType: {
        type: Sequelize.ENUM(
          "consultation",
          "drug_order",
          "application_fee",
          "subscription"
        ),
        allowNull: false,
      },
      gatewayProvider: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      gatewayTransactionId: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      gatewayResponse: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "processing",
          "completed",
          "failed",
          "cancelled",
          "refunded"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      phoneNumber: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      networkProvider: {
        type: Sequelize.ENUM("mtn", "vodafone", "airtel", "glo"),
        allowNull: true,
      },
      initiatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      failedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      errorMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      errorCode: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      receiptUrl: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      platformFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      doctorAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      metadata: {
        type: Sequelize.JSON,
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

    // Add indexes for better performance
    await queryInterface.addIndex("Payments", ["transactionId"], {
      unique: true,
    });
    await queryInterface.addIndex("Payments", ["patientId"]);
    await queryInterface.addIndex("Payments", ["doctorId"]);
    await queryInterface.addIndex("Payments", ["consultationId"]);
    await queryInterface.addIndex("Payments", ["drugOrderId"]);
    await queryInterface.addIndex("Payments", ["status"]);
    await queryInterface.addIndex("Payments", ["paymentMethod"]);
    await queryInterface.addIndex("Payments", ["paymentType"]);
    await queryInterface.addIndex("Payments", ["gatewayProvider"]);
    await queryInterface.addIndex("Payments", ["initiatedAt"]);
    await queryInterface.addIndex("Payments", ["completedAt"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Payments");
  },
};
