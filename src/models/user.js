"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      tableName: "users",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  return User;
};
