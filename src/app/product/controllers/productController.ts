import { Request, Response } from 'express';
import Category from '../../category/models/category';
import Product from '../models/prodcut';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';


// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the directory to save uploaded images
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique name for the file
    },
  });
  
  const upload = multer({ storage });
  
  // Create a new Product under a specific Category with image upload
  export const createProduct = [
    upload.single('image'), // Middleware to handle file upload
    async (req: Request, res: Response) => {
      try {
        const { name, description, price } = req.body;
        const { categoryId } = req.params;
  
        // Validate the categoryId
        if (!mongoose.isValidObjectId(categoryId)) {
          return res.status(400).json({ error: 'Invalid Category ID' });
        }
  
        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ error: 'Category not found' });
  
        // Get image path (or URL if you're using a service like AWS S3)
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;
  
        const product = new Product({
          name,
          description,
          price,
          category: category._id,
          image, // Save the image URL or path
        });
        await product.save();
  
        // Add the product's ObjectId to the category's products array
        category.products.push(product._id);
        await category.save();
  
        res.status(201).json({ message: 'Product created', product });
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Error creating product' });
      }
    },
  ];
  
  

// Get a specific Product by ID
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};
export const getProductsForCategory = async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
  
      // Validate the categoryId
      if (!mongoose.isValidObjectId(categoryId)) {
        return res.status(400).json({ error: 'Invalid Category ID' });
      }
  
      const category = await Category.findById(categoryId).populate('products');
      if (!category) return res.status(404).json({ error: 'Category not found' });
  
      res.status(200).json(category.products);
    } catch (error) {
      console.error('Error fetching products for category:', error);
      res.status(500).json({ error: 'Error fetching products for category' });
    }
  };
  
  // Get all products
  export const getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await Product.find().populate('category');
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching all products:', error);
      res.status(500).json({ error: 'Error fetching all products' });
    }
  };
  
  // Delete a product from a category
  export const deleteProductForCategory = async (req: Request, res: Response) => {
    try {
      const { categoryId, productId } = req.params;
  
      // Validate both IDs
      if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ error: 'Invalid Category ID or Product ID' });
      }
  
      const category = await Category.findById(categoryId);
      if (!category) return res.status(404).json({ error: 'Category not found' });
  
      // Remove the product reference from the category
      category.products = category.products.filter((product: mongoose.Types.ObjectId) => product.toString() !== productId);
      await category.save();
  
      // Delete the product itself
      await Product.findByIdAndDelete(productId);
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product for category:', error);
      res.status(500).json({ error: 'Error deleting product for category' });
    }
  };
