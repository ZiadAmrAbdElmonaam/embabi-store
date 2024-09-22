import { Request, Response } from 'express';
import Order from '../models/order';
import jwt from 'jsonwebtoken';

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };

    const orders = await Order.find({ user: decoded.userId }).populate('items.product');

    res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user orders' });
  }
};