"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add paymentMethods column to Doctors table
    await queryInterface.addColumn("Doctors", "paymentMethods", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      defaultValue: ["cash"],
      validate: {
        isValidPaymentMethods(value) {
          const validMethods = [
            "cash",
            "card",
            "mobile_money",
            "bank_transfer",
            "wallet",
          ];
          if (value && !Array.isArray(value)) {
            throw new Error("Payment methods must be an array");
          }
          if (value) {
            for (const method of value) {
              if (!validMethods.includes(method)) {
                throw new Error(`Invalid payment method: ${method}`);
              }
            }
          }
        },
      },
    });

    // Add index for paymentMethods column
    await queryInterface.addIndex("Doctors", ["paymentMethods"], {
      using: "gin",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove index first
    await queryInterface.removeIndex("Doctors", ["paymentMethods"]);

    // Remove paymentMethods column
    await queryInterface.removeColumn("Doctors", "paymentMethods");
  },
};
