"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DrugOrders", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Patients",
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
        references: {
          model: "Prescriptions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: "pending",
      },
      totalAmount: {
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
      shippingAddress: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      billingAddress: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: "pending",
      },
      paymentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Payments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      estimatedDelivery: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      actualDelivery: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      trackingNumber: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex("DrugOrders", ["patientId"]);
    await queryInterface.addIndex("DrugOrders", ["pharmacyId"]);
    await queryInterface.addIndex("DrugOrders", ["prescriptionId"]);
    await queryInterface.addIndex("DrugOrders", ["status"]);
    await queryInterface.addIndex("DrugOrders", ["paymentStatus"]);
    await queryInterface.addIndex("DrugOrders", ["paymentId"]);
    await queryInterface.addIndex("DrugOrders", ["trackingNumber"]);
    await queryInterface.addIndex("DrugOrders", ["createdAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DrugOrders");
  },
};
