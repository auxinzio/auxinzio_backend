const { Service } = require("../models");
const fs = require("fs");
const path = require("path");
const { success, error } = require("../utils/response");
// helper to delete image
const deleteImage = (folder, filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "..", "uploads", folder, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    // JSON fields (important for multipart/form-data)
    if (data.description) data.description = JSON.parse(data.description);
    if (data.service_item) data.service_item = JSON.parse(data.service_item);
    // images
    if (req.files?.main_logo) {
      // data.main_logo = req.files.main_logo[0].filename;
      data.main_logo = `uploads/service/${req.files.main_logo[0].filename}`;
    }
    if (req.files?.sub_logo) {
      // data.sub_logo = req.files.sub_logo[0].filename;
      data.sub_logo = `uploads/service/${req.files.sub_logo[0].filename}`;
    }
    const service = await Service.create(data);
    success(res, "Service Created Successfully", { service }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;

    const service = await Service.findByPk(data.id);
    if (!service) return error(res, "Service Not Found", 404);

    // 🔥 slug always from title (if title present)
    if (data.title) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // JSON fields safe parse
    if (data.description && typeof data.description === "string") {
      data.description = JSON.parse(data.description);
    }

    if (data.service_item && typeof data.service_item === "string") {
      data.service_item = JSON.parse(data.service_item);
    }

    // replace main_logo
    if (req.files?.main_logo) {
      deleteImage("service", service.main_logo);
      data.main_logo = `uploads/service/${req.files.main_logo[0].filename}`;
    }

    // replace sub_logo
    if (req.files?.sub_logo) {
      deleteImage("service", service.sub_logo);
      data.sub_logo = `uploads/service/${req.files.sub_logo[0].filename}`;
    }

    await service.update(data);

    success(res, "Service Updated Successfully", {
      service,
    });
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
      where.title = {
        [require("sequelize").Op.like]: `%${search}%`,
      };
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Service.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    success(res, "Services Fetched Successfully", {
      totalCount: count,
      serviceList: rows,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.get = async (req, res) => {
  try {
    const service = await Service.findByPk(req.body.id);
    if (!service) return error(res, "Service Not Found", 404);
    success(res, "Service Fetched Successfully", { service });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const service = await Service.findByPk(req.body.id);
    if (!service) return error(res, "Service Not Found", 404);
    // delete images
    deleteImage("service", service.main_logo);
    deleteImage("service", service.sub_logo);
    await service.destroy();
    success(res, "Service Deleted Successfully");
  } catch (err) {
    error(res, err.message);
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const service = await Service.findByPk(req.body.id);
    if (!service) return error(res, "Service Not Found", 404);
    await service.update(data);
    success(res, "Service Status Updated Successfully", { service });
  } catch (err) {
    error(res, err.message);
  }
};
// Web Application
exports.servicesList = async (req, res) => {
  try {
    const service = await Service.findAll({
      where: { status: true },
      order: [["id", "DESC"]],
    });
    success(res, "Services Fetched Successfully", {
      totalCount: service.length,
      serviceList: service,
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.servicesShow = async (req, res) => {
  try {
    const service = await Service.findOne({
      where: {
        slug: req.body.slug,
        status: true,
      },
    });
    if (!service) return error(res, "Service Not Found", 404);
    success(res, "Service Fetched Successfully", { service });
  } catch (err) {
    error(res, err.message);
  }
};
