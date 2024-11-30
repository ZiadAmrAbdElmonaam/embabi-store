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
exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const verificationService_1 = require("../../services/verification/verificationService");
const User_1 = __importDefault(require("../models/User"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }
        // Generate verification code
        const verificationCode = verificationService_1.verificationService.generateVerificationCode();
        // Hash password with explicit salt rounds
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        // Create new user
        const user = new User_1.default({
            email,
            password: hashedPassword,
            role: role || 'user',
            verificationCode,
            verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000),
            isVerified: false
        });
        yield user.save();
        // Send verification email
        yield verificationService_1.verificationService.sendVerificationEmail(email, verificationCode);
        res.status(201).json({
            message: 'User created successfully. Please check your email for verification code.'
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            message: 'Error creating user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.signup = signup;
