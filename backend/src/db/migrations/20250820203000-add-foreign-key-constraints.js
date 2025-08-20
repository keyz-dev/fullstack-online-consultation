"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraint for DrugOrders.prescriptionId
    await queryInterface.addConstraint("DrugOrders", {
      fields: ["prescriptionId"],
      type: "foreign key",
      name: "drug_orders_prescription_id_fkey",
      references: {
        table: "Prescriptions",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // Add foreign key constraint for Payments.consultationId
    await queryInterface.addConstraint("Payments", {
      fields: ["consultationId"],
      type: "foreign key",
      name: "payments_consultation_id_fkey",
      references: {
        table: "Consultations",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // Add foreign key constraint for Payments.drugOrderId
    await queryInterface.addConstraint("Payments", {
      fields: ["drugOrderId"],
      type: "foreign key",
      name: "payments_drug_order_id_fkey",
      references: {
        table: "DrugOrders",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // Add foreign key constraint for ConsultationMessages.consultationId
    await queryInterface.addConstraint("ConsultationMessages", {
      fields: ["consultationId"],
      type: "foreign key",
      name: "consultation_messages_consultation_id_fkey",
      references: {
        table: "Consultations",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Add foreign key constraint for Prescriptions.consultationId
    await queryInterface.addConstraint("Prescriptions", {
      fields: ["consultationId"],
      type: "foreign key",
      name: "prescriptions_consultation_id_fkey",
      references: {
        table: "Consultations",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraints in reverse order
    await queryInterface.removeConstraint(
      "Prescriptions",
      "prescriptions_consultation_id_fkey"
    );
    await queryInterface.removeConstraint(
      "ConsultationMessages",
      "consultation_messages_consultation_id_fkey"
    );
    await queryInterface.removeConstraint(
      "Payments",
      "payments_drug_order_id_fkey"
    );
    await queryInterface.removeConstraint(
      "Payments",
      "payments_consultation_id_fkey"
    );
    await queryInterface.removeConstraint(
      "DrugOrders",
      "drug_orders_prescription_id_fkey"
    );
  },
};
