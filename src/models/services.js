"use strict";
module.exports = (sequelize, DataTypes) => {
  const Services = sequelize.define(
    "Service",
    {
      name: DataTypes.STRING,
      title: DataTypes.STRING,
      slug: DataTypes.STRING,

      // JSON fields
      description: DataTypes.JSON,
      service_item: DataTypes.JSON,

      main_logo: DataTypes.STRING,
      sub_logo: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      tableName: "services",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  return Services;
};
