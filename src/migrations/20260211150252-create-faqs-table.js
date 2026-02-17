'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('faqs', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      question: Sequelize.STRING,
      answer: Sequelize.TEXT,
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('faqs');
  }
};
