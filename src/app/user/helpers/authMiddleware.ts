import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Get token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

    // Check if the role is 'admin'
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // If admin, continue to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token.' });
  }
};
