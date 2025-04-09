const nodeMailer = require("nodemailer");

const asyncHandler = require("../error/asyncHandler");

const sendEmail = asyncHandler(async ({ email, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const options = {
    from: process.env.SMTP_HOST,
    to: email,
    subject: subject,
    html: message,
  };

  await transporter.sendMail(options);

  console.log(`Email sent to ${email} with subject: ${subject}`);
});

exports.sendEmail = sendEmail;
