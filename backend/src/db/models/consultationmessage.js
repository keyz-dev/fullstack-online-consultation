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

    // Instance method to check if message is from patient
    isFromPatient() {
      return this.senderType === "patient";
    }

    // Instance method to check if message is from doctor
    isFromDoctor() {
      return this.senderType === "doctor";
    }

    // Instance method to check if message is from system
    isFromSystem() {
      return this.senderType === "system";
    }

    // Instance method to check if message is read
    isRead() {
      return this.isRead === true;
    }

    // Instance method to check if message is a text message
    isTextMessage() {
      return this.type === "text";
    }

    // Instance method to check if message is an image
    isImageMessage() {
      return this.type === "image";
    }

    // Instance method to check if message is a file
    isFileMessage() {
      return this.type === "file";
    }

    // Instance method to check if message is a prescription
    isPrescriptionMessage() {
      return this.type === "prescription";
    }

    // Instance method to check if message is a diagnosis
    isDiagnosisMessage() {
      return this.type === "diagnosis";
    }

    // Instance method to mark message as read
    async markAsRead() {
      this.isRead = true;
      this.readAt = new Date();
      return await this.save();
    }

    // Instance method to get file extension
    getFileExtension() {
      if (!this.fileName) return null;
      return this.fileName.split(".").pop().toLowerCase();
    }

    // Instance method to check if file is an image
    isImageFile() {
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
      const extension = this.getFileExtension();
      return extension && imageExtensions.includes(extension);
    }

    // Instance method to check if file is a document
    isDocumentFile() {
      const documentExtensions = ["pdf", "doc", "docx", "txt", "rtf"];
      const extension = this.getFileExtension();
      return extension && documentExtensions.includes(extension);
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
        type: DataTypes.ENUM("patient", "doctor", "system"),
        allowNull: false,
        validate: {
          isIn: [["patient", "doctor", "system"]],
        },
      },
      type: {
        type: DataTypes.ENUM(
          "text",
          "image",
          "file",
          "prescription",
          "diagnosis",
          "system"
        ),
        allowNull: false,
        defaultValue: "text",
        validate: {
          isIn: [
            ["text", "image", "file", "prescription", "diagnosis", "system"],
          ],
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 5000],
        },
      },
      fileUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
          len: [0, 500],
        },
      },
      fileName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
      fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      mimeType: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: [0, 100],
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
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "Additional data for the message",
        validate: {
          isValidMetadata(value) {
            if (value && typeof value !== "object") {
              throw new Error("Metadata must be a valid object");
            }
          },
        },
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
          fields: ["type"],
        },
        {
          fields: ["isRead"],
        },
        {
          fields: ["createdAt"],
        },
        {
          fields: ["consultationId", "createdAt"],
        },
      ],
      hooks: {
        beforeCreate: (message) => {
          // Ensure content is properly formatted
          if (message.content) {
            message.content = message.content.trim();
          }

          // Ensure fileName is properly formatted
          if (message.fileName) {
            message.fileName = message.fileName.trim();
          }
        },
        beforeUpdate: (message) => {
          // Ensure content is properly formatted
          if (message.content) {
            message.content = message.content.trim();
          }

          // Ensure fileName is properly formatted
          if (message.fileName) {
            message.fileName = message.fileName.trim();
          }

          // Set readAt when marking as read
          if (message.changed("isRead") && message.isRead) {
            message.readAt = new Date();
          }
        },
      },
    }
  );
  return ConsultationMessage;
};
