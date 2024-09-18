import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  const { categoryId } = req.params; 

  if (!mongoose.isValidObjectId(categoryId)) {
    return res.status(400).json({ error: 'Invalid Category ID' });
  }

  next(); 
};
