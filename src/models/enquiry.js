"use strict";
module.exports = (sequelize, DataTypes) => {
  const Enquiry = sequelize.define(
    "Enquiry",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      company: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      product_id: { type: DataTypes.INTEGER },
      object: { type: DataTypes.TEXT },
      reason: { type: DataTypes.TEXT },
      demo_url: { type: DataTypes.STRING },
      expiry_at: { type: DataTypes.DATE },
      access_token: { type: DataTypes.STRING, unique: true },
      status: { type: DataTypes.BOOLEAN },
    },
    {
      tableName: "enquiries",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );
  Enquiry.associate = (models) => {
    Enquiry.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
  };
  return Enquiry;
};
