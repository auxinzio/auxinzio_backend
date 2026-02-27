const { Solution } = require("../models");
const fs = require("fs");
const path = require("path");
const { success, error } = require("../utils/response");

// helper to delete image
const deleteImage = (filename) => {
  if (!filename) return;
  const imgPath = path.join(__dirname, "..", "uploads", "solution", filename);
  if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    // 🔥 slug from title
    if (data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    // JSON safe
    if (data.key_point && typeof data.key_point === "string") {
      data.key_point = JSON.parse(data.key_point);
    }
    // images
    if (req.files?.main_logo) {
      // data.main_logo = req.files.main_logo[0].filename;
      data.main_logo = `uploads/solution/${req.files.main_logo[0].filename}`;
    }
    if (req.files?.sub_logo) {
      // data.sub_logo = req.files.sub_logo[0].filename;
      data.sub_logo = `uploads/solution/${req.files.sub_logo[0].filename}`;
    }
    const solution = await Solution.create(data);
    success(res, "Solution Created Successfully", { solution }, 201);
  } catch (err) {
    console.log(err.errors || err);
    error(res, err.errors?.[0]?.message || err.message, 500);
  }
};
exports.update = async (req, res) => {
  try {
    const { id } = req.body;
    const data = req.body;
    const solution = await Solution.findByPk(id);
    if (!solution) {
      return error(res, "Solution Not Found", 404);
    }
    // 🔥 slug from title (same logic as create)
    if (data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    // JSON safe
    if (data.key_point && typeof data.key_point === "string") {
      data.key_point = JSON.parse(data.key_point);
    }
    // replace main_logo
    if (req.files?.main_logo) {
      deleteImage(solution.main_logo);
      data.main_logo = `uploads/solution/${req.files.main_logo[0].filename}`;
    }
    // replace sub_logo
    if (req.files?.sub_logo) {
      deleteImage(solution.sub_logo);
      data.sub_logo = `uploads/solution/${req.files.sub_logo[0].filename}`;
    }
    await solution.update(data);
    success(res, "Solution Updated Successfully", { solution });
  } catch (err) {
    error(res, err.message, 500);
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
      where.title = {
        [require("sequelize").Op.like]: `%${search}%`,
      };
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Solution.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    success(res, "Solution Fetched Successfully", {
      totalCount: count,
      solutionsList: rows,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};
exports.get = async (req, res) => {
  try {
    const solution = await Solution.findByPk(req.body.id);
    if (!solution) return error(res, "Solution Not Found", 404);
    success(res, "Solution Fetched Successfully", { solution });
  } catch (err) {
    error(res, err.message);
  }
};
exports.remove = async (req, res) => {
  try {
    const solution = await Solution.findByPk(req.body.id);
    if (!solution) return error(res, "Solution Not Found", 404);
    // delete images
    deleteImage(solution.main_logo);
    deleteImage(solution.sub_logo);
    await solution.destroy(); // paranoid soft delete
    // res.json({ message: 'Solution deleted' });
    success(res, "Solution Deleted Successfully");
  } catch (err) {
    error(res, err.message);
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const solution = await Solution.findByPk(req.body.id);
    if (!solution) return error(res, "Solution Not Found", 404);
    await solution.update(data);
    success(res, "Solution Status Updated Successfully", { solution });
  } catch (err) {
    error(res, err.message);
  }
};
// Web Application
exports.solutionsList = async (req, res) => {
  try {
    const solution = await Solution.findAll({
      where: { status: true },
      order: [["id", "DESC"]],
    });
    success(res, "Solutions Fetched Successfully", {
      totalCount: solution.length,
      solutionsList: solution,
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.solutionsShow = async (req, res) => {
  try {
    const solution = await Solution.findOne({
      where: {
        slug: req.body.slug,
        status: true,
      },
    });
    if (!solution) return error(res, "Solutions Not Found", 404);
    success(res, "Solutions Fetched Successfully", { solution });
  } catch (err) {
    error(res, err.message);
  }
};
