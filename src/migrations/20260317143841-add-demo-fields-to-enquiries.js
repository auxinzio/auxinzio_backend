'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("enquiries", "reason", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "object",
    });
    await queryInterface.addColumn("enquiries", "demo_url", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "reason",
    });
    await queryInterface.addColumn("enquiries", "expiry_at", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "demo_url",
    });
    await queryInterface.addColumn("enquiries", "access_token", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      after: "expiry_at",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("enquiries", "reason");
    await queryInterface.removeColumn("enquiries", "demo_url");
    await queryInterface.removeColumn("enquiries", "expiry_at");
    await queryInterface.removeColumn("enquiries", "access_token");
  }
};
