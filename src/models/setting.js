"use strict";
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define(
    "Setting",
    {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "settings",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  return Setting;
};
