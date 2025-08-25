"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ApplicationDocument extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ApplicationDocument belongs to a user application
      ApplicationDocument.belongsTo(models.UserApplication, {
        foreignKey: "applicationId",
        as: "application",
      });
    }

    // Instance method to get document URL
    getDocumentUrl() {
      return this.fileUrl || this.filePath;
    }

    // Instance method to check if document is verified
    isVerified() {
      return this.verifiedAt !== null;
    }

    // Instance method to check if document is expired
    isExpired() {
      if (!this.expiryDate) return false;
      return new Date() > new Date(this.expiryDate);
    }

    // Instance method to check if document will expire soon (within 30 days)
    willExpireSoon() {
      if (!this.expiryDate) return false;
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return new Date(this.expiryDate) <= thirtyDaysFromNow;
    }
  }

  ApplicationDocument.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      documentType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "license, certification, reference, etc.",
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      fileName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      fileUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          len: [0, 500],
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
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: true,
          isFuture(value) {
            if (value && new Date(value) <= new Date()) {
              throw new Error("Expiry date must be in the future");
            }
          },
        },
      },
      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      verificationNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      uploadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ApplicationDocument",
      tableName: "ApplicationDocuments",
      timestamps: true,
      indexes: [
        {
          fields: ["applicationId"],
        },
        {
          fields: ["documentType"],
        },
        {
          fields: ["uploadedAt"],
        },
        {
          fields: ["verifiedAt"],
        },
        {
          fields: ["expiryDate"],
        },
      ],
      hooks: {
        beforeCreate: (document) => {
          // Set uploadedAt if not provided
          if (!document.uploadedAt) {
            document.uploadedAt = new Date();
          }

          // Ensure document type is properly formatted
          if (document.documentType) {
            document.documentType = document.documentType.trim().toLowerCase();
          }

          // Ensure file name is properly formatted
          if (document.fileName) {
            document.fileName = document.fileName.trim();
          }
        },
        beforeUpdate: (document) => {
          // Ensure document type is properly formatted
          if (document.documentType) {
            document.documentType = document.documentType.trim().toLowerCase();
          }

          // Ensure file name is properly formatted
          if (document.fileName) {
            document.fileName = document.fileName.trim();
          }
        },
      },
    }
  );
  return ApplicationDocument;
};
