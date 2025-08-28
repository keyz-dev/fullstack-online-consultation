"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add doctorId column to Appointments table
    await queryInterface.addColumn("Appointments", "doctorId", {
      type: Sequelize.INTEGER,
      allowNull: true, // Initially allow null so we can populate existing records
      references: {
        model: "Doctors",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Add index for better query performance
    await queryInterface.addIndex("Appointments", ["doctorId"]);

    // Populate doctorId for existing appointments
    // We need to follow the relationship: Appointment -> TimeSlot -> DoctorAvailability -> Doctor
    await queryInterface.sequelize.query(`
      UPDATE "Appointments" 
      SET "doctorId" = (
        SELECT "DoctorAvailabilities"."doctorId" 
        FROM "TimeSlots" 
        INNER JOIN "DoctorAvailabilities" ON "TimeSlots"."doctorAvailabilityId" = "DoctorAvailabilities"."id" 
        WHERE "TimeSlots"."id" = "Appointments"."timeSlotId"
      )
      WHERE "doctorId" IS NULL
    `);

    // Make doctorId not null after populating
    await queryInterface.changeColumn("Appointments", "doctorId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Doctors",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the doctorId column
    await queryInterface.removeColumn("Appointments", "doctorId");
  },
};
