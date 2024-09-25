import { Request, Response } from 'express';
import Product from '../models/prodcut';

export const getProduct = async (req: Request, res: Response) => {
  try {
    // Populate only specific fields of the category, excluding the products array
    const product = await Product.findById(req.params.id).populate({
      path: 'category',
      select: '_id name' // Only return the _id and name of the category
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};
