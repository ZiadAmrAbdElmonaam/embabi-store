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
exports.verifyEmail = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code } = req.body;
        const user = yield User_1.default.findOne({
            email,
            verificationCode: code,
            verificationCodeExpires: { $gt: new Date() }
        }).lean();
        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired verification code'
            });
        }
        // Update user verification status
        yield User_1.default.findByIdAndUpdate(user._id, {
            isVerified: true,
            $unset: {
                verificationCode: 1,
                verificationCodeExpires: 1
            }
        });
        // Generate JWT token after successful verification
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            role: user.role
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.status(200).json({
            message: 'Email verified successfully',
            token,
            role: user.role
        });
    }
    catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            message: 'Error verifying email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.verifyEmail = verifyEmail;
