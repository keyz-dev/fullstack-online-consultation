"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove ENUM constraint and change to VARCHAR
    await queryInterface.sequelize.query(`
      -- First, create a temporary column with the new type
      ALTER TABLE "Notifications" ADD COLUMN "type_new" VARCHAR(100);
      
      -- Copy existing data
      UPDATE "Notifications" SET "type_new" = "type"::VARCHAR(100);
      
      -- Drop the old column
      ALTER TABLE "Notifications" DROP COLUMN "type";
      
      -- Rename the new column
      ALTER TABLE "Notifications" RENAME COLUMN "type_new" TO "type";
      
      -- Make it NOT NULL
      ALTER TABLE "Notifications" ALTER COLUMN "type" SET NOT NULL;
      
      -- Add an index for better performance
      CREATE INDEX IF NOT EXISTS "idx_notifications_type" ON "Notifications" ("type");
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revert back to ENUM (this will fail if there are invalid values)
    await queryInterface.sequelize.query(`
      -- Create the ENUM type again
      CREATE TYPE "enum_Notifications_type_new" AS ENUM (
        'consultation_reminder', 'consultation_confirmation', 'consultation_cancelled',
        'prescription_ready', 'payment_successful', 'payment_failed',
        'application_approved', 'application_rejected', 'application_under_review',
        'system_announcement', 'general'
      );
      
      -- Add new column with ENUM
      ALTER TABLE "Notifications" ADD COLUMN "type_enum" "enum_Notifications_type_new";
      
      -- Copy data (this might fail if there are invalid values)
      UPDATE "Notifications" SET "type_enum" = "type"::"enum_Notifications_type_new";
      
      -- Drop old column and rename
      ALTER TABLE "Notifications" DROP COLUMN "type";
      ALTER TABLE "Notifications" RENAME COLUMN "type_enum" TO "type";
      
      -- Drop the index
      DROP INDEX IF EXISTS "idx_notifications_type";
    `);
  },
};
