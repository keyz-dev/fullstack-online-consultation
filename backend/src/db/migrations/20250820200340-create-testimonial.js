"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Testimonials", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      pharmacyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Pharmacies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add indexes
    await queryInterface.addIndex("Testimonials", ["userId"]);
    await queryInterface.addIndex("Testimonials", ["doctorId"]);
    await queryInterface.addIndex("Testimonials", ["pharmacyId"]);
    await queryInterface.addIndex("Testimonials", ["rating"]);
    await queryInterface.addIndex("Testimonials", ["isApproved"]);
    await queryInterface.addIndex("Testimonials", ["isActive"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Testimonials");
  },
};
