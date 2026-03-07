const { Client } = require("../models");
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
    const { rows, count } = await Client.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    success(res, "Clients fetched successfully", {
      totalCount: count,
      clientsList: rows,
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
    const client = await Client.findByPk(id);
    if (!client) {
      return error(res, "Client not found", 404);
    }
    success(res, "Client fetched successfully", { client });
  } catch (err) {
    error(res, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `uploads/clients/${req.file.filename}`;
    const client = await Client.create(data);
    success(res, "Client created successfully", { client }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `uploads/clients/${req.file.filename}`;
    const client = await Client.findByPk(req.body.id);
    if (!client) {
      return error(res, "Client not found", 404);
    }
    await client.update(data);
    success(res, "Client Updated successfully", { client });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    const client = await Client.findByPk(id);
    if (!client) {
      return error(res, "Client not found", 404);
    }
    await client.destroy();
    success(res, "Client deleted successfully");
  } catch (err) {
    error(res, err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const client = await Client.findByPk(req.body.id);
    if (!client) return error(res, "Client Not Found", 404);
    await client.update(data);
    success(res, "Client Status Updated Successfully", { client });
  } catch (err) {
    error(res, err.message);
  }
};
// Web Application
exports.clientList = async (req, res) => {
  try {
    let where = { status: true };
    const clients = await Client.findAll({
      where,
      order: [["id", "DESC"]],
    });
    success(res, "Clients fetched successfully", {
      count: clients.length,
      clientsList: clients,
    });
  } catch (err) {
    error(res, err.message);
  }
};