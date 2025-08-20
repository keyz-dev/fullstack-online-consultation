"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pharmacies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      licenseNumber: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      logo: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      address: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      contactInfo: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      deliveryInfo: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      paymentMethods: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: ["cash"],
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      averageRating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
      },
      totalReviews: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      adminNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    // Add indexes for better performance
    await queryInterface.addIndex("Pharmacies", ["userId"], { unique: true });
    await queryInterface.addIndex("Pharmacies", ["licenseNumber"], {
      unique: true,
    });
    await queryInterface.addIndex("Pharmacies", ["name"]);
    await queryInterface.addIndex("Pharmacies", ["isApproved"]);
    await queryInterface.addIndex("Pharmacies", ["isVerified"]);
    await queryInterface.addIndex("Pharmacies", ["isActive"]);
    await queryInterface.addIndex("Pharmacies", ["averageRating"]);
    await queryInterface.addIndex("Pharmacies", ["paymentMethods"], {
      using: "gin",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Pharmacies");
  },
};
