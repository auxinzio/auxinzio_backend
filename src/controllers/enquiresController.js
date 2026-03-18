const { Enquiry, Product } = require("../models");
const { success, error } = require("../utils/response");
const { sendMail } = require("../utils/mailer");
const crypto = require("crypto");

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
    const { rows, count } = await Enquiry.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_name"],
        },
      ],
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    const enquiresData = rows.map((enquires) => {
      const item = enquires.toJSON();
      return {
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        company: item.company,
        object: item.object,
        product_id: item.product_id,
        product_name: item.product?.product_name || null,
        reason: item.reason,
        demo_url: item.demo_url,
        expiry_at: item.expiry_at,
        access_token: item.access_token,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deleted_at: item.deleted_at,
      };
    });
    success(res, "Enquires Fetched Successfully", {
      totalCount: count,
      enquiresList: enquiresData,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    error(res, err.message);
  }
};

exports.get = async (req, res) => {
  try {
    const enquires = await Enquiry.findByPk(req.body.id);

    // const enquiresData = await Enquiry.findAll({
    //   where: { id: req.body.id },
    //   include: [
    //     {
    //       model: Product,
    //       as: "product",
    //       attributes: ["product_name"],
    //     },
    //   ],
    // });
    // const enquires = enquiresData?.map((enquires) => {
    //   const item = enquires.toJSON();
    //   return {
    //     id: item.id,
    //     name: item.name,
    //     email: item.email,
    //     phone: item.phone,
    //     company: item.company,
    //     object: item.object,
    //     product_id: item.product_id,
    //     product_name: item.product?.product_name || null,
    //     status: item.status,
    //     createdAt: item.createdAt,
    //     updatedAt: item.updatedAt,
    //     deleted_at: item.deleted_at,
    //   };
    // });
    if (!enquires) return error(res, "Enquires Not Found", 404);
    success(res, "Enquires Fetched Successfully", { enquires });
  } catch (err) {
    error(res, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    // Demo Link Logic
    if (data.product_id) {
      const product = await Product.findByPk(data.product_id);
      if (product && product.product_url) {
        data.demo_url = product.product_url;
        data.access_token = crypto.randomBytes(16).toString("hex");
        data.expiry_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
      }
    }
    const enquires = await Enquiry.create(data);
    const enquiresData = {
      id: enquires.id,
      name: enquires.name,
      email: enquires.email,
      phone: enquires.phone,
      company: enquires.company,
      object: enquires.object,
      product_id: enquires.product_id,
      product_name: enquires.product?.product_name || null,
      reason: enquires.reason,
      demo_url: enquires.demo_url,
      expiry_at: enquires.expiry_at,
      access_token: enquires.access_token,
      status: enquires.status,
      createdAt: enquires.createdAt,
      updatedAt: enquires.updatedAt,
      deleted_at: enquires.deleted_at,
    };
    success(res, "Enquires Created Successfully", { enquiresData }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    // Demo Link Logic
    if (data.product_id) {
      const product = await Product.findByPk(data.product_id);
      if (product && product.product_url) {
        data.demo_url = product.product_url;
        data.access_token = crypto.randomBytes(16).toString("hex");
        data.expiry_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
      }
    }
    const enquires = await Enquiry.findByPk(req.body.id);
    if (!enquires) return error(res, "Enquires Not Found", 404);
    await enquires.update(data);
    success(res, "Enquires Updated Successfully", { enquires });
  } catch (err) {
    error(res, err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const enquires = await Enquiry.findByPk(req.body.id);
    if (!enquires) return error(res, "Enquires Not Found", 404);
    await enquires.update(data);
    success(res, "Enquires Status Updated Successfully", { enquires });
  } catch (err) {
    error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const enquires = await Enquiry.findByPk(req.body.id);
    if (!enquires) return error(res, "Enquires Not Found", 404);
    await enquires.destroy();
    success(res, "Enquires Deleted Successfully");
  } catch (err) {
    error(res, err.message);
  }
};

// Web application
exports.submit = async (req, res) => {
  try {
    const data = req.body;

    // Demo Link Logic
    if (data.product_id) {
      const product = await Product.findByPk(data.product_id);
      if (product && product.product_url) {
        data.demo_url = product.product_url;
        data.access_token = crypto.randomBytes(16).toString("hex");
        // data.expiry_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
        data.expiry_at = new Date(Date.now() + 1 * 60 * 1000);
      }
    }

    const enquires = await Enquiry.create(data);

    sendEnquiryEmails(enquires);

    const enquiresData = {
      id: enquires.id,
      name: enquires.name,
      email: enquires.email,
      phone: enquires.phone,
      company: enquires.company,
      object: enquires.object,
      reason: enquires.reason,
      product_id: enquires.product_id,
      product_name: enquires.product?.product_name || null,
      demo_url: enquires.demo_url,
      expiry_at: enquires.expiry_at,
      access_token: enquires.access_token,
      status: enquires.status,
      createdAt: enquires.createdAt,
      updatedAt: enquires.updatedAt,
      deleted_at: enquires.deleted_at,
    };
    success(res, "Enquires Submitted Successfully", { enquiresData });
  } catch (err) {
    error(res, err.message);
  }
};

exports.getDemo = async (req, res) => {
  try {
    const { token } = req.params;
    const enquiry = await Enquiry.findOne({ where: { access_token: token } });

    if (!enquiry) {
      return res.status(404).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #ef4444;">Invalid Demo Link</h1>
          <p>We couldn't find a demo associated with this link.</p>
          <a href="https://auxinz.io" style="color: #06b6d4;">Return to Home</a>
        </div>
      `);
    }

    if (new Date() > new Date(enquiry.expiry_at)) {
      return res.status(410).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #f59e0b;">Demo Link Expired</h1>
          <p>This demo link has expired. Please submit a new enquiry if you still need access.</p>
          <a href="https://auxinz.io" style="color: #06b6d4;">Contact Support</a>
        </div>
      `);
    }

    if (!enquiry.demo_url) {
      return res.status(404).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #ef4444;">Demo Not Found</h1>
          <p>No demo URL is associated with this enquiry.</p>
          <a href="https://auxinz.io" style="color: #06b6d4;">Return to Home</a>
        </div>
      `);
    }

    // Redirect to the actual demo URL
    res.redirect(enquiry.demo_url);
  } catch (err) {
    res.status(500).send("An error occurred while processing your request.");
  }
};

async function sendEnquiryEmails(enquiry) {
  try {
    // Fetch product name if available
    let product_name = "Detailed Inquiry";
    if (enquiry.product_id) {
      const product = await Product.findByPk(enquiry.product_id);
      if (product) product_name = product.product_name;
    }

    // Recipient logic based on environment
    let adminTo;
    if (process.env.NODE_ENV === "development") {
      adminTo = `navanee03092003@gmail.com`;
    } else {
      adminTo = `${process.env.MAIL_USER}`;
    }

    // =========================
    // 1️⃣ User Acknowledgment Mail
    // =========================
    await sendMail({
      from: '"Support Team" <support@auxinz.io>',
      to: enquiry.email,
      subject: "We've received your enquiry - Auxinz",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 15px rgba(0,0,0,0.12);">
          <div style="background: linear-gradient(90deg, #22c55e, #06b6d4); color: white; padding: 24px; text-align: center;">
            <h2 style="margin: 0;">Enquiry Received! 🚀</h2>
          </div>
          <div style="padding: 30px; background-color: #f0fdfa; color: #0f172a;">
            <h3 style="color: #14b8a6;">Hello ${enquiry.name},</h3>
            <p>Thank you for inquiring about our services at Auxinz. We have received your request regarding <b>${product_name}</b>.</p>
            <p>Our business team is evaluating your requirements and will reach out to you shortly via ${enquiry.email} or ${enquiry.phone || "your provided phone number"}.</p>
            <p>You can access the demo at <a href="${enquiry.demo_url}">${enquiry.demo_url}</a></p>
            <p style="font-style: italic; color: #475569;">Looking forward to collaborating with you! 💚</p>
          </div>
          <div style="background-color: #ccfbf1; padding: 15px; text-align: center; color: #0f766e; font-size: 12px;">
            <p style="margin: 4px 0;">Auxinz Business Team</p>
            <p style="margin: 0;">© 2026 Auxinz. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    // =========================
    // 2️⃣ Admin Notification Mail
    // =========================
    await sendMail({
      from: '"Support Team" <support@auxinz.io>',
      to: adminTo,
      subject: `New Business Enquiry from ${enquiry.company || enquiry.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 15px rgba(0,0,0,0.12);">
          <div style="background: linear-gradient(90deg, #06b6d4, #14b8a6); color: white; padding: 22px; text-align: center;">
            <h2 style="margin: 0;">New Enquiry Received</h2>
          </div>
          <div style="padding: 30px; background-color: #ecfeff; color: #0f172a;">
            <h3 style="color: #06b6d4; margin-bottom: 15px;">Enquiry Details</h3>
            <table style="width:100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6; width: 30%;">Name</td>
                <td style="padding: 8px;">${enquiry.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Company</td>
                <td style="padding: 8px;">${enquiry.company || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Email</td>
                <td style="padding: 8px;">${enquiry.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Phone</td>
                <td style="padding: 8px;">${enquiry.phone || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Product</td>
                <td style="padding: 8px;">${product_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Reason</td>
                <td style="padding: 8px;">${enquiry.reason || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Demo URL</td>
                <td style="padding: 8px;">${enquiry.demo_url || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Expiry Date</td>
                <td style="padding: 8px;">${enquiry.expiry_at || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color:#14b8a6;">Access Token</td>
                <td style="padding: 8px;">${enquiry.access_token || "N/A"}</td>
              </tr>
            </table>
            <div style="margin-top: 20px;">
              <p style="font-weight: bold; color:#06b6d4;">Message / Requirement:</p>
              <p style="background: #fff; padding: 10px; border-radius: 8px; border: 1px solid #cffafe;">${enquiry.object || "No details provided."}</p>
            </div>
          </div>
          <div style="background-color: #ccfbf1; padding: 15px; text-align: center; color: #0f766e; font-size: 12px;">
            <p style="margin: 4px 0;">Sales Notification</p>
            <p style="margin: 0;">© 2026 Auxinz</p>
          </div>
        </div>
      `,
    });
    console.log("✅ Enquiry submission emails sent successfully");
  } catch (err) {
    console.error("❌ Enquiry email sending failed:", err);
  }
}
