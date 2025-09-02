"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Prescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Prescription belongs to a consultation
      Prescription.belongsTo(models.Consultation, {
        foreignKey: "consultationId",
        as: "consultation",
      });

      // Prescription has many drug orders
      Prescription.hasMany(models.DrugOrder, {
        foreignKey: "prescriptionId",
        as: "drugOrders",
      });
    }

    // Instance method to check if prescription is active
    isActive() {
      return this.status === "active";
    }

    // Instance method to check if prescription is completed
    isCompleted() {
      return this.status === "completed";
    }

    // Instance method to check if prescription is cancelled
    isCancelled() {
      return this.status === "cancelled";
    }

    // Instance method to check if prescription is expired
    isExpired() {
      return this.status === "expired";
    }

    // Instance method to check if prescription has refills remaining
    hasRefillsRemaining() {
      return this.refillsRemaining > 0;
    }

    // Instance method to check if prescription is expiring soon (within 7 days)
    isExpiringSoon() {
      if (!this.endDate) return false;
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      return new Date(this.endDate) <= sevenDaysFromNow;
    }
  }

  Prescription.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      status: {
        type: DataTypes.ENUM("active", "completed", "cancelled", "expired"),
        allowNull: false,
        defaultValue: "active",
        validate: {
          isIn: [["active", "completed", "cancelled", "expired"]],
        },
      },
      diagnosis: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
      },
      medications: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        validate: {
          isValidMedications(value) {
            if (!Array.isArray(value)) {
              throw new Error("Medications must be an array");
            }
          },
        },
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
      },
      dosage: {
        type: DataTypes.JSONB,
        allowNull: true,
        validate: {
          isValidDosage(value) {
            if (value && typeof value !== "object") {
              throw new Error("Dosage must be a valid object");
            }
          },
        },
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Duration in days",
        validate: {
          min: 1,
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isAfterStartDate(value) {
            if (
              value &&
              this.startDate &&
              new Date(value) <= new Date(this.startDate)
            ) {
              throw new Error("End date must be after start date");
            }
          },
        },
      },
      refills: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      refillsRemaining: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      sideEffects: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        validate: {
          isValidSideEffects(value) {
            if (value && !Array.isArray(value)) {
              throw new Error("Side effects must be an array");
            }
          },
        },
      },
      contraindications: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        validate: {
          isValidContraindications(value) {
            if (value && !Array.isArray(value)) {
              throw new Error("Contraindications must be an array");
            }
          },
        },
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL to the generated PDF prescription file'
      },
    },
    {
      sequelize,
      modelName: "Prescription",
      tableName: "Prescriptions",
      timestamps: true,
      indexes: [
        {
          fields: ["consultationId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["startDate"],
        },
        {
          fields: ["endDate"],
        },
      ],
      hooks: {
        beforeCreate: (prescription) => {
          // Set refillsRemaining to refills initially
          if (prescription.refillsRemaining === 0 && prescription.refills > 0) {
            prescription.refillsRemaining = prescription.refills;
          }

          // Calculate endDate if duration is provided
          if (prescription.duration && !prescription.endDate) {
            const endDate = new Date(prescription.startDate);
            endDate.setDate(endDate.getDate() + prescription.duration);
            prescription.endDate = endDate;
          }
        },
        beforeUpdate: (prescription) => {
          // Calculate endDate if duration is provided and endDate is not set
          if (prescription.duration && !prescription.endDate) {
            const endDate = new Date(prescription.startDate);
            endDate.setDate(endDate.getDate() + prescription.duration);
            prescription.endDate = endDate;
          }
        },
      },
    }
  );
  return Prescription;
};
