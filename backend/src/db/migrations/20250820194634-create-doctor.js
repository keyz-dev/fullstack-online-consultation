"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Doctors", {
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
      licenseNumber: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      education: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      languages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      specialties: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      clinicAddress: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      operationalHospital: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      contactInfo: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      documents: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      paymentMethods: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      consultationFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      consultationDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30,
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
    await queryInterface.addIndex("Doctors", ["userId"], { unique: true });
    await queryInterface.addIndex("Doctors", ["licenseNumber"], {
      unique: true,
    });
    await queryInterface.addIndex("Doctors", ["isApproved"]);
    await queryInterface.addIndex("Doctors", ["isVerified"]);
    await queryInterface.addIndex("Doctors", ["isActive"]);
    await queryInterface.addIndex("Doctors", ["averageRating"]);
    await queryInterface.addIndex("Doctors", ["specialties"], { using: "gin" });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Doctors");
  },
};
