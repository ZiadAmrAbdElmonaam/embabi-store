import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetPasswordEmail = async (email: string, resetCode: string) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Password Reset Code</h1>
        <p>You requested to reset your password.</p>
        <p>Your password reset code is:</p>
        <h2 style="color: #4CAF50; font-size: 32px; letter-spacing: 2px;">${resetCode}</h2>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}; 