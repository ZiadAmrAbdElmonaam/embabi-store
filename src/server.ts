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

// Middleware
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Log all registered routes
console.log('All registered routes:');
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    console.log(`Direct route: ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler: any) => {
      if (handler.route) {
        const path = handler.route.path;
        const methods = Object.keys(handler.route.methods);
        console.log(`Router route: ${methods} ${path}`);
      }
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 routes
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Test URL: http://localhost:${PORT}/test`);
      console.log(`Auth routes base URL: http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('Could not start the server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
