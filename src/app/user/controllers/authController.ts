import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../helpers/tokenHelper';
import { signUpSchema, signInSchema, forgotPasswordSchema, resetPasswordSchema } from '../validations/authValidation';
import User from '../models/User';
import { verificationService } from '../../services/verification/verificationService';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../../services/email/emailService';
import { IUser } from '../interfaces/IUser';

// Sign-Up Controller
export const signUp = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { error } = signUpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate verification code
    const verificationCode = verificationService.generateVerificationCode();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role: role as 'user' | 'admin',
      verificationCode,
      verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isVerified: false
    });

    await user.save();

    // Send verification email
    await verificationService.sendVerificationEmail(email, verificationCode);

    res.status(201).json({ 
      message: 'User created successfully. Please check your email for verification code.',
      userId: user._id 
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Sign-In Controller
export const signIn = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { error } = signInSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Find user by email and explicitly type it as IUser
    const user = await User.findOne({ email }) as IUser | null;
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ error: 'Please verify your email first' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token with user info
    const token = generateToken(user._id.toString(), user.role);

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
  } catch (err) {
    console.error('Sign in error:', err);
    res.status(500).json({ error: 'Error signing in' });
  }
};

export const signOut = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Signed out successfully' });
};

// Forgot Password Controller
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    // Save reset code to user
    user.resetPasswordToken = hashedCode;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send reset password email
    try {
      await sendResetPasswordEmail(user.email, resetCode);
      res.status(200).json({
        message: 'Password reset code sent to email'
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(500).json({
        error: 'Error sending password reset email'
      });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({
      error: 'Error processing forgot password request'
    });
  }
};

// Reset Password Controller
export const resetPassword = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, code, newPassword } = req.body;

    // Hash the code from the request
    const hashedCode = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');

    // Find user with valid code
    const user = await User.findOne({
      email,
      resetPasswordToken: hashedCode,
      resetPasswordExpires: { $gt: Date.now() }
    }) as IUser | null;

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired reset code'
      });
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Generate new auth token
    const authToken = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      message: 'Password reset successful',
      token: authToken
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({
      error: 'Error resetting password'
    });
  }
};