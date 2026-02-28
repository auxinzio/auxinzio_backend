'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('applications', 'social_link', {
      type: Sequelize.JSON,
      allowNull: true,
      after: "resume",
    });

    await queryInterface.addColumn('applications', 'cover_letter', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "social_link",
    });

    await queryInterface.addColumn('applications', 'designation', {
      type: Sequelize.STRING,
      allowNull: true,
      after: "cover_letter",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('applications', 'social_link');
    await queryInterface.removeColumn('applications', 'cover_letter');
    await queryInterface.removeColumn('applications', 'designation');
  }
};
