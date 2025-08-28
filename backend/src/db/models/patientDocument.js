"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PatientDocument extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // PatientDocument belongs to a Patient
      PatientDocument.belongsTo(models.Patient, {
        foreignKey: "patientId",
        as: "patient",
      });
    }
  }

  PatientDocument.init(
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
      documentType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "medical_report, prescription, lab_result, xray, etc.",
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
      uploadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "PatientDocument",
      tableName: "PatientDocuments",
      timestamps: true,
      indexes: [
        {
          fields: ["patientId"],
        },
        {
          fields: ["documentType"],
        },
        {
          fields: ["uploadedAt"],
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
  return PatientDocument;
};
