import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

class VerificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP connection error:', error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });
  }

  async sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Embabi Store" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Verify Your Email - Embabi Store",
        text: `Your verification code is: ${verificationCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to Embabi Store!</h2>
            <p>Your verification code is:</p>
            <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 2px;">${verificationCode}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

export const verificationService = new VerificationService(); 