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
    const { name, description, price, sale, thumbnails } = req.body;
    const { categoryId } = req.params;

    // Handle color or colors field
    const colors = req.body.colors || req.body.color;
    if (!colors || !Array.isArray(colors)) {
      return res.status(400).json({ error: 'Colors must be an array and cannot be empty' });
    }

    // Validate categoryId
    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ error: 'Invalid Category ID' });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Parse colors
    const parsedColors = colors.map((color: any) => {
      if (!color.colorName || isNaN(Number(color.quantity)) || Number(color.quantity) < 0) {
        throw new Error('Invalid color or quantity');
      }
      return {
        colorName: color.colorName,
        quantity: Number(color.quantity),
      };
    });

    // Handle image upload (if provided)
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Parse sale details
    const parsedSale = sale
      ? {
          discountPercentage: Number(sale.discountPercentage),
          saleEndDate: sale.saleEndDate ? new Date(JSON.parse(sale.saleEndDate)) : undefined,
        }
      : undefined;

    // Parse thumbnails
    const parsedThumbnails = thumbnails
      ? thumbnails.map((thumbnail: string) => thumbnail.replace(/"/g, '').trim())
      : [];

    // Create the product
    const product = new Product({
      name,
      description,
      price: Number(price),
      quantity: 0,
      category: category._id,
      colors: parsedColors,
      sale: parsedSale,
      thumbnails: parsedThumbnails,
      image,
    });

    await product.save();

    // Add the product's ObjectId to the category's products array
    category.products.push(product._id);
    await category.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error: any) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ error: error.message || 'Error creating product' });
  }
};

