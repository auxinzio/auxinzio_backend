const { Contact } = require("../models");
const { success, error } = require("../utils/response");
const deleteImage = require("../utils/deleteImage");

exports.list = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 2 } = req.body;
    const where = {};
    if (status !== undefined) {
      where.status = status == "" ? true : false;
    }
    if (search) {
      where.name = {
        [require("sequelize").Op.like]: `%${search}%`,
      };
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Contact.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    const contacts = await Contact.findAll({
      order: [["id", "DESC"]],
    });
    success(res, "Contacts Fetched Successfully", {
      totalCount: count,
      contactsList: rows,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.get = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.body.id);
    if (!contact) return error(res, "Contact Not Found", 404);
    success(res, "Contact Fetched Successfully", { contact });
  } catch (err) {
    error(res, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const contact = await Contact.create(data);
    success(res, "Contact Created Successfully", { contact }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const contact = await Contact.findByPk(req.body.id);
    if (!contact) return error(res, "Contact Not Found", 404);
    await contact.update(data);
    success(res, "Contact Updated Successfully", { contact });
  } catch (err) {
    error(res, err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const contact = await Contact.findByPk(req.body.id);
    if (!contact) return error(res, "Contact Not Found", 404);
    await contact.update(data);
    success(res, "Contact Status Updated Successfully", { contact });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.body.id);
    if (!contact) return error(res, "Contact Not Found", 404);
    await contact.destroy();
    success(res, "Contact Deleted Successfully");
  } catch (err) {
    error(res, err.message);
  }
};

// Web application
exports.submit = async (req, res) => {
  try {
    const data = req.body;
    const contact = await Contact.create(data);
    success(res, "Contact Submitted Successfully", { contact });
  } catch (err) {
    error(res, err.message);
  }
};
