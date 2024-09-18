import { Router } from 'express';
import { createProduct, deleteProductForCategory, getAllProducts, getProduct, getProductsForCategory } from '../controllers/productController';
import { validateObjectId } from '../validators/validateObjectId';
import { isAdmin } from '../../user/helpers/authMiddleware';


const router = Router();

// Product Routes
router.post('/:categoryId', validateObjectId, isAdmin, createProduct); 
router.get('/:id', getProduct);
router.get('/category/:categoryId', validateObjectId, getProductsForCategory); 
router.get('/', getAllProducts); // Get all products
router.delete('/:categoryId/:productId', validateObjectId, isAdmin, deleteProductForCategory); 

export default router;
