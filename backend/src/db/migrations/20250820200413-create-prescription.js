"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Prescriptions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patientId: {
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
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      consultationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // Foreign key constraint will be added after Consultations table is created
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      prescriptionNumber: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      symptoms: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      prescriptionDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      validUntil: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "active",
          "expired",
          "cancelled",
          "completed",
          "suspended"
        ),
        allowNull: false,
        defaultValue: "active",
      },
      allergies: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      doctorSignature: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      recommendedPharmacy: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      followUpRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      followUpDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      patientAcknowledged: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      patientAcknowledgedAt: {
        type: Sequelize.DATE,
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
    await queryInterface.addIndex("Prescriptions", ["patientId"]);
    await queryInterface.addIndex("Prescriptions", ["doctorId"]);
    await queryInterface.addIndex("Prescriptions", ["consultationId"]);
    await queryInterface.addIndex("Prescriptions", ["prescriptionNumber"], {
      unique: true,
    });
    await queryInterface.addIndex("Prescriptions", ["status"]);
    await queryInterface.addIndex("Prescriptions", ["prescriptionDate"]);
    await queryInterface.addIndex("Prescriptions", ["validUntil"]);
    await queryInterface.addIndex("Prescriptions", ["followUpRequired"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Prescriptions");
  },
};
