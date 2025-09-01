"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PharmacyDrug extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // PharmacyDrug belongs to a pharmacy
      PharmacyDrug.belongsTo(models.Pharmacy, {
        foreignKey: "pharmacyId",
        as: "pharmacy",
      });

      // PharmacyDrug has many drug orders
      PharmacyDrug.hasMany(models.DrugOrder, {
        foreignKey: "pharmacyDrugId",
        as: "drugOrders",
      });
    }

    // Instance method to check if drug is in stock
    isInStock() {
      return this.stockQuantity > 0;
    }

    // Instance method to check if drug is available
    isAvailable() {
      return this.isAvailable && this.isInStock();
    }

    // Instance method to check if drug is expiring soon (within 30 days)
    isExpiringSoon() {
      if (!this.expiryDate) return false;
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return new Date(this.expiryDate) <= thirtyDaysFromNow;
    }

    // Instance method to check if drug is expired
    isExpired() {
      if (!this.expiryDate) return false;
      return new Date() > new Date(this.expiryDate);
    }

    // Instance method to update stock quantity
    async updateStock(quantity) {
      this.stockQuantity = Math.max(0, this.stockQuantity + quantity);
      if (this.stockQuantity === 0) {
        this.isAvailable = false;
      }
      return await this.save();
    }
  }

  PharmacyDrug.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      genericName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
      },
      dosageForm: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      strength: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      manufacturer: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "XAF",
        validate: {
          len: [3, 3],
        },
      },
      stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      requiresPrescription: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          len: [0, 500],
        },
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: [0, 100],
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
    },
    {
      sequelize,
      modelName: "PharmacyDrug",
      tableName: "PharmacyDrugs",
      timestamps: true,
      indexes: [
        {
          fields: ["pharmacyId"],
        },
        {
          fields: ["name"],
        },
        {
          fields: ["genericName"],
        },
        {
          fields: ["category"],
        },
        {
          fields: ["isAvailable"],
        },
        {
          fields: ["requiresPrescription"],
        },
        {
          fields: ["stockQuantity"],
        },
        {
          fields: ["expiryDate"],
        },
        {
          fields: ["pharmacyId", "name"],
        },
      ],
      hooks: {
        beforeCreate: (pharmacyDrug) => {
          // Ensure currency is uppercase
          if (pharmacyDrug.currency) {
            pharmacyDrug.currency = pharmacyDrug.currency.toUpperCase();
          }

          // Ensure name is properly formatted
          if (pharmacyDrug.name) {
            pharmacyDrug.name = pharmacyDrug.name.trim();
          }

          // Set isAvailable based on stock quantity
          if (pharmacyDrug.stockQuantity === 0) {
            pharmacyDrug.isAvailable = false;
          }
        },
        beforeUpdate: (pharmacyDrug) => {
          // Ensure currency is uppercase
          if (pharmacyDrug.currency) {
            pharmacyDrug.currency = pharmacyDrug.currency.toUpperCase();
          }

          // Ensure name is properly formatted
          if (pharmacyDrug.name) {
            pharmacyDrug.name = pharmacyDrug.name.trim();
          }

          // Set isAvailable based on stock quantity
          if (pharmacyDrug.stockQuantity === 0) {
            pharmacyDrug.isAvailable = false;
          }
        },
      },
    }
  );
  return PharmacyDrug;
};
