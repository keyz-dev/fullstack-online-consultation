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
      DrugOrder.belongsTo(models.Patient, {
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

      // DrugOrder belongs to a pharmacy drug
      DrugOrder.belongsTo(models.PharmacyDrug, {
        foreignKey: "pharmacyDrugId",
        as: "pharmacyDrug",
      });
    }

    // Instance method to check if order is pending
    isPending() {
      return this.status === "pending";
    }

    // Instance method to check if order is confirmed
    isConfirmed() {
      return this.status === "confirmed";
    }

    // Instance method to check if order is processing
    isProcessing() {
      return this.status === "processing";
    }

    // Instance method to check if order is shipped
    isShipped() {
      return this.status === "shipped";
    }

    // Instance method to check if order is delivered
    isDelivered() {
      return this.status === "delivered";
    }

    // Instance method to check if order is cancelled
    isCancelled() {
      return this.status === "cancelled";
    }

    // Instance method to check if order is returned
    isReturned() {
      return this.status === "returned";
    }

    // Instance method to check if order can be cancelled
    canBeCancelled() {
      return this.status === "pending" || this.status === "confirmed";
    }

    // Instance method to check if order is delivered late
    isDeliveredLate() {
      if (!this.estimatedDeliveryDate || !this.actualDeliveryDate) return false;
      return (
        new Date(this.actualDeliveryDate) > new Date(this.estimatedDeliveryDate)
      );
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
          model: "Patients",
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
      pharmacyDrugId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "PharmacyDrugs",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "confirmed",
          "processing",
          "shipped",
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
              "delivered",
              "cancelled",
              "returned",
            ],
          ],
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "USD",
        validate: {
          len: [3, 3],
        },
      },
      drugName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      dosageInstructions: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      deliveryAddress: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
          isValidAddress(value) {
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
      deliveryMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "standard",
        validate: {
          isIn: [["standard", "express", "same_day"]],
        },
      },
      estimatedDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: true,
          isFuture(value) {
            if (value && new Date(value) <= new Date()) {
              throw new Error("Estimated delivery date must be in the future");
            }
          },
        },
      },
      actualDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: true,
        },
      },
      trackingNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      cancellationReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 500],
        },
      },
      cancelledBy: {
        type: DataTypes.ENUM("patient", "pharmacy", "system"),
        allowNull: true,
        validate: {
          isIn: [["patient", "pharmacy", "system"]],
        },
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
          fields: ["pharmacyDrugId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["trackingNumber"],
        },
        {
          fields: ["estimatedDeliveryDate"],
        },
        {
          fields: ["actualDeliveryDate"],
        },
      ],
      hooks: {
        beforeCreate: (drugOrder) => {
          // Ensure currency is uppercase
          if (drugOrder.currency) {
            drugOrder.currency = drugOrder.currency.toUpperCase();
          }

          // Ensure drug name is properly formatted
          if (drugOrder.drugName) {
            drugOrder.drugName = drugOrder.drugName.trim();
          }

          // Calculate total amount if not provided
          if (
            !drugOrder.totalAmount &&
            drugOrder.unitPrice &&
            drugOrder.quantity
          ) {
            drugOrder.totalAmount = drugOrder.unitPrice * drugOrder.quantity;
          }
        },
        beforeUpdate: (drugOrder) => {
          // Ensure currency is uppercase
          if (drugOrder.currency) {
            drugOrder.currency = drugOrder.currency.toUpperCase();
          }

          // Ensure drug name is properly formatted
          if (drugOrder.drugName) {
            drugOrder.drugName = drugOrder.drugName.trim();
          }

          // Calculate total amount if unit price or quantity changes
          if (drugOrder.changed("unitPrice") || drugOrder.changed("quantity")) {
            drugOrder.totalAmount = drugOrder.unitPrice * drugOrder.quantity;
          }
        },
      },
    }
  );
  return DrugOrder;
};
