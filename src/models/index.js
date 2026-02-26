"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || "production";
const configFile = require(path.join(__dirname, "../config/config.js"));
const config = configFile[env];

if (!config) {
  throw new Error(`❌ Sequelize config missing for environment: ${env}`);
}

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    logging: false,
  },
);

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js",
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .authenticate()
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

module.exports = db;
