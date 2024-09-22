import { Request, Response } from 'express';
import Product from '../models/prodcut';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Error fetching all products' });
  }
};