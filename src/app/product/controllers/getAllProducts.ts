import { Request, Response } from 'express';
import Product from '../models/prodcut';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Populate both the _id and name of the category
    const products = await Product.find().populate({
      path: 'category',
      select: '_id name' // Select both _id and name fields for the category
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Error fetching all products' });
  }
};
