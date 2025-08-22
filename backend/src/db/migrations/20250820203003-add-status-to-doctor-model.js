"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Doctors", "status", {
      type: Sequelize.ENUM(
        "pending",
        "under_review",
        "approved",
        "rejected",
        "suspended"
      ),
      allowNull: false,
      defaultValue: "pending",
    });

    await queryInterface.addColumn("Doctors", "applicationVersion", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.addColumn("Doctors", "adminReview", {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.addColumn("Doctors", "submittedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    });

    await queryInterface.addColumn("Doctors", "approvedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("Doctors", "rejectedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Add indexes for better performance
    await queryInterface.addIndex("Doctors", ["status"]);
    await queryInterface.addIndex("Doctors", ["userId", "status"]);
    await queryInterface.addIndex("Doctors", ["submittedAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Doctors", "status");
    await queryInterface.removeColumn("Doctors", "applicationVersion");
    await queryInterface.removeColumn("Doctors", "adminReview");
    await queryInterface.removeColumn("Doctors", "submittedAt");
    await queryInterface.removeColumn("Doctors", "approvedAt");
    await queryInterface.removeColumn("Doctors", "rejectedAt");
  },
};
