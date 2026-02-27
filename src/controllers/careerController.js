const { Career } = require("../models");
const { success, error } = require("../utils/response");

exports.list = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 2 } = req.body;
    const where = {};
    if (status !== undefined) {
      where.status = status;
    }
    if (search) {
      where.title = {
        [require("sequelize").Op.like]: `%${search}%`,
      };
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Career.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    success(res, "Careers fetched successfully", {
      totalCount: count,
      careersList: rows,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.get = async (req, res) => {
  try {
    const { id } = req.body;
    const career = await Career.findByPk(id);
    if (!career) {
      return error(res, "Career not found", 404);
    }
    success(res, "Career fetched successfully", { career });
  } catch (err) {
    error(res, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (data.requirements && typeof data.requirements === "string") {
      data.requirements = JSON.parse(data.requirements);
    }
    if (data.title) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    if (data.social_link && typeof data.social_link === "string") {
      data.social_link = JSON.parse(data.social_link);
    }
    const career = await Career.create(data);
    success(res, "Career created successfully", { career }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const career = await Career.findByPk(data.id);
    if (!career) {
      return error(res, "Career not found", 404);
    }
    if (data.title) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    if (data.requirements && typeof data.requirements === "string") {
      data.requirements = JSON.parse(data.requirements);
    }

    await career.update(data);
    success(res, "Career Updated successfully", { career });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    const career = await Career.findByPk(id);
    if (!career) {
      return error(res, "Career not found", 404);
    }
    await career.destroy();
    success(res, "Career deleted successfully");
  } catch (err) {
    error(res, err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const career = await Career.findByPk(req.body.id);
    if (!career) return error(res, "Career Not Found", 404);
    await career.update(data);
    success(res, "Career Status Updated Successfully", { career });
  } catch (err) {
    error(res, err.message);
  }
};
// Web Application
exports.jobList = async (req, res) => {
  try {
    const careers = await Career.findAll({
      order: [["id", "DESC"]],
    });
    success(res, "Careers fetched successfully", {
      count: careers.length,
      careersList: careers,
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.jobShow = async (req, res) => {
  try {
    const careers = await Career.findOne({
      where: {
        slug: req.body.slug,
        status: true,
      },
    });
    if (!careers) return error(res, "Careers not found", 404);
    success(res, "Careers fetched successfully", { careers });
  } catch (err) {
    error(res, err.message);
  }
};
