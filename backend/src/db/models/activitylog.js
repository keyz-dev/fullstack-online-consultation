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
      // ActivityLog belongs to a user
      ActivityLog.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }

    // Instance method to check if action is a create action
    isCreateAction() {
      return this.action === "create";
    }

    // Instance method to check if action is an update action
    isUpdateAction() {
      return this.action === "update";
    }

    // Instance method to check if action is a delete action
    isDeleteAction() {
      return this.action === "delete";
    }

    // Instance method to check if action is a login action
    isLoginAction() {
      return this.action === "login";
    }

    // Instance method to check if action is a logout action
    isLogoutAction() {
      return this.action === "logout";
    }

    // Instance method to check if action is a payment action
    isPaymentAction() {
      return this.action === "payment";
    }

    // Instance method to check if action is a consultation action
    isConsultationAction() {
      return this.action === "consultation";
    }

    // Instance method to check if action is a system action
    isSystemAction() {
      return this.action === "system";
    }

    // Instance method to get formatted timestamp
    getFormattedTimestamp() {
      return this.createdAt.toLocaleString();
    }

    // Instance method to get action description
    getActionDescription() {
      const actionDescriptions = {
        create: "Created",
        update: "Updated",
        delete: "Deleted",
        login: "Logged in",
        logout: "Logged out",
        register: "Registered",
        approve: "Approved",
        reject: "Rejected",
        payment: "Payment processed",
        consultation: "Consultation",
        prescription: "Prescription",
        order: "Order",
        notification: "Notification",
        system: "System action",
      };
      return actionDescriptions[this.action] || this.action;
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
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      action: {
        type: DataTypes.ENUM(
          "create",
          "update",
          "delete",
          "login",
          "logout",
          "register",
          "approve",
          "reject",
          "payment",
          "consultation",
          "prescription",
          "order",
          "notification",
          "system"
        ),
        allowNull: false,
        validate: {
          isIn: [
            [
              "create",
              "update",
              "delete",
              "login",
              "logout",
              "register",
              "approve",
              "reject",
              "payment",
              "consultation",
              "prescription",
              "order",
              "notification",
              "system",
            ],
          ],
        },
      },
      entityType: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "Type of entity being acted upon (User, Doctor, etc.)",
        validate: {
          len: [0, 100],
        },
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID of the entity being acted upon",
        validate: {
          min: 1,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: "IPv4 or IPv6 address",
        validate: {
          len: [0, 45],
        },
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "User agent string",
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "Additional data about the activity",
        validate: {
          isValidMetadata(value) {
            if (value && typeof value !== "object") {
              throw new Error("Metadata must be a valid object");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "ActivityLog",
      tableName: "ActivityLogs",
      timestamps: false, // Only createdAt is used
      indexes: [
        {
          fields: ["user_id"],
        },
        {
          fields: ["action"],
        },
        {
          fields: ["entityType"],
        },
        {
          fields: ["entityId"],
        },
        {
          fields: ["createdAt"],
        },
        {
          fields: ["ipAddress"],
        },
        {
          fields: ["user_id", "action"],
        },
        {
          fields: ["entityType", "entityId"],
        },
      ],
      hooks: {
        beforeCreate: (activityLog) => {
          // Ensure description is properly formatted
          if (activityLog.description) {
            activityLog.description = activityLog.description.trim();
          }

          // Ensure entityType is properly formatted
          if (activityLog.entityType) {
            activityLog.entityType = activityLog.entityType.trim();
          }
        },
        beforeUpdate: (activityLog) => {
          // Ensure description is properly formatted
          if (activityLog.description) {
            activityLog.description = activityLog.description.trim();
          }

          // Ensure entityType is properly formatted
          if (activityLog.entityType) {
            activityLog.entityType = activityLog.entityType.trim();
          }
        },
      },
    }
  );
  return ActivityLog;
};
