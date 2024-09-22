import { Request, Response } from 'express';
import Category from '../../category/models/category';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import Product from '../models/prodcut';

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

// Create Product Controller
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, colors, sale, thumbnails } = req.body; // Remove categoryId from body
    const { categoryId } = req.params; // Get categoryId from the URL parameters

    // Validate categoryId
    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ error: 'Invalid Category ID' });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Get the image path (multer already handled the upload)
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Create the product
    const product = new Product({
      name,
      description,
      price,
      category: category._id,
      colors,
      sale,
      thumbnails,
      image,  // Store the uploaded image path
    });

    await product.save();

    // Add the product's ObjectId to the category's products array
    category.products.push(product._id);
    await category.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  }
};