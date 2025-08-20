"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Q_and_A extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Q&A doesn't have direct associations as it's a standalone FAQ system
    }
  }
  Q_and_A.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 500],
        },
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [20, 2000],
        },
      },
      category: {
        type: DataTypes.ENUM(
          "general",
          "consultation",
          "prescription",
          "pharmacy",
          "payment",
          "technical",
          "emergency_care",
          "preventive_care",
          "nutrition",
          "mental_health",
          "sleep_health",
          "fitness",
          "home_care",
          "infectious_diseases"
        ),
        allowNull: false,
        defaultValue: "general",
        validate: {
          isIn: [
            [
              "general",
              "consultation",
              "prescription",
              "pharmacy",
              "payment",
              "technical",
              "emergency_care",
              "preventive_care",
              "nutrition",
              "mental_health",
              "sleep_health",
              "fitness",
              "home_care",
              "infectious_diseases",
            ],
          ],
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100,
        },
      },
    },
    {
      sequelize,
      modelName: "Q_and_A",
      tableName: "Q_and_As",
      timestamps: true,
      indexes: [
        {
          fields: ["category"],
        },
        {
          fields: ["isActive"],
        },
        {
          fields: ["priority"],
        },
      ],
      hooks: {
        beforeCreate: (qa) => {
          // Ensure text fields are properly formatted
          if (qa.question) {
            qa.question = qa.question.trim();
          }
          if (qa.answer) {
            qa.answer = qa.answer.trim();
          }
        },
        beforeUpdate: (qa) => {
          // Ensure text fields are properly formatted
          if (qa.question) {
            qa.question = qa.question.trim();
          }
          if (qa.answer) {
            qa.answer = qa.answer.trim();
          }
        },
      },
    }
  );
  return Q_and_A;
};
