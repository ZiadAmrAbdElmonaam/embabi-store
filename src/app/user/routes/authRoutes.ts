import { Router } from 'express';
import { signUp, signIn, signOut, forgotPassword, resetPassword } from '../controllers/authController';
import { verifyEmail } from '../controllers/verifyEmail';

const router = Router();

// Auth routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;