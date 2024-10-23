import { Request, Response } from 'express';
import Category from '../../category/models/category';
import Product from '../models/prodcut';
import mongoose from 'mongoose';

export const deleteProductForCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId, productId } = req.params;

    if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ error: 'Invalid Category ID or Product ID' });
    }

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    category.products = category.products.filter((product: mongoose.Types.ObjectId) => product.toString() !== productId);
    await category.save();

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product for category:', error);
    res.status(500).json({ error: 'Error deleting product for category' });
  }
};