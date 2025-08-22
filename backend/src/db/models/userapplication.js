"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserApplication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // UserApplication belongs to a user
      UserApplication.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // UserApplication has many application documents
      UserApplication.hasMany(models.ApplicationDocument, {
        foreignKey: "applicationId",
        as: "documents",
      });

      // UserApplication belongs to a doctor (polymorphic)
      UserApplication.belongsTo(models.Doctor, {
        foreignKey: "typeId",
        scope: { applicationType: "doctor" },
        as: "doctor",
      });

      // UserApplication belongs to a pharmacy (polymorphic)
      UserApplication.belongsTo(models.Pharmacy, {
        foreignKey: "typeId",
        scope: { applicationType: "pharmacy" },
        as: "pharmacy",
      });

      // UserApplication has many application payments
      UserApplication.hasMany(models.ApplicationPayment, {
        foreignKey: "applicationId",
        as: "payments",
      });
    }

    // Instance method to check if application is pending
    isPending() {
      return this.status === "pending";
    }

    // Instance method to check if application is under review
    isUnderReview() {
      return this.status === "under_review";
    }

    // Instance method to check if application is approved
    isApproved() {
      return this.status === "approved";
    }

    // Instance method to check if application is rejected
    isRejected() {
      return this.status === "rejected";
    }

    // Instance method to check if application is suspended
    isSuspended() {
      return this.status === "suspended";
    }

    // Instance method to check if application can be reviewed
    canBeReviewed() {
      return this.status === "pending" || this.status === "under_review";
    }

    // Instance method to check if application can be approved
    canBeApproved() {
      return this.status === "under_review";
    }

    // Instance method to check if application can be rejected
    canBeRejected() {
      return this.status === "under_review";
    }
  }

  UserApplication.init(
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
      applicationType: {
        type: DataTypes.ENUM("doctor", "pharmacy"),
        allowNull: false,
        validate: {
          isIn: [["doctor", "pharmacy"]],
        },
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "References Doctor.id or Pharmacy.id based on applicationType",
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "under_review",
          "approved",
          "rejected",
          "suspended"
        ),
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: [
            ["pending", "under_review", "approved", "rejected", "suspended"],
          ],
        },
      },
      applicationVersion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      adminReview: {
        type: DataTypes.JSONB,
        allowNull: true,
        validate: {
          isValidReview(value) {
            if (value && typeof value !== "object") {
              throw new Error("Admin review must be a valid object");
            }
          },
        },
      },
      adminNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rejectedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      suspendedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      suspensionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
    },
    {
      sequelize,
      modelName: "UserApplication",
      tableName: "UserApplications",
      timestamps: true,
      indexes: [
        {
          fields: ["userId", "applicationType"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["submittedAt"],
        },
        {
          fields: ["typeId", "applicationType"],
        },
      ],
      hooks: {
        beforeCreate: (application) => {
          // Set submittedAt if not provided
          if (!application.submittedAt) {
            application.submittedAt = new Date();
          }
        },
        beforeUpdate: (application) => {
          // Set review timestamps based on status changes
          if (application.changed("status")) {
            const now = new Date();
            switch (application.status) {
              case "under_review":
                application.reviewedAt = now;
                break;
              case "approved":
                application.approvedAt = now;
                break;
              case "rejected":
                application.rejectedAt = now;
                break;
              case "suspended":
                application.suspendedAt = now;
                break;
            }
          }
        },
      },
    }
  );
  return UserApplication;
};
