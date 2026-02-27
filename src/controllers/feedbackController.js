const { Feedback } = require("../models");
const { success, error } = require("../utils/response");
const fs = require("fs");
const path = require("path");

const deleteImage = (img) => {
  if (!img) return;
  const p = path.join(__dirname, "..", "uploads", "feedback", img);
  if (fs.existsSync(p)) fs.unlinkSync(p);
};

/* ================= FRONTEND ================= */

// User submit review
exports.submit = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.filename;
    const feedback = await Feedback.create(data);
    success(res, "Review Submitted Successfully", { feedback }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

// Public list (approved only)
exports.feedbackList = async (req, res) => {
  const feedbacks = await Feedback.findAll({
    where: { status: true },
    order: [["id", "DESC"]],
  });
  success(res, "Feedback Fetched Successfully", {
    count: feedbacks.length,
    feedbacksList: feedbacks,
  });
};

/* ================= ADMIN ================= */
exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.filename;
    const feedback = await Feedback.create(data);
    success(res, "Feedback Created Successfully", { feedback }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const feedback = await Feedback.findByPk(data.id);
    if (!feedback) return error(res, "Feedback Not Found", 404);
    if (req.file) {
      deleteImage(feedback.image);
      data.image = req.file.filename;
    }
    await feedback.update(data);
    success(res, "Feedback Updated Successfully", { feedback });
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
      where.name = {
        [require("sequelize").Op.like]: `%${search}%`,
      };
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Feedback.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    success(res, "Feedback Fetched Successfully", {
      totalCount: count,
      feedbacksList: rows,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.get = async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.body.id);
    if (!feedback) return error(res, "Feedback Not Found", 404);
    success(res, "Feedback Fetched Successfully", { feedback });
  } catch (err) {
    error(res, err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.body;
    const { status } = req.body;
    const feedback = await Feedback.findByPk(id);
    if (!feedback) return error(res, "Feedback Not Found", 404);
    await feedback.update({ status });
    success(res, "Feedback Updated Successfully", { feedback });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.body.id);
    if (!feedback) return error(res, "Feedback Not Found", 404);
    deleteImage(feedback.image);
    await feedback.destroy();
    success(res, "Feedback Deleted Successfully");
  } catch (err) {
    error(res, err.message);
  }
};
