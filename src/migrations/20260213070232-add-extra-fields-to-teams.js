"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("teams", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "designation",
    });
    await queryInterface.addColumn("teams", "designation_flag", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: "designation",
    });

    await queryInterface.addColumn("teams", "social_link", {
      type: Sequelize.JSON,
      allowNull: true,
      after: "image",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("teams", "description");
    await queryInterface.removeColumn("teams", "social_link");
    await queryInterface.removeColumn("teams", "designation_flag");
  },
};
