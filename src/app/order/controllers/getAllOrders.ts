import { Request, Response } from 'express';
import Order from '../models/order';

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('items.product');

    res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
};