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
      drugName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 200],
        },
      },
      genericName: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dosageForm: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      strength: {
        type: DataTypes.STRING(100),
        allowNull: true,
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
          fields: ["drugName"],
        },
        {
          fields: ["category"],
        },
        {
          fields: ["isAvailable"],
        },
      ],
    }
  );

  return PharmacyDrug;
};
