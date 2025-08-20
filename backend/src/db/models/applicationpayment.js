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
      applicationType: {
        type: DataTypes.ENUM("doctor", "pharmacy"),
        allowNull: false,
        validate: {
          isIn: [["doctor", "pharmacy"]],
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      paymentMethod: {
        type: DataTypes.ENUM("card", "bank_transfer", "mobile_money"),
        allowNull: false,
        validate: {
          isIn: [["card", "bank_transfer", "mobile_money"]],
        },
      },
      transactionId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: [["pending", "completed", "failed", "refunded"]],
        },
      },
      refundAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      refundReason: {
        type: DataTypes.TEXT,
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
          fields: ["applicationType"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["transactionId"],
          unique: true,
        },
      ],
    }
  );

  return ApplicationPayment;
};
