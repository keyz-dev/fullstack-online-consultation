"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns for session tracking
    await queryInterface.addColumn("Consultations", "sessionData", {
      type: Sequelize.JSONB,
      allowNull: true,
      comment: "Session metadata including participants, connection status, etc.",
      defaultValue: {}
    });

    await queryInterface.addColumn("Consultations", "lastActivity", {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Last activity timestamp for session management"
    });

    await queryInterface.addColumn("Consultations", "participantStatus", {
      type: Sequelize.JSONB,
      allowNull: true,
      comment: "Track doctor and patient presence/connection status",
      defaultValue: {
        doctor: { connected: false, lastSeen: null, joinedAt: null },
        patient: { connected: false, lastSeen: null, joinedAt: null }
      }
    });

    await queryInterface.addColumn("Consultations", "callMetadata", {
      type: Sequelize.JSONB,
      allowNull: true,
      comment: "Call quality, duration, technical metadata",
      defaultValue: {}
    });

    // Add index for active session queries
    await queryInterface.addIndex("Consultations", ["status", "roomId"], {
      name: "idx_consultations_active_sessions"
    });

    // Add index for user-specific consultation queries
    await queryInterface.addIndex("Consultations", ["appointmentId", "status"], {
      name: "idx_consultations_appointment_status"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Consultations", "idx_consultations_active_sessions");
    await queryInterface.removeIndex("Consultations", "idx_consultations_appointment_status");
    
    await queryInterface.removeColumn("Consultations", "sessionData");
    await queryInterface.removeColumn("Consultations", "lastActivity");
    await queryInterface.removeColumn("Consultations", "participantStatus");
    await queryInterface.removeColumn("Consultations", "callMetadata");
  }
};
