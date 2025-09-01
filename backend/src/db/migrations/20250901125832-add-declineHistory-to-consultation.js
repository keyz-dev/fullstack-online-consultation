'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add declineHistory field to Consultations table
     */
    await queryInterface.addColumn('Consultations', 'declineHistory', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Array of decline records: [{timestamp, reason, patientId}]'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Remove declineHistory field from Consultations table
     */
    await queryInterface.removeColumn('Consultations', 'declineHistory');
  }
};
