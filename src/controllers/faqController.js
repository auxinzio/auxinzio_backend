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
    const faqs = await Faq.findAll({ order: [["id", "DESC"]] });
    success(res, "Faq fetched successfully", {
      count: faqs.length,
      faqsList: faqs,
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
