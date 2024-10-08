import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cors from 'cors'; 
import categoryRoutes from './app/category/routes/categoryRoutes';
import productRoutes from './app/product/routes/productRoutes';
import authRoutes from './app/user/routes/authRoutes';
import orderRoutes from './app/order/routes/orderRoutes';
import path from 'path';


dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: 'http://localhost:4200' // Allow only this origin
}));
// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Could not start the server:', error);
    process.exit(1);
  }
};

// Use Category and Product Routes
app.use('/api/categories', categoryRoutes); // Routes for categories
app.use('/api/products', productRoutes); // Routes for products
app.use('/api/orders',orderRoutes) // Routes for orders
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/auth',authRoutes)

// Start the server
startServer();
