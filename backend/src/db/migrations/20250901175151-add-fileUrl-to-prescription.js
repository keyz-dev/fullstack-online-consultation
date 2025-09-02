'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Prescriptions', 'fileUrl', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL to the generated PDF prescription file'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Prescriptions', 'fileUrl');
  }
};
