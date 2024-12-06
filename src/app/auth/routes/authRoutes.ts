import express from 'express';
import { signup } from '../controllers/signup';
import { verifyEmail } from '../controllers/verifyEmail';

const router = express.Router();

// Add a test route to verify the router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working' });
});

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);

// Log the routes when they're created
console.log('Auth routes registered:', 
  router.stack.map(r => r.route?.path)
);

export default router; 