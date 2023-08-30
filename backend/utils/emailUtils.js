import nodemailer from "nodemailer";

export const sendEmail = async (to, from, subject, text) => {
  // TODO: Configure your nodemailer transport for email service
  const transporter = nodemailer.createTransport({
    // Your transport configuration
  });

  const mailOptions = {
    to,
    from,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
