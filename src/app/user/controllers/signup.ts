import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { verificationService } from '../../services/verification/verificationService';
import User from '../models/User';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    // Generate verification code
    const verificationCode = verificationService.generateVerificationCode();

    // Hash password with explicit salt rounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if no role specified
      verificationCode,
      verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isVerified: false
    });

    await user.save();

    // Send verification email
    await verificationService.sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: 'User created successfully. Please check your email for verification code.'
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Error creating user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 