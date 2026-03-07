'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'mfa_user_code', {
      type: Sequelize.STRING,
      allowNull: true,
      after: "status",

    });

    await queryInterface.addColumn('users', 'mfa_admin_code', {
      type: Sequelize.STRING,
      allowNull: true,
      after: "mfa_user_code",

    });

    await queryInterface.addColumn('users', 'mfa_expires_at', {
      type: Sequelize.STRING,
      allowNull: true,
      after: "mfa_admin_code",

    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'mfa_user_code');
    await queryInterface.removeColumn('users', 'mfa_admin_code');
    await queryInterface.removeColumn('users', 'mfa_expires_at');
  }
};
