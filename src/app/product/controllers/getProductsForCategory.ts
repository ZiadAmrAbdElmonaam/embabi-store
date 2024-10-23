import { Request, Response } from 'express';
import Category from '../../category/models/category';
import mongoose from 'mongoose';

export const getProductsForCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ error: 'Invalid Category ID' });
    }

    const category = await Category.findById(categoryId).populate('products');
    if (!category) return res.status(404).json({ error: 'Category not found' });

    res.status(200).json(category.products);
  } catch (error) {
    console.error('Error fetching products for category:', error);
    res.status(500).json({ error: 'Error fetching products for category' });
  }
};