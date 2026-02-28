const { Faq, Product } = require("../models");
const { success, error } = require("../utils/response");

exports.create = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    success(res, "Faq Created Successfully", { faq }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const faq = await Faq.findByPk(req.body.id);
    if (!faq) return error(res, "Faq Not Found", 404);
    await faq.update(req.body);
    success(res, "Faq Updated Successfully", { faq });
  } catch (err) {
    error(res, err.message);
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const faq = await Faq.findByPk(req.body.id);
    if (!faq) return error(res, "Faq Not Found", 404);
    await faq.update(data);
    success(res, "Faq Status Updated Successfully", { faq });
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
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_name"],
        },
      ],
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    const faqsList = rows.map((faq) => {
      const item = faq.toJSON();
      return {
        id: item.id,
        product_id: item.product_id,
        product_name: item.product?.product_name || null,
        question: item.question,
        answer: item.answer,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deleted_at: item.deleted_at,
      };
    });
    success(res, "Faq Fetched Successfully", {
      totalCount: count,
      faqsList,
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
    if (!faq) return error(res, "Faq Not Found", 404);
    await faq.destroy();
    success(res, "Faq Deleted Successfully");
  } catch (err) {
    error(res, err.message);
  }
};
