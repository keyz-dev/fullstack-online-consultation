"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Pharmacy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Pharmacy belongs to a user (pharmacy owner/manager)
      Pharmacy.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // Pharmacy has many drug orders
      Pharmacy.hasMany(models.DrugOrder, {
        foreignKey: "pharmacyId",
        as: "drugOrders",
      });

      // Pharmacy has many pharmacy drugs
      Pharmacy.hasMany(models.PharmacyDrug, {
        foreignKey: "pharmacyId",
        as: "pharmacyDrugs",
      });

      // Pharmacy has many testimonials
      Pharmacy.hasMany(models.Testimonial, {
        foreignKey: "pharmacyId",
        as: "testimonials",
      });

      // Pharmacy has many user applications
      Pharmacy.hasMany(models.UserApplication, {
        foreignKey: "typeId",
        as: "applications",
      });
    }
  }

  Pharmacy.init(
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
        unique: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 200],
        },
      },
      licenseNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [5, 50],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
      },
      logo: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        validate: {
          isValidImages(value) {
            if (value && !Array.isArray(value)) {
              throw new Error("Images must be an array");
            }
            if (value) {
              for (const image of value) {
                if (typeof image !== "string" || !image.trim()) {
                  throw new Error("Each image must be a valid URL string");
                }
              }
            }
          },
        },
      },
      address: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
          isValidAddress(value) {
            if (!value || typeof value !== "object") {
              throw new Error("Address must be a valid object");
            }
            if (!value.street || !value.city || !value.country) {
              throw new Error("Address must include street, city, and country");
            }
          },
        },
      },
      contactInfo: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      deliveryInfo: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        validate: {
          isValidDeliveryInfo(value) {
            if (value && typeof value !== "object") {
              throw new Error("Delivery info must be a valid object");
            }
          },
        },
      },
      paymentMethods: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      averageRating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        validate: {
          min: 0,
          max: 5,
        },
      },
      totalReviews: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      documents: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      languages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Pharmacy",
      tableName: "Pharmacies",
      timestamps: true,
      indexes: [
        {
          fields: ["userId"],
          unique: true,
        },
        {
          fields: ["licenseNumber"],
          unique: true,
        },
        {
          fields: ["name"],
        },
        {
          fields: ["isVerified"],
        },
        {
          fields: ["isActive"],
        },
        {
          fields: ["averageRating"],
        },
        {
          fields: ["paymentMethods"],
          using: "gin",
        },
        {
          fields: ["documents"],
          using: "gin",
        },
        {
          fields: ["languages"],
          using: "gin",
        },
      ],
      hooks: {
        beforeCreate: (pharmacy) => {
          // Ensure license number is properly formatted
          if (pharmacy.licenseNumber) {
            pharmacy.licenseNumber = pharmacy.licenseNumber
              .trim()
              .toUpperCase();
          }
          if (pharmacy.name) {
            pharmacy.name = pharmacy.name.trim();
          }
          if (pharmacy.description) {
            pharmacy.description = pharmacy.description.trim();
          }
        },
        beforeUpdate: (pharmacy) => {
          // Ensure license number is properly formatted
          if (pharmacy.licenseNumber) {
            pharmacy.licenseNumber = pharmacy.licenseNumber
              .trim()
              .toUpperCase();
          }
          if (pharmacy.name) {
            pharmacy.name = pharmacy.name.trim();
          }
          if (pharmacy.description) {
            pharmacy.description = pharmacy.description.trim();
          }
        },
      },
    }
  );
  return Pharmacy;
};
