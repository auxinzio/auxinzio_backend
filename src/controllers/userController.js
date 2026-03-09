const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { success, error } = require("../utils/response");
const { sendMail } = require("../utils/mailer");
const { Op } = require("sequelize");

exports.list = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.body;
    const where = {};

    if (status !== undefined) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["password"] },
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    success(res, "Users Fetched Successfully", {
      totalCount: count,
      usersList: rows,
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
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return error(res, "User Not Found", 404);
    success(res, "User Fetched Successfully", { user });
  } catch (err) {
    error(res, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return error(res, "Name, email and password are required");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return error(res, "Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "admin",
      status: true,
    });

    // Send Mail with credentials
    await sendMail({
      from: '"Auxinz Team" <support@auxinz.io>',
      to: email,
      subject: "Welcome to auxinz - Your Account Credentials",
      html: `
        <h3>Welcome ${name}!</h3>
        <p>Your account has been created successfully by the administrator. Here are your login credentials:</p>
        <p><b>Username:</b> ${name}</p>
        <p><b>Password:</b> ${password}</p>
        <p>Please log in and change your password for security.</p>
      `,
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    success(res, "User created successfully and credentials sent to email.", { user: userResponse });
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const { id, name, email, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) return error(res, "User Not Found", 404);

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return error(res, "Email already exists");
      }
    }

    await user.update({ name, email, role });

    const userResponse = user.toJSON();
    delete userResponse.password;

    success(res, "User Updated Successfully", { user: userResponse });
  } catch (err) {
    error(res, err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const user = await User.findByPk(id);
    if (!user) return error(res, "User Not Found", 404);

    await user.update({ status: status });
    success(res, "User Status Updated Successfully", { user });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const user = await User.findByPk(req.body.id);
    if (!user) return error(res, "User Not Found", 404);
    await user.destroy();
    success(res, "User Deleted Successfully");
  } catch (err) {
    error(res, err.message);
  }
};
