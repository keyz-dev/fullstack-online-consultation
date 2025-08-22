"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class QAndA extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // No associations needed for QAndA
    }
  }

  QAndA.init(
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
        },
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "QAndA",
      tableName: "QAndAs",
      timestamps: true,
      indexes: [
        {
          fields: ["category"],
        },
        {
          fields: ["isActive"],
        },
      ],
      hooks: {
        beforeCreate: (qanda) => {
          // Ensure question and answer are properly formatted
          if (qanda.question) {
            qanda.question = qanda.question.trim();
          }
          if (qanda.answer) {
            qanda.answer = qanda.answer.trim();
          }
          if (qanda.category) {
            qanda.category = qanda.category.trim();
          }
        },
        beforeUpdate: (qanda) => {
          // Ensure question and answer are properly formatted
          if (qanda.question) {
            qanda.question = qanda.question.trim();
          }
          if (qanda.answer) {
            qanda.answer = qanda.answer.trim();
          }
          if (qanda.category) {
            qanda.category = qanda.category.trim();
          }
        },
      },
    }
  );
  return QAndA;
};
