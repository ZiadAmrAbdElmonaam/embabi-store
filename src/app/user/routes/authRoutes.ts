import express from 'express';
import { signup } from '../controllers/signup';
import { verifyEmail } from '../controllers/verifyEmail';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);

export default router;