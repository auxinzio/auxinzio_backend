const { Application } = require("../models");
const fs = require("fs");
const path = require("path");
const { success, error } = require("../utils/response");
const { sendMail } = require("../utils/mailer");
// Web Application
exports.submit = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.resume = `uploads/resume/${req.file.filename}`;
    }
    const application = await Application.create(data);
    // 📧 Mail trigger
    // 1️⃣ Send email to applicant
    sendApplicationEmails(application);
    success(res, "Application submitted successfully", { application }, 201);
  } catch (err) {
    error(res, err.message);
  }
};
// Admin Side
exports.list = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 2 } = req.body;
    const where = {};
    if (status !== undefined) {
      where.status = status;
    }
    if (search) {
      where.applicant_name = {
        [require("sequelize").Op.like]: `%${search}%`,
      };
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Application.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    success(res, "Application fetched successfully", {
      totalCount: count,
      applicationsList: rows,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};
exports.get = async (req, res) => {
  try {
    const application = await Application.findByPk(req.body.id);
    if (!application) {
      return error(res, "Applications not found", 404);
    }
    success(res, "Applications fetched successfully", { application });
  } catch (err) {
    error(res, err.message);
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const application = await Application.findByPk(data.id);
    if (!application) {
      return error(res, "Applications not found", 404);
    }
    await application.update(data);
    success(res, "Applications Status Updated successfully", { applications });
  } catch (err) {
    error(res, err.message);
  }
};
exports.remove = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return error(res, "Applications not found", 404);
    }
    if (application.resume) {
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "resume",
        application.resume,
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await application.destroy();
    success(res, "Application deleted successfully");
  } catch (err) {
    error(res, err.message);
  }
};
async function sendApplicationEmails(application) {
  try {
    // =========================
    // 1️⃣ Applicant Mail
    // =========================
    await sendMail({
      to: application.email,
      subject: "🎉 Your Application Has Been Received!",
      text: `Hello ${application.applicant_name}, Thank you for applying. Our HR team will review your application.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;
          border-radius: 12px; overflow: hidden; box-shadow: 0 6px 15px rgba(0,0,0,0.12);">
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #22c55e, #06b6d4);
            color: white; padding: 24px; text-align: center;">
            <h2 style="margin: 0;">Application Received 🎉</h2>
          </div>
          <!-- Body -->
          <div style="padding: 30px; background-color: #f0fdfa; color: #0f172a;">
            <h3 style="color: #14b8a6;">Hello ${application.applicant_name},</h3>
            <p>Thank you for applying to our team! We’re excited to review your profile.</p>
            <p>
              Your application has been <b style="color:#22c55e;">successfully received</b>.
              Our HR team will carefully evaluate it.
            </p>
            <p>If shortlisted, we’ll contact you with the next steps.</p>
            <div style="margin: 25px 0; text-align: center;">
              <a href="#"
                style="background: linear-gradient(90deg, #14b8a6, #06b6d4);
                color: white; padding: 12px 28px; border-radius: 30px;
                text-decoration: none; font-weight: bold; display: inline-block;">
                View Careers Page
              </a>
            </div>
            <p style="font-style: italic; color: #475569;">
              We truly appreciate your interest and wish you all the best 💚
            </p>
          </div>
          <!-- Footer -->
          <div style="background-color: #ccfbf1; padding: 15px; text-align: center;
            color: #0f766e; font-size: 12px;">
            <p style="margin: 4px 0;">Careers Team</p>
            <p style="margin: 0;">© 2026 Your Company Name</p>
          </div>
        </div>
      `,
    });
    // =========================
    // 2️⃣ HR Mail
    // =========================
    await sendMail({
      to: "navanee03092003@gmail.com",
      subject: `📝 New Application: ${application.applicant_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;
          border-radius: 12px; overflow: hidden; box-shadow: 0 6px 15px rgba(0,0,0,0.12);">
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #06b6d4, #14b8a6);
            color: white; padding: 22px; text-align: center;">
            <h2 style="margin: 0;">New Job Application</h2>
          </div>
          <!-- Body -->
          <div style="padding: 30px; background-color: #ecfeff; color: #0f172a;">
            <h3 style="color: #06b6d4; margin-bottom: 15px;">
              Applicant Details
            </h3>
            <table style="width:100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Name</td>
                <td style="padding: 8px;">${application.applicant_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Email</td>
                <td style="padding: 8px;">${application.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Phone</td>
                <td style="padding: 8px;">${application.phone || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Position</td>
                <td style="padding: 8px;">${application.title || "N/A"}</td>
              </tr>
            </table>
            <div style="margin-top: 20px;">
              <p style="font-weight: bold; color:#06b6d4;">Notes / Message:</p>
              <p>${application.notes || "No additional information provided."}</p>
            </div>
            <div style="margin: 25px 0; text-align: center;">
              <a href="#"
                style="background: linear-gradient(90deg, #22c55e, #14b8a6);
                color: white; padding: 12px 30px; border-radius: 30px;
                text-decoration: none; font-weight: bold; display: inline-block;">
                View Full Application
              </a>
            </div>
          </div>
          <!-- Footer -->
          <div style="background-color: #ccfbf1; padding: 15px; text-align: center;
            color: #0f766e; font-size: 12px;">
            <p style="margin: 4px 0;">HR Notification</p>
            <p style="margin: 0;">© 2026 Your Company Name</p>
          </div>
        </div>
      `,
      attachments: application.resume
        ? [
            {
              filename: `${application.applicant_name}_Resume.pdf`,
              path: application.resume, // local file path
            },
          ]
        : [],
    });
    console.log("✅ Applicant & HR emails sent successfully");
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
}
