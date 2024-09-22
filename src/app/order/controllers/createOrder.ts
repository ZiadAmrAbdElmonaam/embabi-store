import { Request, Response } from 'express';
import Order from '../models/order';
import jwt from 'jsonwebtoken';
import { createOrderSchema } from '../validations/orderValidation';

export const createOrder = async (req: Request, res: Response) => {
  const { error } = createOrderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { items, totalPrice } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };

    const order = new Order({
      user: decoded.userId,
      items,
      totalPrice,
    });

    await order.save();

    res.status(201).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
};