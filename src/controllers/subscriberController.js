const { Subscriber } = require("../models");
const { success, error } = require("../utils/response");

exports.create = async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await Subscriber.findOne({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "Email already subscribed" });
    const subscriber = await Subscriber.create({ email });
    success(res, "subscriber created successfully", { subscriber }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.body;
    const { status } = req.body;
    const subscriber = await Subscriber.findByPk(id);
    if (!subscriber) return error(res, "Subscriber not found", 404);
    await subscriber.update({ status });
    success(res, "Subscriber Updated successfully", { subscriber }, 201);
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
      where.email = {
        [require("sequelize").Op.like]: `%${search}%`,
      };
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Subscriber.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    success(res, "Subscribers fetched successfully", {
      totalCount: count,
      subscribersList: rows,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.get = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByPk(req.body.id);
    if (!subscriber) return error(res, "Subscriber not found", 404);
    success(res, "Subscriber fetched successfully", { subscriber });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByPk(req.body.id);
    if (!subscriber) return error(res, "Subscriber not found", 404);
    await subscriber.destroy(); // soft delete
    success(res, "Subscriber deleted successfully");
  } catch (err) {
    error(res, err.message);
  }
};
