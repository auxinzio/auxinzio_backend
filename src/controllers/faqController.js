const { Faq } = require("../models");
const { success, error } = require("../utils/response");

exports.create = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    success(res, "Faq created successfully", { faq }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const faq = await Faq.findByPk(req.body.id);
    if (!faq) return error(res, "Faq not found", 404);
    await faq.update(req.body);
    success(res, "Faq Updated successfully", { team });
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
      where.question = {
        [require("sequelize").Op.like]: `%${search}%`,
      };
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Faq.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    success(res, "Faq fetched successfully", {
      totalCount: count,
      faqsList: rows,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const faq = await Faq.findByPk(req.body.id);
    if (!faq) return error(res, "Faq not found", 404);
    await faq.destroy();
    success(res, "Faq deleted successfully");
  } catch (err) {
    error(res, err.message);
  }
};
