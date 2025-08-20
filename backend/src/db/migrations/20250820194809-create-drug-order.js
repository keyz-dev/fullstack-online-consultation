"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DrugOrders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      prescriptionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // Foreign key constraint will be added after Prescriptions table is created
      },
      orderItems: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      deliveryFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      platformCommission: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      pharmacyAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      deliveryAddress: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "out_for_delivery",
          "delivered",
          "cancelled",
          "returned"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      paymentStatus: {
        type: Sequelize.ENUM(
          "pending",
          "paid",
          "failed",
          "refunded",
          "partially_refunded"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      pharmacyConfirmedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      paidAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deliveredAt: {
        type: Sequelize.DATE,
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
    await queryInterface.addIndex("DrugOrders", ["patientId"]);
    await queryInterface.addIndex("DrugOrders", ["pharmacyId"]);
    await queryInterface.addIndex("DrugOrders", ["prescriptionId"]);
    await queryInterface.addIndex("DrugOrders", ["status"]);
    await queryInterface.addIndex("DrugOrders", ["paymentStatus"]);
    await queryInterface.addIndex("DrugOrders", ["pharmacyConfirmedAt"]);
    await queryInterface.addIndex("DrugOrders", ["paidAt"]);
    await queryInterface.addIndex("DrugOrders", ["deliveredAt"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DrugOrders");
  },
};
