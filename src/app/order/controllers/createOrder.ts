import { Request, Response } from 'express';
import Order from '../models/order';
import jwt from 'jsonwebtoken';
import { createOrderSchema } from '../validations/orderValidation';
import Product from '../../product/models/prodcut';
import User from '../../user/models/User';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { error } = createOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { items, totalPrice, address, email, name } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };

    // Validate and update product inventory
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ 
          message: `Product with ID ${item.product} not found` 
        });
      }

      // Validate color and quantity
      const productColor = product.colors.find(c => c.colorName === item.colors);
      if (!productColor) {
        return res.status(400).json({ 
          message: `Color ${item.colors} not available for product ${product.name}` 
        });
      }

      if (productColor.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for color ${item.colors} of product ${product.name}. Available: ${productColor.quantity}`,
        });
      }

      // Update inventory
      productColor.quantity -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      user: decoded.userId,
      items,
      totalPrice,
      address,
      email,
      name,
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      status: 'success',
      data: savedOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Error creating order' });
  }
};
