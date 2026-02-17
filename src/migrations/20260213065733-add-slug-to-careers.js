'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('careers', 'slug', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      after: 'title' // MySQL only (optional)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('careers', 'slug');
  }
};
