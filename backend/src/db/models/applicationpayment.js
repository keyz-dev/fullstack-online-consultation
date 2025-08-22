"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ApplicationPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ApplicationPayment belongs to a user
      ApplicationPayment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // ApplicationPayment belongs to a user application
      ApplicationPayment.belongsTo(models.UserApplication, {
        foreignKey: "applicationId",
        as: "application",
      });
    }

    // Instance method to check if payment is successful
    isSuccessful() {
      return this.status === "successful";
    }

    // Instance method to check if payment is pending
    isPending() {
      return this.status === "pending";
    }

    // Instance method to check if payment failed
    isFailed() {
      return this.status === "failed";
    }

    // Instance method to check if payment is refunded
    isRefunded() {
      return this.status === "refunded";
    }
  }

  ApplicationPayment.init(
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
      },
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "UserApplications",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["card", "mobile_money", "bank_transfer", "wallet"]],
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "successful", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: [["pending", "successful", "failed", "refunded"]],
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
      modelName: "ApplicationPayment",
      tableName: "ApplicationPayments",
      timestamps: true,
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["applicationId"],
        },
        {
          fields: ["status"],
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

          // Set processedAt when status changes to successful
          if (payment.changed("status") && payment.status === "successful") {
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
  return ApplicationPayment;
};
