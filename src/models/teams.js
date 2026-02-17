"use strict";
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    "Team",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      designation: { type: DataTypes.STRING },
      image: { type: DataTypes.STRING },
      status: { type: DataTypes.BOOLEAN },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      social_link: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      designation_flag: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "teams",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  return Team;
};
