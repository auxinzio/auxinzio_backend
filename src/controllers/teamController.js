const { Team } = require("../models");
const { success, error } = require("../utils/response");
const deleteImage = require("../utils/deleteImage");

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
    const { rows, count } = await Team.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    const teams = await Team.findAll({
      order: [["id", "DESC"]],
    });
    success(res, "Teams fetched successfully", {
      totalCount: count,
      teamsList: rows,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.get = async (req, res) => {
  try {
    const team = await Team.findByPk(req.body.id);
    if (!team) return error(res, "Team not found", 404);
    success(res, "Team fetched successfully", { team });
  } catch (err) {
    error(res, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `uploads/team/${req.file.filename}`;
    // JSON safe
    if (data.social_link && typeof data.social_link === "string") {
      data.social_link = JSON.parse(data.social_link);
    }
    const team = await Team.create(data);
    success(res, "Team created successfully", { team }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const team = await Team.findByPk(req.body.id);
    if (!team) return error(res, "Team not found", 404);
    if (req.file) {
      deleteImage(team.image);
      data.image = `uploads/team/${req.file.filename}`;
    }
    if (data.social_link && typeof data.social_link === "string") {
      data.social_link = JSON.parse(data.social_link);
    }
    await team.update(data);
    success(res, "Team updated successfully", { team });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const team = await Team.findByPk(req.body.id);
    if (!team) return error(res, "Team not found", 404);
    deleteImage(team.image);
    await team.destroy();
    success(res, "Team deleted successfully");
  } catch (err) {
    error(res, err.message);
  }
};

// Web application
exports.teamsList = async (req, res) => {
  try {
    const team = await Team.findAll({
      where: { status: true },
      order: [["id", "ASC"]],
    });
    success(res, "Teams fetched successfully", {
      totalCount: team.length,
      teamsList: team,
    });
  } catch (err) {
    error(res, err.message);
  }
};
