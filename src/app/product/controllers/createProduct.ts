import { Request, Response } from 'express';
import Category from '../../category/models/category';
import Product from '../models/prodcut';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
});
  
const upload = multer({ storage });

export const createProduct = [
    upload.single('image'), // Middleware for image upload
    async (req: Request, res: Response) => {
      try {
        const { name, description, price } = req.body;
        const { categoryId } = req.params;

        if (!mongoose.isValidObjectId(categoryId)) {
          return res.status(400).json({ error: 'Invalid Category ID' });
        }

        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ error: 'Category not found' });

        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        const product = new Product({
          name,
          description,
          price,
          category: category._id,
          image,
        });

        await product.save();

        category.products.push(product._id);
        await category.save();

        res.status(201).json({ message: 'Product created', product });
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Error creating product' });
      }
    },
];