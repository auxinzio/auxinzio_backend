"use strict";
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define(
    "Contact",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      title: { type: DataTypes.STRING },
      status: { type: DataTypes.BOOLEAN },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "contacts",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  return Contact;
};
