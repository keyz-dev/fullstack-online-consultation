"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DrugOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // DrugOrder belongs to a patient
      DrugOrder.belongsTo(models.User, {
        foreignKey: "patientId",
        as: "patient",
      });

      // DrugOrder belongs to a pharmacy
      DrugOrder.belongsTo(models.Pharmacy, {
        foreignKey: "pharmacyId",
        as: "pharmacy",
      });

      // DrugOrder belongs to a prescription
      DrugOrder.belongsTo(models.Prescription, {
        foreignKey: "prescriptionId",
        as: "prescription",
      });

      // DrugOrder has many payments
      DrugOrder.hasMany(models.Payment, {
        foreignKey: "drugOrderId",
        as: "payments",
      });
    }
  }
  DrugOrder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      pharmacyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Pharmacies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      prescriptionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Prescriptions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      orderItems: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
          isValidOrderItems(value) {
            if (!value || !Array.isArray(value) || value.length === 0) {
              throw new Error("Order items must be a non-empty array");
            }
            for (const item of value) {
              if (!item.drugId || !item.quantity || !item.price) {
                throw new Error(
                  "Each order item must have drugId, quantity, and price"
                );
              }
              if (item.quantity <= 0 || item.price <= 0) {
                throw new Error("Quantity and price must be positive numbers");
              }
            }
          },
        },
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      deliveryFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      platformCommission: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      pharmacyAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      deliveryAddress: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
          isValidDeliveryAddress(value) {
            if (!value || typeof value !== "object") {
              throw new Error("Delivery address must be a valid object");
            }
            if (!value.street || !value.city || !value.country) {
              throw new Error(
                "Delivery address must include street, city, and country"
              );
            }
          },
        },
      },
      status: {
        type: DataTypes.ENUM(
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
        validate: {
          isIn: [
            [
              "pending",
              "confirmed",
              "processing",
              "shipped",
              "out_for_delivery",
              "delivered",
              "cancelled",
              "returned",
            ],
          ],
        },
      },
      paymentStatus: {
        type: DataTypes.ENUM(
          "pending",
          "paid",
          "failed",
          "refunded",
          "partially_refunded"
        ),
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: [
            ["pending", "paid", "failed", "refunded", "partially_refunded"],
          ],
        },
      },
      pharmacyConfirmedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DrugOrder",
      tableName: "DrugOrders",
      timestamps: true,
      indexes: [
        {
          fields: ["patientId"],
        },
        {
          fields: ["pharmacyId"],
        },
        {
          fields: ["prescriptionId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["paymentStatus"],
        },
        {
          fields: ["pharmacyConfirmedAt"],
        },
        {
          fields: ["paidAt"],
        },
        {
          fields: ["deliveredAt"],
        },
      ],
      hooks: {
        beforeCreate: (drugOrder) => {
          // Calculate pharmacy amount if not provided
          if (!drugOrder.pharmacyAmount) {
            drugOrder.pharmacyAmount =
              parseFloat(drugOrder.totalAmount) -
              parseFloat(drugOrder.platformCommission);
          }
        },
        beforeUpdate: (drugOrder) => {
          // Update pharmacy amount if total or commission changes
          if (
            drugOrder.changed("totalAmount") ||
            drugOrder.changed("platformCommission")
          ) {
            drugOrder.pharmacyAmount =
              parseFloat(drugOrder.totalAmount) -
              parseFloat(drugOrder.platformCommission);
          }
        },
      },
    }
  );
  return DrugOrder;
};
