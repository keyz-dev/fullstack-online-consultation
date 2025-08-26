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
      // Payment belongs to a user
      Payment.belongsTo(models.Appointment, {
        foreignKey: "userId",
        as: "user",
      });

      // Payment belongs to an appointment
      Payment.belongsTo(models.Appointment, {
        foreignKey: "appointmentId",
        as: "appointment",
      });

      // Payment belongs to an application
      Payment.belongsTo(models.UserApplication, {
        foreignKey: "applicationId",
        as: "application",
      });
    }

    // Instance method to check if payment is pending
    isPending() {
      return this.status === "pending";
    }

    // Instance method to check if payment is processing
    isProcessing() {
      return this.status === "processing";
    }

    // Instance method to check if payment is completed
    isCompleted() {
      return this.status === "completed";
    }

    // Instance method to check if payment failed
    isFailed() {
      return this.status === "failed";
    }

    // Instance method to check if payment is refunded
    isRefunded() {
      return this.status === "refunded";
    }

    // Instance method to check if payment is cancelled
    isCancelled() {
      return this.status === "cancelled";
    }

    // Instance method to check if payment can be refunded
    canBeRefunded() {
      return this.status === "completed" && !this.refundedAt;
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        comment: "who made the payment",
      },
      appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Appointments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "UserApplications",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      type: {
        type: DataTypes.ENUM(
          "consultation",
          "prescription",
          "subscription",
          "application_fee",
          "order",
          "other"
        ),
        allowNull: false,
        defaultValue: "consultation",
        validate: {
          isIn: [
            [
              "consultation",
              "prescription",
              "subscription",
              "application_fee",
              "order",
              "other",
            ],
          ],
        },
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
          len: [3, 3],
        },
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "processing",
          "completed",
          "failed",
          "refunded",
          "cancelled"
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
              "refunded",
              "cancelled",
            ],
          ],
        },
      },
      paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["card", "mobile_money", "bank_transfer", "wallet"]],
        },
      },
      transactionId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        validate: {
          len: [0, 255],
        },
      },
      paymentProvider: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["stripe", "paypal", "campay", "flutterwave"]],
        },
      },
      paymentProviderResponse: {
        type: DataTypes.JSONB,
        allowNull: true,
        validate: {
          isValidResponse(value) {
            if (value && typeof value !== "object") {
              throw new Error(
                "Payment provider response must be a valid object"
              );
            }
          },
        },
      },
      failureReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      refundReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      processedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      refundedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "Payments",
      timestamps: true,
      indexes: [
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
          fields: ["status"],
        },
        {
          fields: ["type"],
        },
        {
          fields: ["transactionId"],
          unique: true,
        },
        {
          fields: ["paymentProvider"],
        },
        {
          fields: ["processedAt"],
        },
      ],
      hooks: {
        beforeCreate: (payment) => {
          // Ensure currency is uppercase
          if (payment.currency) {
            payment.currency = payment.currency.toUpperCase();
          }
        },
        beforeUpdate: (payment) => {
          // Ensure currency is uppercase
          if (payment.currency) {
            payment.currency = payment.currency.toUpperCase();
          }

          // Set processedAt when status changes to completed
          if (payment.changed("status") && payment.status === "completed") {
            payment.processedAt = new Date();
          }

          // Set refundedAt when status changes to refunded
          if (payment.changed("status") && payment.status === "refunded") {
            payment.refundedAt = new Date();
          }
        },
      },
    }
  );
  return Payment;
};
