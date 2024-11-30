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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = void 0;
const user_1 = require("../models/user");
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code } = req.body;
        const user = yield user_1.User.findOne({
            email,
            verificationCode: code,
            verificationCodeExpires: { $gt: new Date() }
        });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired verification code'
            });
        }
        // Update user verification status
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        yield user.save();
        res.status(200).json({
            message: 'Email verified successfully'
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
