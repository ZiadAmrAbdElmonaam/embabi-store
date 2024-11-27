import { Request, Response } from 'express';
import Order from '../models/order';
import jwt from 'jsonwebtoken';
import { createOrderSchema } from '../validations/orderValidation'; // Assuming you're using Joi for validation
import Product from '../../product/models/prodcut';

export const createOrder = async (req: Request, res: Response) => {
  const { error } = createOrderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { items, totalPrice, address, email, name } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product} not found` });
      }

      for (const color of item.colors) {
        const productColor = product.colors.find(c => c.colorName === color.colorName);
        if (!productColor) {
          return res.status(400).json({ message: `Color ${color.colorName} not available for product ${product.name}` });
        }

        if (productColor.quantity < color.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for color ${color.colorName} of product ${product.name}. Available: ${productColor.quantity}`,
          });
        }

        // Deduct the quantity
        productColor.quantity -= color.quantity;
      }

      await product.save(); // Save the updated product
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
