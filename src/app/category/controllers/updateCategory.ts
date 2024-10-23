import { Request, Response } from 'express';
import Category from '../models/category';

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json({ message: 'Category updated', category });
  } catch (error) {
    res.status(500).json({ error: 'Error updating category' });
  }
};