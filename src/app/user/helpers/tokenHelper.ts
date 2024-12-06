import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, role: 'user' | 'admin'): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};
