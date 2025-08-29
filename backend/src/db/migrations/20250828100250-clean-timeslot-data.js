"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("🧹 Starting cleanup of ALL booking-related data...");
    console.log(
      "⚠️  This will delete ALL appointments, schedules, and related data!"
    );

    // Start a transaction for safe cleanup
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Delete in order respecting foreign key constraints (children first, parents last)

      // 1. Delete all prescriptions (they reference consultations and appointments)
      console.log("🗑️  Step 1: Deleting all prescriptions...");
      await queryInterface.bulkDelete("Prescriptions", {}, { transaction });
      console.log("✅ Prescriptions deleted");

      // 2. Delete all consultations (they reference appointments)
      console.log("🗑️  Step 2: Deleting all consultations...");
      await queryInterface.bulkDelete("Consultations", {}, { transaction });
      console.log("✅ Consultations deleted");

      // 3. Delete all payments (they reference appointments)
      console.log("🗑️  Step 3: Deleting all payments...");
      await queryInterface.bulkDelete("Payments", {}, { transaction });
      console.log("✅ Payments deleted");

      // 4. Delete all appointment-related notifications
      console.log("🗑️  Step 4: Deleting appointment notifications...");
      await queryInterface.sequelize.query(
        `DELETE FROM "Notifications" WHERE type IN (
          'appointment_created', 
          'appointment_confirmed', 
          'consultation_reminder', 
          'consultation_confirmation', 
          'consultation_cancelled',
          'payment_successful',
          'payment_failed',
          'payment_initiated'
        )`,
        { transaction }
      );
      console.log("✅ Appointment notifications deleted");

      // 5. Delete all appointments (they reference timeslots)
      console.log("🗑️  Step 5: Deleting all appointments...");
      await queryInterface.bulkDelete("Appointments", {}, { transaction });
      console.log("✅ Appointments deleted");

      // 6. Delete all timeslots (they reference doctor availabilities)
      console.log("🗑️  Step 6: Deleting all timeslots...");
      await queryInterface.bulkDelete("TimeSlots", {}, { transaction });
      console.log("✅ TimeSlots deleted");

      // 7. Delete all doctor availabilities (parent of timeslots)
      console.log("🗑️  Step 7: Deleting all doctor availabilities...");
      await queryInterface.bulkDelete(
        "DoctorAvailabilities",
        {},
        { transaction }
      );
      console.log("✅ DoctorAvailabilities deleted");

      // 8. Delete patient documents (they might be uploaded during booking)
      console.log("🗑️  Step 8: Deleting patient documents...");
      await queryInterface.bulkDelete("PatientDocuments", {}, { transaction });
      console.log("✅ Patient documents deleted");

      // 9. Reset auto-increment sequences
      console.log("🔄 Step 9: Resetting auto-increment sequences...");

      // Reset sequences (works for both PostgreSQL and MySQL)
      const dialect = queryInterface.sequelize.getDialect();

      if (dialect === "postgres") {
        const sequences = [
          "Prescriptions_id_seq",
          "Consultations_id_seq",
          "Payments_id_seq",
          "Notifications_id_seq",
          "Appointments_id_seq",
          "TimeSlots_id_seq",
          "DoctorAvailabilities_id_seq",
          "PatientDocuments_id_seq",
        ];

        for (const seq of sequences) {
          await queryInterface.sequelize.query(
            `ALTER SEQUENCE "${seq}" RESTART WITH 1`,
            { transaction }
          );
        }
      } else if (dialect === "mysql") {
        const tables = [
          "Prescriptions",
          "Consultations",
          "Payments",
          "Notifications",
          "Appointments",
          "TimeSlots",
          "DoctorAvailabilities",
          "PatientDocuments",
        ];

        for (const table of tables) {
          await queryInterface.sequelize.query(
            `ALTER TABLE ${table} AUTO_INCREMENT = 1`,
            { transaction }
          );
        }
      }

      console.log("✅ Auto-increment sequences reset");

      // Commit the transaction
      await transaction.commit();

      console.log("\n🎉 Complete booking data cleanup completed successfully!");
      console.log("📝 Summary:");
      console.log("   ✅ All appointments deleted");
      console.log("   ✅ All timeslots deleted");
      console.log("   ✅ All doctor schedules deleted");
      console.log("   ✅ All related payments deleted");
      console.log("   ✅ All related consultations deleted");
      console.log("   ✅ All related prescriptions deleted");
      console.log("   ✅ All booking notifications deleted");
      console.log("   ✅ All patient documents deleted");
      console.log("   ✅ Database sequences reset");
      console.log(
        "\n🚀 Ready for fresh booking data with fixed timezone logic!"
      );
    } catch (error) {
      // Rollback on error
      await transaction.rollback();
      console.error("❌ Error during cleanup:", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    console.log("⚠️  This migration cannot be reversed.");
    console.log("💾 Data has been permanently deleted.");
    console.log("🔄 To restore data, you would need to:");
    console.log("   1. Restore from database backup");
    console.log("   2. Or have doctors recreate their schedules");
    console.log("   3. Or run seed files if available");

    // This migration cannot be reversed as it deletes data
    return Promise.resolve();
  },
};
