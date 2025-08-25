"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Remove the default value first
    await queryInterface.sequelize.query(`
      ALTER TABLE "Notifications" 
      ALTER COLUMN type DROP DEFAULT
    `);

    // Step 2: Change the column type to VARCHAR temporarily to remove enum constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE "Notifications" 
      ALTER COLUMN type TYPE VARCHAR(50)
    `);

    // Step 3: Update existing records to use new enum values
    await queryInterface.sequelize.query(`
      UPDATE "Notifications" 
      SET type = 'system_announcement' 
      WHERE type = 'system'
    `);

    await queryInterface.sequelize.query(`
      UPDATE "Notifications" 
      SET type = 'consultation_reminder' 
      WHERE type = 'consultation'
    `);

    await queryInterface.sequelize.query(`
      UPDATE "Notifications" 
      SET type = 'prescription_ready' 
      WHERE type = 'prescription'
    `);

    await queryInterface.sequelize.query(`
      UPDATE "Notifications" 
      SET type = 'payment_successful' 
      WHERE type = 'payment'
    `);

    await queryInterface.sequelize.query(`
      UPDATE "Notifications" 
      SET type = 'consultation_reminder' 
      WHERE type = 'reminder'
    `);

    await queryInterface.sequelize.query(`
      UPDATE "Notifications" 
      SET type = 'general' 
      WHERE type = 'alert'
    `);

    // Step 4: Drop the new enum type if it exists (from previous failed migration)
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Notifications_type_new"
    `);

    // Step 5: Create new enum type
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Notifications_type_new" AS ENUM (
        'consultation_reminder',
        'consultation_confirmation',
        'consultation_cancelled',
        'prescription_ready',
        'payment_successful',
        'payment_failed',
        'application_approved',
        'application_rejected',
        'application_under_review',
        'system_announcement',
        'general'
      )
    `);

    // Step 6: Update the column to use the new enum type
    await queryInterface.sequelize.query(`
      ALTER TABLE "Notifications" 
      ALTER COLUMN type TYPE "enum_Notifications_type_new" 
      USING type::text::"enum_Notifications_type_new"
    `);

    // Step 7: Drop the old enum type if it exists
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Notifications_type"
    `);

    // Step 8: Rename the new enum type to the original name
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Notifications_type_new" 
      RENAME TO "enum_Notifications_type"
    `);

    // Step 9: Add missing indexes
    await queryInterface.addIndex("Notifications", ["sentAt"]);
    await queryInterface.addIndex("Notifications", ["user_id", "isRead"]);
  },

  async down(queryInterface, Sequelize) {
    // Step 1: Remove the indexes first
    await queryInterface.removeIndex("Notifications", ["user_id", "isRead"]);
    await queryInterface.removeIndex("Notifications", ["sentAt"]);

    // Step 2: Change the column type to VARCHAR temporarily to remove enum constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE "Notifications" 
      ALTER COLUMN type TYPE VARCHAR(50)
    `);

    // Step 3: Revert the enum changes
    await queryInterface.sequelize.query(`
      UPDATE "Notifications" 
      SET type = 'system' 
      WHERE type = 'system_announcement'
    `);

    await queryInterface.sequelize.query(`
      UPDATE "Notifications" 
      SET type = 'consultation' 
      WHERE type IN ('consultation_reminder', 'consultation_confirmation', 'consultation_cancelled')
    `);

    await queryInterface.sequelize.query(`
      UPDATE "Notifications" 
      SET type = 'prescription' 
      WHERE type = 'prescription_ready'
    `);

    await queryInterface.sequelize.query(`
      UPDATE "Notifications" 
      SET type = 'payment' 
      WHERE type IN ('payment_successful', 'payment_failed')
    `);

    await queryInterface.sequelize.query(`
      UPDATE "Notifications" 
      SET type = 'alert' 
      WHERE type IN ('application_approved', 'application_rejected', 'application_under_review', 'general')
    `);

    // Step 4: Recreate the old enum type
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Notifications_type_old" AS ENUM (
        'consultation', 'prescription', 'payment', 'system', 'reminder', 'alert'
      )
    `);

    // Step 5: Update the column to use the old enum type
    await queryInterface.sequelize.query(`
      ALTER TABLE "Notifications" 
      ALTER COLUMN type TYPE "enum_Notifications_type_old" 
      USING type::text::"enum_Notifications_type_old"
    `);

    // Step 6: Drop the new enum type
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_Notifications_type"
    `);

    // Step 7: Rename the old enum type to the original name
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Notifications_type_old" 
      RENAME TO "enum_Notifications_type"
    `);

    // Step 8: Restore the default value
    await queryInterface.sequelize.query(`
      ALTER TABLE "Notifications" 
      ALTER COLUMN type SET DEFAULT 'system'
    `);
  },
};
