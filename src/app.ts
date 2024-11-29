import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './app/auth/routes/authRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/embabistore')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic test route
app.get('/test', (req, res) => {
  res.json({ message: 'Main server is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Log all registered routes
console.log('All registered routes:');
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) { // routes registered directly on the app
    console.log(`Direct route: ${middleware.route.path}`);
  } else if (middleware.name === 'router') { // router middleware
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
  console.log('404 for URL:', req.url); // Add this line to log 404s
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/test`);
  console.log(`Auth routes base URL: http://localhost:${PORT}/api/auth`);
});

export default app; 