"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      product_name: DataTypes.STRING,
      category_name: DataTypes.STRING,
      slug: DataTypes.STRING,
      tag: DataTypes.JSON,
      key_feature: DataTypes.JSON,
      description: DataTypes.JSON,
      benefit: DataTypes.JSON,
      image: DataTypes.STRING,
      logo: DataTypes.STRING,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      product_url: { type: DataTypes.STRING },
    },
    {
      tableName: "products",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  Product.associate = (models) => {
    Product.hasMany(models.Faq, {
      foreignKey: "product_id",
      as: "faqs", // 🔥 IMPORTANT
      onDelete: "CASCADE",
    });
    Product.hasMany(models.Enquiry, {
      foreignKey: "product_id",
      as: "enquiries", // 🔥 IMPORTANT
      onDelete: "CASCADE",
    });
  };

  return Product;
};
