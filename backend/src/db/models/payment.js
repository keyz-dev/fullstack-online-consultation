"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Payment belongs to a patient
      Payment.belongsTo(models.User, {
        foreignKey: "patientId",
        as: "patient",
      });

      // Payment belongs to a doctor
      Payment.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctor",
      });

      // Payment belongs to a consultation
      Payment.belongsTo(models.Consultation, {
        foreignKey: "consultationId",
        as: "consultation",
      });

      // Payment belongs to a drug order
      Payment.belongsTo(models.DrugOrder, {
        foreignKey: "drugOrderId",
        as: "drugOrder",
      });
    }
  }
  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [5, 100],
        },
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
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      consultationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Consultations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      drugOrderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DrugOrders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      amount: {
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
          isIn: [["USD", "EUR", "GBP", "NGN", "KES", "GHS"]],
        },
      },
      paymentMethod: {
        type: DataTypes.ENUM(
          "mobile_money",
          "card",
          "bank_transfer",
          "cash",
          "wallet"
        ),
        allowNull: false,
        validate: {
          isIn: [["mobile_money", "card", "bank_transfer", "cash", "wallet"]],
        },
      },
      paymentType: {
        type: DataTypes.ENUM(
          "consultation",
          "drug_order",
          "application_fee",
          "subscription"
        ),
        allowNull: false,
        validate: {
          isIn: [
            ["consultation", "drug_order", "application_fee", "subscription"],
          ],
        },
      },
      gatewayProvider: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["campay", "stripe", "paypal", "flutterwave", "paystack"]],
        },
      },
      gatewayTransactionId: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      gatewayResponse: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "processing",
          "completed",
          "failed",
          "cancelled",
          "refunded"
        ),
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: [
            [
              "pending",
              "processing",
              "completed",
              "failed",
              "cancelled",
              "refunded",
            ],
          ],
        },
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          is: /^\+?[1-9]\d{1,14}$/,
        },
      },
      networkProvider: {
        type: DataTypes.ENUM(
          "mtn",
          "vodafone",
          "airtel",
          "glo",
          "orange",
          "safaricom"
        ),
        allowNull: true,
        validate: {
          isIn: [["mtn", "vodafone", "airtel", "glo", "orange", "safaricom"]],
        },
      },
      initiatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      failedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 500],
        },
      },
      errorCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      receiptUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      platformFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      doctorAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "Payments",
      timestamps: true,
      indexes: [
        {
          fields: ["transactionId"],
          unique: true,
        },
        {
          fields: ["patientId"],
        },
        {
          fields: ["doctorId"],
        },
        {
          fields: ["consultationId"],
        },
        {
          fields: ["drugOrderId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["paymentMethod"],
        },
        {
          fields: ["paymentType"],
        },
        {
          fields: ["gatewayProvider"],
        },
        {
          fields: ["initiatedAt"],
        },
        {
          fields: ["completedAt"],
        },
      ],
      hooks: {
        beforeCreate: (payment) => {
          // Ensure transaction ID is properly formatted
          if (payment.transactionId) {
            payment.transactionId = payment.transactionId.trim().toUpperCase();
          }
          if (payment.phoneNumber) {
            payment.phoneNumber = payment.phoneNumber.trim();
          }
          if (payment.errorMessage) {
            payment.errorMessage = payment.errorMessage.trim();
          }
        },
        beforeUpdate: (payment) => {
          // Ensure transaction ID is properly formatted
          if (payment.transactionId) {
            payment.transactionId = payment.transactionId.trim().toUpperCase();
          }
          if (payment.phoneNumber) {
            payment.phoneNumber = payment.phoneNumber.trim();
          }
          if (payment.errorMessage) {
            payment.errorMessage = payment.errorMessage.trim();
          }
        },
      },
    }
  );
  return Payment;
};
