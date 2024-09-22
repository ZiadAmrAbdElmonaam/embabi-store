import { Request, Response } from 'express';
import Order from '../models/order';
import jwt from 'jsonwebtoken';
import { createOrderSchema } from '../validations/orderValidation';

// Middleware to create a new order (for any authenticated user)
export const createOrder = async (req: Request, res: Response) => {
    // Validate the request body
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
  
      // Decode the token to get the user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
  
      // Create the order with the userId and products
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

// Middleware to get all orders for a specific user (authenticated users)
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };

    // Fetch orders for the user
    const orders = await Order.find({ user: decoded.userId }).populate('items.product');

    res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user orders' });
  }
};

// Middleware to get all orders (admin only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    // Fetch all orders (admin permission required)
    const orders = await Order.find().populate('items.product');

    res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
};

// Middleware to update order status (admin only)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Admin permission is checked using middleware (isAdmin)

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};