"use strict";
module.exports = (sequelize, DataTypes) => {
  const Career = sequelize.define(
    "Career",
    {
      job_id: DataTypes.STRING,
      title: DataTypes.STRING,
      department: DataTypes.STRING,
      location: DataTypes.STRING,
      type: DataTypes.STRING,
      description: DataTypes.TEXT,
      requirements: DataTypes.JSON,
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "careers",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  return Career;
};
