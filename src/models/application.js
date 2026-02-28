"use strict";
module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define(
    "Application",
    {
      job_id: DataTypes.STRING,
      applicant_name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      resume: DataTypes.STRING,
      social_link: { type: DataTypes.JSON, allowNull: true },
      cover_letter: { type: DataTypes.TEXT, allowNull: true },
      designation: { type: DataTypes.STRING, allowNull: true },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
    },
    {
      tableName: "applications",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  return Application;
};
