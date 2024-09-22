import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { isAdmin, isAuth } from '../../user/helpers/authMiddleware';


const router = Router();

// Routes for Orders
router.post('/', isAuth, createOrder); 
router.get('/myorders', isAuth, getUserOrders); 
router.get('/all', isAdmin, getAllOrders); 
router.patch('/:id/status', isAdmin, updateOrderStatus);

export default router;