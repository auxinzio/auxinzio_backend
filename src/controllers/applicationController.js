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

    //   await sendMail({
    //     to: application.email,
    //     subject: "🎉 Your Application Has Been Received!",
    //     html: `
    //   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    //     <!-- Header -->
    //     <div style="background: linear-gradient(90deg, #4CAF50, #81C784); color: white; padding: 20px; text-align: center;">
    //       <h2 style="margin: 0;">Application Received!</h2>
    //     </div>
    //     <!-- Body -->
    //     <div style="padding: 30px; background-color: #f9f9f9; color: #333;">
    //       <h3 style="color: #4CAF50;">Hello ${application.applicant_name},</h3>
    //       <p>Thank you for applying to our team! 🎉</p>
    //       <p>We have successfully received your application and our HR team will review it carefully.</p>
    //       <p>If shortlisted, we will contact you with the next steps.</p>
    //       <div style="margin: 20px 0; text-align: center;">
    //         <a href="#" style="background-color: #4CAF50; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">View Careers Page</a>
    //       </div>
    //       <p style="font-style: italic; color: #555;">We appreciate your interest and wish you the best!</p>
    //     </div>
    //     <!-- Footer -->
    //     <div style="background-color: #eeeeee; padding: 15px; text-align: center; color: #555; font-size: 12px;">
    //       <p>Careers Team</p>
    //       <p>© 2026 Your Company Name</p>
    //     </div>
    //   </div>
    // `,
    //   });

    //   // 2️⃣ Send email to HR
    //   await sendMail({
    //     to: "navanee03092003@gmail.com", // HR email
    //     subject: `📝 New Application Received from ${application.applicant_name}`,
    //     html: `
    //   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    //     <!-- Header -->
    //     <div style="background: linear-gradient(90deg, #FF9800, #FFC107); color: white; padding: 20px; text-align: center;">
    //       <h2 style="margin: 0;">New Job Application</h2>
    //     </div>
    //     <!-- Body -->
    //     <div style="padding: 30px; background-color: #fff8e1; color: #333;">
    //       <h3 style="color: #FF9800;">Applicant: ${application.applicant_name}</h3>
    //       <p><strong>Email:</strong> ${application.email}</p>
    //       <p><strong>Phone:</strong> ${application.phone || "N/A"}</p>
    //       <p><strong>Position Applied:</strong> ${application.position || "N/A"}</p>
    //       <p><strong>Resume / Notes:</strong></p>
    //       <p>${application.notes || "No additional info provided."}</p>
    //       <div style="margin: 20px 0; text-align: center;">
    //         <a href="#" style="background-color: #FF9800; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">View Full Application</a>
    //       </div>
    //       <p style="font-style: italic; color: #555;">Please review and take the next steps.</p>
    //     </div>
    //     <!-- Footer -->
    //     <div style="background-color: #ffe0b2; padding: 15px; text-align: center; color: #555; font-size: 12px;">
    //       <p>HR Team</p>
    //       <p>© 2026 Your Company Name</p>
    //     </div>
    //   </div>
    // `,
    //   });

    success(res, "Application submitted successfully", { application }, 201);
  } catch (err) {
    error(res, err.message);
  }
};
// Admin Side
exports.list = async (req, res) => {
  try {
    const applications = await Application.findAll({
      order: [["id", "DESC"]],
    });
    success(res, "Application fetched successfully", {
      totalCount: applications.length,
      applicationsList: applications,
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
