"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Appointments", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      timeSlotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "TimeSlots",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Patients",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM(
          "pending_payment",
          "paid",
          "confirmed",
          "in_progress",
          "completed",
          "cancelled",
          "no_show"
        ),
        allowNull: false,
        defaultValue: "pending_payment",
      },
      consultationType: {
        type: Sequelize.ENUM("online", "physical"),
        allowNull: false,
      },
      symptomIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: [],
        comment: "Array of symptom IDs from the Symptom model",
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Additional notes for doctor preparation",
      },
      cancellationReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cancelledBy: {
        type: Sequelize.ENUM("patient", "doctor", "system"),
        allowNull: true,
      },
      cancelledAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      // Payment fields
      paymentStatus: {
        type: Sequelize.ENUM("pending", "paid", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending",
      },
      paymentAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: "Consultation fee amount",
      },
      campayTransactionId: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Campay transaction reference",
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
    await queryInterface.addIndex("Appointments", ["timeSlotId"]);
    await queryInterface.addIndex("Appointments", ["patientId"]);
    await queryInterface.addIndex("Appointments", ["status"]);
    await queryInterface.addIndex("Appointments", ["consultationType"]);
    await queryInterface.addIndex("Appointments", ["paymentStatus"]);
    await queryInterface.addIndex("Appointments", ["campayTransactionId"]);
    await queryInterface.addIndex("Appointments", ["patientId", "status"]);
    await queryInterface.addIndex("Appointments", ["cancelledAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Appointments");
  },
};
