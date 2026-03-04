const { Subscriber } = require("../models");
const { success, error } = require("../utils/response");

exports.submit = async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await Subscriber.findOne({ where: { email }, paranoid: false });
    if (exists) {
      if (exists.deleted_at) {
        await exists.restore();
        await exists.update({ status: true });
        return success(res, "Subscriber Subscribed Successfully", { subscriber: exists }, 201);
      }
      return error(res, "Email Already Subscribed", 409);
    }
    const subscriber = await Subscriber.create({ email });
    success(res, "Subscriber Subscribed Successfully", { subscriber }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await Subscriber.findOne({ where: { email }, paranoid: false });
    if (exists) {
      if (exists.deleted_at) {
        await exists.restore();
        await exists.update({ status: true });
        return success(res, "Subscriber Created Successfully", { subscriber: exists }, 201);
      }
      return error(res, "Email Already Subscribed", 409);
    }
    const subscriber = await Subscriber.create({ email });
    success(res, "Subscriber Created Successfully", { subscriber }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.body;
    const { status } = req.body;
    const subscriber = await Subscriber.findByPk(id);
    if (!subscriber) return error(res, "Subscriber Not Found", 404);
    await subscriber.update({ status });
    success(res, "Subscriber Updated Successfully", { subscriber }, 201);
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
    success(res, "Subscribers Fetched Successfully", {
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
    if (!subscriber) return error(res, "Subscriber Not Found", 404);
    success(res, "Subscriber Fetched Successfully", { subscriber });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByPk(req.body.id);
    if (!subscriber) return error(res, "Subscriber Not Found", 404);
    await subscriber.update({ status: false });
    await subscriber.destroy();
    success(res, "Subscriber Deleted Successfully");
  } catch (err) {
    error(res, err.message);
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const subscriber = await Subscriber.findByPk(req.body.id);
    if (!subscriber) return error(res, "Subscriber Not Found", 404);
    await subscriber.update(data);
    success(res, "Subscriber Status Updated Successfully", { subscriber });
  } catch (err) {
    error(res, err.message);
  }
};