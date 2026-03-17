'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'is_mfa_enabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after: "status",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'is_mfa_enabled');
  }
};
