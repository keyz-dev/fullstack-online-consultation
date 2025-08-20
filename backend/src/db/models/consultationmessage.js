"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ConsultationMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ConsultationMessage belongs to a consultation
      ConsultationMessage.belongsTo(models.Consultation, {
        foreignKey: "consultationId",
        as: "consultation",
      });

      // ConsultationMessage belongs to a sender (user)
      ConsultationMessage.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
      });
    }
  }
  ConsultationMessage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      consultationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Consultations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      senderType: {
        type: DataTypes.ENUM("patient", "doctor", "admin"),
        allowNull: false,
        validate: {
          isIn: [["patient", "doctor", "admin"]],
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 2000],
        },
      },
      messageType: {
        type: DataTypes.ENUM("text", "image", "file", "prescription", "system"),
        allowNull: false,
        defaultValue: "text",
        validate: {
          isIn: [["text", "image", "file", "prescription", "system"]],
        },
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ConsultationMessage",
      tableName: "ConsultationMessages",
      timestamps: true,
      indexes: [
        {
          fields: ["consultationId"],
        },
        {
          fields: ["senderId"],
        },
        {
          fields: ["senderType"],
        },
        {
          fields: ["messageType"],
        },
        {
          fields: ["isRead"],
        },
        {
          fields: ["createdAt"],
        },
      ],
      hooks: {
        beforeCreate: (message) => {
          // Ensure message is properly formatted
          if (message.message) {
            message.message = message.message.trim();
          }
        },
        beforeUpdate: (message) => {
          // Ensure message is properly formatted
          if (message.message) {
            message.message = message.message.trim();
          }
        },
      },
    }
  );
  return ConsultationMessage;
};
