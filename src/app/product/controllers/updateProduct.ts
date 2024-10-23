import { Request, Response } from 'express';
import Category from '../../category/models/category';
import mongoose, { ObjectId } from 'mongoose';
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

// Update Product Controller
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId, categoryId } = req.params; // Get productId and categoryId from the URL parameters
    const { name, description, price, colors, sale, thumbnails } = req.body;

    // Validate productId
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ error: 'Invalid Product ID' });
    }

    // Validate categoryId
    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ error: 'Invalid Category ID' });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Convert and validate the colors array
    let parsedColors;
    if (colors && Array.isArray(colors)) {
      parsedColors = colors.map((color: any) => {
        return {
          colorName: color.colorName,
          quantity: Number(color.quantity), // Convert quantity to a number
        };
      });

      for (const color of parsedColors) {
        if (!color.colorName || typeof color.quantity !== 'number' || color.quantity < 0) {
          return res.status(400).json({ error: 'Invalid color or quantity' });
        }
      }
    }

    // Handle image update if a new file is uploaded
    const image = req.file ? `/uploads/${req.file.filename}` : product.image;

    // Update product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = Number(price) || product.price; // Convert price to a number
    product.colors = parsedColors || product.colors; // Use the parsed colors if available
    product.sale = sale || product.sale;
    product.thumbnails = thumbnails || product.thumbnails;
    product.image = image; // Update image only if a new one is provided

    // Check if category exists and update if needed
    if (categoryId && categoryId !== product.category.toString()) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      product.category = category._id as ObjectId;
    }

    // Save the updated product
    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
};


