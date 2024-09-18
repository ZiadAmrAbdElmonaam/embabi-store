import { Router } from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from '../controllers/categoryController';
import { isAdmin } from '../../user/helpers/authMiddleware';


const router = Router();

// Category Routes
router.post('/', isAdmin, createCategory);
router.get('/:id', getCategory);
router.get('/', getAllCategories);
router.put('/:id', isAdmin, updateCategory);
router.delete('/:id', isAdmin, deleteCategory);

export default router;
