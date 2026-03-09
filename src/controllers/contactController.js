const { Contact } = require("../models");
const { success, error } = require("../utils/response");
const deleteImage = require("../utils/deleteImage");
const { sendMail } = require("../utils/mailer");

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

    sendContactEmails(contact);

    success(res, "Contact Submitted Successfully", { contact });
  } catch (err) {
    error(res, err.message);
  }
};

async function sendContactEmails(contact) {
  try {
    // =========================
    // 1️⃣ User Acknowledgment Mail
    // =========================
    await sendMail({
      from: `"Support Team" <${contact.email}>`,
      to: contact.email,
      subject: "Thank you for contacting Auxinz!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 15px rgba(0,0,0,0.12);">
          <div style="background: linear-gradient(90deg, #22c55e, #06b6d4); color: white; padding: 24px; text-align: center;">
            <h2 style="margin: 0;">Message Received! 📩</h2>
          </div>
          <div style="padding: 30px; background-color: #f0fdfa; color: #0f172a;">
            <h3 style="color: #14b8a6;">Hello ${contact.name},</h3>
            <p>Thank you for reaching out to Auxinz. We have received your message regarding "<b>${contact.title || "Inquiry"}</b>".</p>
            <p>Our team will review your details and get back to you as soon as possible.</p>
            <p style="font-style: italic; color: #475569;">We appreciate your interest in our services! 💚</p>
          </div>
          <div style="background-color: #ccfbf1; padding: 15px; text-align: center; color: #0f766e; font-size: 12px;">
            <p style="margin: 4px 0;">Auxinz Team</p>
            <p style="margin: 0;">© 2026 Auxinz. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    // =========================
    // 2️⃣ Admin Notification Mail
    // =========================
    let to;
    if (process.env.NODE_ENV === "development") {
      to = `navanee03092003@gmail.com`;
    } else {
      to = `${process.env.MAIL_USER}`;
    }
    await sendMail({
      from: `"Support Team" <${contact.email}>`,
      to: to,
      subject: `New Contact Submission: ${contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 15px rgba(0,0,0,0.12);">
          <div style="background: linear-gradient(90deg, #06b6d4, #14b8a6); color: white; padding: 22px; text-align: center;">
            <h2 style="margin: 0;">New Contact Form Submission</h2>
          </div>
          <div style="padding: 30px; background-color: #ecfeff; color: #0f172a;">
            <h3 style="color: #06b6d4; margin-bottom: 15px;">Submission Details</h3>
            <table style="width:100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6; width: 30%;">Name</td>
                <td style="padding: 8px;">${contact.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Email</td>
                <td style="padding: 8px;">${contact.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Phone</td>
                <td style="padding: 8px;">${contact.phone || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Subject</td>
                <td style="padding: 8px;">${contact.title || "N/A"}</td>
              </tr>
            </table>
            <div style="margin-top: 20px;">
              <p style="font-weight: bold; color:#06b6d4;">Message:</p>
              <p style="background: #fff; padding: 10px; border-radius: 8px; border: 1px solid #cffafe;">${contact.description || "No description provided."}</p>
            </div>
          </div>
          <div style="background-color: #ccfbf1; padding: 15px; text-align: center; color: #0f766e; font-size: 12px;">
            <p style="margin: 4px 0;">Admin Notification</p>
            <p style="margin: 0;">© 2026 Auxinz</p>
          </div>
        </div>
      `,
    });
    console.log("✅ Contact submission emails sent successfully");
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
}
