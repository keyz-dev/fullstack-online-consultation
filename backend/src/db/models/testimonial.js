"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Testimonial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Testimonial belongs to a user (who wrote the testimonial)
      Testimonial.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // Testimonial can be about a user (doctor or patient being reviewed)
      Testimonial.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "reviewedUser",
      });

      // Testimonial can belong to a pharmacy (if it's about a pharmacy)
      Testimonial.belongsTo(models.Pharmacy, {
        foreignKey: "pharmacyId",
        as: "pharmacy",
      });
    }
  }
  Testimonial.init(
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
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      pharmacyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Pharmacies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 1000],
        },
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Testimonial",
      tableName: "Testimonials",
      timestamps: true,
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["doctorId"],
        },
        {
          fields: ["pharmacyId"],
        },
        {
          fields: ["rating"],
        },
        {
          fields: ["isApproved"],
        },
        {
          fields: ["isActive"],
        },
      ],
      hooks: {
        beforeCreate: (testimonial) => {
          // Ensure message is properly formatted
          if (testimonial.message) {
            testimonial.message = testimonial.message.trim();
          }
        },
        beforeUpdate: (testimonial) => {
          // Ensure message is properly formatted
          if (testimonial.message) {
            testimonial.message = testimonial.message.trim();
          }
        },
      },
    }
  );
  return Testimonial;
};
