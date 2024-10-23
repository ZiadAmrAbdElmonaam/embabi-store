import { Router } from 'express';
import { isAdmin } from '../../user/helpers/authMiddleware';
import { createCategory } from '../controllers/createCategory';
import { deleteCategory } from '../controllers/deleteCategory';
import { getAllCategories } from '../controllers/getAllCategories';
import { getCategory } from '../controllers/getCategory';
import { updateCategory } from '../controllers/updateCategory';


const router = Router();

// Category Routes
router.post('/', isAdmin, createCategory);
router.get('/:id', getCategory);
router.get('/', getAllCategories);
router.put('/:id', isAdmin, updateCategory);
router.delete('/:id', isAdmin, deleteCategory);

export default router;
