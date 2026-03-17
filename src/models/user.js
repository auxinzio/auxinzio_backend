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
      mfa_user_code: DataTypes.STRING,
      mfa_admin_code: DataTypes.STRING,
      mfa_expires_at: DataTypes.DATE,
      is_mfa_enabled: DataTypes.BOOLEAN,
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
