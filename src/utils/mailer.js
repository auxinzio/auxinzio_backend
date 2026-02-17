const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.auxinz.io",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER, // example@gmail.com
    pass: process.env.MAIL_PASS, // app password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: '"Careers Team" <support@auxinz.io>',
    to,
    subject,
    html,
  });
};

transporter.verify((err, success) => {
  if (err) console.log(err);
  else console.log("Mail server ready ✅");
});
