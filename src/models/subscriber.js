"use strict";
module.exports = (sequelize, DataTypes) => {
  const Subscriber = sequelize.define(
    "Subscriber",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "subscribers",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  return Subscriber;
};
