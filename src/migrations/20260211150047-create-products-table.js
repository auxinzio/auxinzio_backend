'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_name: Sequelize.STRING,
      category_name: Sequelize.STRING,
      slug: Sequelize.STRING,
      tag: Sequelize.JSON,
      key_feature: Sequelize.JSON,
      description: Sequelize.JSON,
      benefit: Sequelize.JSON,
      image: Sequelize.STRING,
      logo: Sequelize.STRING,
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
    await queryInterface.dropTable('products');
  }
};
