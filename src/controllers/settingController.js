const { Setting } = require("../models");
const { success, error } = require("../utils/response");

exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (data.value && typeof data.value === "string") {
      data.value = JSON.parse(data.value);
    }
    const setting = await Setting.create({
      key: data.key,
      value: data.value,
      status: data.status,
    });
    success(res, "Settings Created Successfully", { setting }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.body;
    const data = req.body;
    if (data.value && typeof data.value === "string") {
      data.value = JSON.parse(data.value);
    }
    const setting = await Setting.findByPk(id);
    if (!setting) {
      return error(res, "Setting Not Found", 404);
    }
    await setting.update({
      key: data.key,
      value: data.value,
      status: data.status,
    });
    success(res, "Setting Updated Successfully", {
      setting,
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.list = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 2 } = req.body;
    const where = {};
    if (status !== undefined) {
      where.status = status;
    }
    if (search) {
      where.key = {
        [require("sequelize").Op.like]: `%${search}%`,
      };
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Setting.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    success(res, "Setting Fetched Successfully", {
      totalCount: count,
      settingsList: rows,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.get = async (req, res) => {
  try {
    const setting = await Setting.findByPk(req.body.id);
    if (!setting) {
      return error(res, "Settings Not Found", 404);
    }
    success(res, "Setting Fetched Successfully", {
      setting,
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const setting = await Setting.findByPk(req.body.id);
    if (!setting) {
      return error(res, "Settings Not Found", 404);
    }
    await setting.destroy();
    success(res, "Settings Deleted Successfully");
  } catch (err) {
    error(res, err.message);
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const setting = await Setting.findByPk(req.body.id);
    if (!setting) return error(res, "Setting Not Found", 404);
    await setting.update(data);
    success(res, "Setting Status Updated Successfully", { setting });
  } catch (err) {
    error(res, err.message);
  }
};
// Web Application
exports.settingsList = async (req, res) => {
  try {
    const settings = await Setting.findAll({
      where: { status: true },
      attributes: ["key", "value"],
      order: [["id", "ASC"]],
    });

    const formattedSettings = {};

    settings.forEach((item) => {
      // handle nested JSON values if stored as string
      try {
        formattedSettings[item.key] = JSON.parse(item.value);
      } catch (e) {
        formattedSettings[item.key] = item.value;
      }
    });

    success(res, "Settings Fetched Successfully", formattedSettings);
  } catch (err) {
    error(res, err.message);
  }
};
