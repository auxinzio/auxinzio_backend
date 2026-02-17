"use strict";
module.exports = (sequelize, DataTypes) => {
  const Solution = sequelize.define(
    "Solution",
    {
      name: DataTypes.STRING,
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      description: DataTypes.STRING,
      key_point: DataTypes.JSON,
      main_logo: DataTypes.STRING,
      sub_logo: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      tableName: "solutions",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  return Solution;
};
