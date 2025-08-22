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
      // Testimonial belongs to a user
      Testimonial.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // Testimonial belongs to a patient
      Testimonial.belongsTo(models.Patient, {
        foreignKey: "patientId",
        as: "patient",
      });

      // Testimonial belongs to a doctor
      Testimonial.belongsTo(models.Doctor, {
        foreignKey: "doctorId",
        as: "doctor",
      });

      // Testimonial belongs to a pharmacy
      Testimonial.belongsTo(models.Pharmacy, {
        foreignKey: "pharmacyId",
        as: "pharmacy",
      });
    }

    // Instance method to check if testimonial is approved
    isApproved() {
      return this.isApproved === true;
    }

    // Instance method to check if testimonial is anonymous
    isAnonymous() {
      return this.isAnonymous === true;
    }

    // Instance method to get display name
    getDisplayName() {
      if (this.isAnonymous) {
        return "Anonymous";
      }
      return this.user ? this.user.name : "Unknown";
    }

    // Instance method to approve testimonial
    async approve() {
      this.isApproved = true;
      return await this.save();
    }

    // Instance method to reject testimonial
    async reject() {
      this.isApproved = false;
      return await this.save();
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
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Patients",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Doctors",
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
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 2000],
        },
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isAnonymous: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
          fields: ["patientId"],
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
          fields: ["isAnonymous"],
        },
      ],
      hooks: {
        beforeCreate: (testimonial) => {
          // Ensure title and content are properly formatted
          if (testimonial.title) {
            testimonial.title = testimonial.title.trim();
          }
          if (testimonial.content) {
            testimonial.content = testimonial.content.trim();
          }
        },
        beforeUpdate: (testimonial) => {
          // Ensure title and content are properly formatted
          if (testimonial.title) {
            testimonial.title = testimonial.title.trim();
          }
          if (testimonial.content) {
            testimonial.content = testimonial.content.trim();
          }
        },
      },
    }
  );
  return Testimonial;
};
