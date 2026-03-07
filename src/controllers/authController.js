const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { success, error } = require("../utils/response");
const { sendMail } = require("../utils/mailer");
const crypto = require("crypto");

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return error(res, "name & password required");
    }

    const user = await User.findOne({ where: { name, status: true } });

    if (!user) {
      return error(res, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return error(res, "Invalid credentials");
    }

    // Generate two 6-digit codes
    const userCode = crypto.randomInt(100000, 999999).toString();
    const adminCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await user.update({
      mfa_user_code: userCode,
      mfa_admin_code: adminCode,
      mfa_expires_at: expiresAt,
    });

    // Send Mail to User
    await sendMail({
      to: user.email,
      subject: "Login Verification Code",
      html: `<p>Your secure login code is: <b>${userCode}</b></p>`,
    });

    // Send Mail to Admin (configured in .env)
    const adminEmail = 'navanee03092003@gmail.com' || process.env.MAIL_USER;
    await sendMail({
      to: adminEmail,
      subject: "Admin Security Verification Code",
      html: `<p>Security verification code for user <b>${user.email}</b> login: <b>${adminCode}</b></p>`,
    });

    success(res, "Verification codes sent to registered email.", {
      email: user.email,
      mfa_required: true,
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.verifyMFA = async (req, res) => {
  try {
    const { email, user_code, admin_code } = req.body;

    if (!email || !user_code || !admin_code) {
      error(res, "Email and both verification codes are required");
    }

    const user = await User.findOne({ where: { email, status: true } });

    if (!user) {
      error(res, "User not found or inactive");
    }

    if (!user.mfa_expires_at || new Date() > user.mfa_expires_at) {
      error(res, "Verification codes have expired");
    }

    if (user.mfa_user_code !== user_code || user.mfa_admin_code !== admin_code) {
      error(res, "Invalid verification codes");
    }

    // Clear MFA codes after successful verification
    await user.update({
      mfa_user_code: null,
      mfa_admin_code: null,
      mfa_expires_at: null,
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const userResponse = user.toJSON();
    delete userResponse.password;
    delete userResponse.mfa_user_code;
    delete userResponse.mfa_admin_code;
    delete userResponse.mfa_expires_at;

    success(res, "Login successful", {
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
    const userResponse = user.toJSON();
    delete userResponse.password;

    success(res, "Password changed successfully", { user: userResponse });
  } catch (err) {
    error(res, err.message);
  }
};
