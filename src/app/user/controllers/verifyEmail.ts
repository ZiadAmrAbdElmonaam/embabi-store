import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../auth/models/user';

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
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
    await user.save();

    // Generate JWT token after successful verification
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Email verified successfully',
      token
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      message: 'Error verifying email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 