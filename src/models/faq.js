"use strict";
module.exports = (sequelize, DataTypes) => {
  const Faq = sequelize.define(
    "Faq",
    {
      product_id: DataTypes.INTEGER,
      question: DataTypes.STRING,
      answer: DataTypes.TEXT,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "faqs",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  Faq.associate = (models) => {
    Faq.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
  };

  return Faq;
};
