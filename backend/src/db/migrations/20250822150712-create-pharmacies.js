"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pharmacies", {
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
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        validate: {
          len: [2, 200],
        },
      },
      licenseNumber: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          len: [5, 50],
        },
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
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
        type: Sequelize.JSONB,
        allowNull: true,
      },
      documents: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      languages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
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
    await queryInterface.addIndex("Pharmacies", ["userId"], { unique: true });
    await queryInterface.addIndex("Pharmacies", ["licenseNumber"], {
      unique: true,
    });
    await queryInterface.addIndex("Pharmacies", ["name"]);
    await queryInterface.addIndex("Pharmacies", ["isVerified"]);
    await queryInterface.addIndex("Pharmacies", ["isActive"]);
    await queryInterface.addIndex("Pharmacies", ["averageRating"]);
    await queryInterface.addIndex("Pharmacies", ["paymentMethods"], {
      using: "gin",
    });
    await queryInterface.addIndex("Pharmacies", ["documents"], {
      using: "gin",
    });
    await queryInterface.addIndex("Pharmacies", ["languages"], {
      using: "gin",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Pharmacies");
  },
};
