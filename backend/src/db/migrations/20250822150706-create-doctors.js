"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Doctors", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
        validate: {
          len: [5, 50],
        },
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 50,
        },
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
      },
      education: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      languages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: ["english"],
      },
      clinicAddress: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      operationalHospital: {
        type: Sequelize.STRING(200),
        allowNull: true,
        validate: {
          len: [0, 200],
        },
      },
      contactInfo: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      paymentMethods: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      consultationFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      consultationDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30,
        validate: {
          min: 15,
          max: 120,
        },
      },
      isVerified: {
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
        validate: {
          min: 0,
          max: 5,
        },
      },
      totalReviews: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Indexes
    await queryInterface.addIndex("Doctors", ["userId"], { unique: true });
    await queryInterface.addIndex("Doctors", ["licenseNumber"], {
      unique: true,
    });
    await queryInterface.addIndex("Doctors", ["isVerified"]);
    await queryInterface.addIndex("Doctors", ["isActive"]);
    await queryInterface.addIndex("Doctors", ["averageRating"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Doctors");
  },
};
