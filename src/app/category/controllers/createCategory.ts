import { Request, Response } from 'express';
import Category from '../models/category';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    console.log('category:', category);
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ error: 'Error creating category' });
  }
};