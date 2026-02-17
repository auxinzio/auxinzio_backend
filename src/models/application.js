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
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending", // pending | reviewed | rejected | selected
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
