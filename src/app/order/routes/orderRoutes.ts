import { Router } from 'express';
import { isAdmin, isAuth } from '../../user/helpers/authMiddleware';
import { createOrder } from '../controllers/createOrder';
import { getAllOrders } from '../controllers/getAllOrders';
import { getUserOrders } from '../controllers/getUserOrder';
import { updateOrderStatus } from '../controllers/updateOrdersStatus';


const router = Router();

// Routes for Orders
router.post('/', isAuth, createOrder); 
router.get('/myorders', isAuth, getUserOrders); 
router.get('/all', isAdmin, getAllOrders); 
router.patch('/:id/status', isAdmin, updateOrderStatus);

export default router;