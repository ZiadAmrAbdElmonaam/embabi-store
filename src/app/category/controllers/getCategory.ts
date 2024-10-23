import { Request, Response } from 'express';
import Category from '../models/category';

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id).populate('products');
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching category' });
  }
};