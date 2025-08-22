"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Pharmacies", "status", {
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

    await queryInterface.addColumn("Pharmacies", "applicationVersion", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.addColumn("Pharmacies", "adminReview", {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.addColumn("Pharmacies", "submittedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    });

    await queryInterface.addColumn("Pharmacies", "approvedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("Pharmacies", "rejectedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Add indexes for better performance
    await queryInterface.addIndex("Pharmacies", ["status"]);
    await queryInterface.addIndex("Pharmacies", ["userId", "status"]);
    await queryInterface.addIndex("Pharmacies", ["submittedAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Pharmacies", "status");
    await queryInterface.removeColumn("Pharmacies", "applicationVersion");
    await queryInterface.removeColumn("Pharmacies", "adminReview");
    await queryInterface.removeColumn("Pharmacies", "submittedAt");
    await queryInterface.removeColumn("Pharmacies", "approvedAt");
    await queryInterface.removeColumn("Pharmacies", "rejectedAt");
  },
};
