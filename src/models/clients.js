"use strict";
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "Client",
    {
      name: DataTypes.STRING,
      image: DataTypes.TEXT,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "clients",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  return Client;
};
