import { Router } from 'express';
import { signUp, signIn, signOut } from '../controllers/authController';
import { verifyEmail } from '../controllers/verifyEmail';

const router = Router();

// Auth routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/verify-email', verifyEmail);

export default router;