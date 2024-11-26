import { Request, Response } from 'express';
import Order from '../models/order';
import jwt from 'jsonwebtoken';
import { createOrderSchema } from '../validations/orderValidation'; // Assuming you're using Joi for validation

export const createOrder = async (req: Request, res: Response) => {
  // Validate request body using Joi schema
  const { error } = createOrderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { items, totalPrice, address, email, name } = req.body;  // Include address, email, and name
    const token = req.headers.authorization?.split(' ')[1];  // Extract token from Authorization header

    // Check if token is provided
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }

    // Decode JWT to extract user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };

    // Create new order without manually setting orderId (handled by the pre-save hook in the schema)
    const newOrder = new Order({
      user: decoded.userId,
      items,
      totalPrice,
      address,    // Include address in order
      email,      // Include email in order
      name,       // Include name in order
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Return the newly created order
    return res.status(201).json({
      status: 'success',
      data: savedOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Error creating order' });
  }
};
