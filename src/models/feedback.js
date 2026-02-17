"use strict";
module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define(
    "Feedback",
    {
      name: DataTypes.STRING,
      content: DataTypes.TEXT,
      rating: DataTypes.INTEGER,
      location: DataTypes.STRING,
      image: DataTypes.STRING,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // web-la approve aana apram true
      },
    },
    {
      tableName: "feedbacks",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  return Feedback;
};
