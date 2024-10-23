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
    const { name, description, price, colors, sale, thumbnails } = req.body;
    const { categoryId } = req.params;

    // Validate categoryId
    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ error: 'Invalid Category ID' });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Convert `colors` quantities to numbers
    const parsedColors = colors.map((color: any) => ({
      colorName: color.colorName,
      quantity: Number(color.quantity), // Convert quantity to a number
    }));

    // Validate colors array
    for (const color of parsedColors) {
      if (!color.colorName || typeof color.quantity !== 'number' || color.quantity < 0) {
        return res.status(400).json({ error: 'Invalid color or quantity' });
      }
    }

    // Handle image upload (if provided)
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Parse sale details if provided
    const parsedSale = sale
      ? {
          discountPercentage: Number(sale.discountPercentage), // Convert discountPercentage to a number
          saleEndDate: sale.saleEndDate ? new Date(sale.saleEndDate) : undefined, // Convert saleEndDate to a Date
        }
      : undefined;

    // Parse thumbnails (remove extra quotes if necessary)
    const parsedThumbnails = thumbnails.map((thumbnail: string) => thumbnail.replace(/"/g, ''));

    // Create the product
    const product = new Product({
      name,
      description,
      price: Number(price), // Convert price to a number
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
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  }
};

