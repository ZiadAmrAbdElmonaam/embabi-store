"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class VerificationService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        this.transporter.verify((error, success) => {
            if (error) {
                console.error('SMTP connection error:', error);
            }
            else {
                console.log('Server is ready to take our messages');
            }
        });
    }
    sendVerificationEmail(email, verificationCode) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield this.transporter.sendMail(mailOptions);
                console.log('Verification email sent successfully');
            }
            catch (error) {
                console.error('Error sending verification email:', error);
                throw new Error('Failed to send verification email');
            }
        });
    }
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
exports.verificationService = new VerificationService();
