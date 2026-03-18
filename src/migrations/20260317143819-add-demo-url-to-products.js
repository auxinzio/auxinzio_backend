'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("products", "product_url", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "logo",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "product_url");
  }
};
