"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ActivityLog.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  ActivityLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      target_model: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      target_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
        validate: {
          isIP: true,
        },
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      activity_type: {
        type: DataTypes.ENUM(
          "user_registration",
          "doctor_application",
          "pharmacy_request",
          "consultation",
          "payment",
          "prescription",
          "system",
          "admin_action"
        ),
        allowNull: false,
        defaultValue: "system",
        validate: {
          isIn: [
            [
              "user_registration",
              "doctor_application",
              "pharmacy_request",
              "consultation",
              "payment",
              "prescription",
              "system",
              "admin_action",
            ],
          ],
        },
      },
    },
    {
      sequelize,
      modelName: "ActivityLog",
      tableName: "ActivityLogs",
      timestamps: true,
      indexes: [
        {
          fields: ["user_id"],
        },
        {
          fields: ["activity_type"],
        },
        {
          fields: ["createdAt"],
        },
        {
          fields: ["target_model", "target_id"],
        },
      ],
      hooks: {
        beforeCreate: (activityLog) => {
          // Ensure action is properly formatted
          if (activityLog.action) {
            activityLog.action = activityLog.action.trim();
          }
        },
      },
    }
  );
  return ActivityLog;
};
