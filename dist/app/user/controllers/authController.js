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
exports.resetPassword = exports.forgotPassword = exports.signOut = exports.signIn = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const tokenHelper_1 = require("../helpers/tokenHelper");
const authValidation_1 = require("../validations/authValidation");
const User_1 = __importDefault(require("../models/User"));
const verificationService_1 = require("../../services/verification/verificationService");
const crypto_1 = __importDefault(require("crypto"));
const emailService_1 = require("../../services/email/emailService");
// Sign-Up Controller
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body
        const { error } = authValidation_1.signUpSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { email, password, role = 'user' } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        // Generate verification code
        const verificationCode = verificationService_1.verificationService.generateVerificationCode();
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({
            email,
            password: hashedPassword,
            role: role,
            verificationCode,
            verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000),
            isVerified: false
        });
        yield user.save();
        // Send verification email
        yield verificationService_1.verificationService.sendVerificationEmail(email, verificationCode);
        res.status(201).json({
            message: 'User created successfully. Please check your email for verification code.',
            userId: user._id
        });
    }
    catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Error creating user' });
    }
});
exports.signUp = signUp;
// Sign-In Controller
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body
        const { error } = authValidation_1.signInSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { email, password } = req.body;
        // Find user by email and explicitly type it as IUser
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({ error: 'Please verify your email first' });
        }
        // Compare password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        // Generate token with user info
        const token = (0, tokenHelper_1.generateToken)(user._id.toString(), user.role);
        // Return success response with token and user info
        res.status(200).json({
            message: 'Signed in successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (err) {
        console.error('Sign in error:', err);
        res.status(500).json({ error: 'Error signing in' });
    }
});
exports.signIn = signIn;
const signOut = (req, res) => {
    res.status(200).json({ message: 'Signed out successfully' });
};
exports.signOut = signOut;
// Forgot Password Controller
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        // Find user by email
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        // Save reset token to user
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        yield user.save();
        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        // Send reset password email
        try {
            yield (0, emailService_1.sendResetPasswordEmail)(user.email, resetUrl);
            res.status(200).json({
                message: 'Password reset link sent to email'
            });
        }
        catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            yield user.save();
            return res.status(500).json({
                error: 'Error sending password reset email'
            });
        }
    }
    catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({
            error: 'Error processing forgot password request'
        });
    }
});
exports.forgotPassword = forgotPassword;
// Reset Password Controller
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({
                error: 'Token and new password are required'
            });
        }
        // Hash the token from the URL
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        // Find user with valid token and explicitly type it as IUser
        const user = yield User_1.default.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({
                error: 'Invalid or expired reset token'
            });
        }
        // Hash new password and save
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save();
        // Generate new auth token
        const authToken = (0, tokenHelper_1.generateToken)(user._id.toString(), user.role);
        res.status(200).json({
            message: 'Password reset successful',
            token: authToken
        });
    }
    catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({
            error: 'Error resetting password'
        });
    }
});
exports.resetPassword = resetPassword;
