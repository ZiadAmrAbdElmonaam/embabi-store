import { Request, Response } from 'express';
import Category from '../models/category';

// Create a new Category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ error: 'Error creating category' });
  }
};

// Get a specific Category with its products
export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id).populate('products');
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching category' });
  }
};

// Delete a Category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting category' });
  }
}

// Update a Category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json({ message: 'Category updated', category });
  } catch (error) {
    res.status(500).json({ error: 'Error updating category' });
  }
}

// get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
}