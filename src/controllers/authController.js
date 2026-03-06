const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { success, error } = require("../utils/response");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, "Email & password required");
    }

    const user = await User.findOne({ where: { email, status: true } });

    if (!user) {
      return error(res, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return error(res, "Invalid credentials");
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    const userResponse = user.toJSON();
    delete userResponse.password;

    success(res, "Login successfully", {
      token: token,
      user: userResponse,
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.logout = async (req, res) => {
  try {
    success(res, "Logout successfully");
  } catch (err) {
    error(res, err.message);
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return error(res, "User Not Found");
    success(res, "User Profile Fetched Successfully", { user });
  } catch (err) {
    error(res, err.message);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) {
      return error(res, "Old and new passwords are required", 400);
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return error(res, "User Not Found", 404);

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return error(res, "Invalid old password", 401);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    await user.update({ password: hashedPassword });

    success(res, "Password changed successfully", { user });
  } catch (err) {
    error(res, err.message);
  }
};
