import { Router } from 'express';
import { validateObjectId } from '../validators/validateObjectId';
import { isAdmin } from '../../user/helpers/authMiddleware';
import { createProduct } from '../controllers/createProduct';
import { deleteProductForCategory } from '../controllers/deleteProductForCategory';
import { getAllProducts } from '../controllers/getAllProducts';
import { getProduct } from '../controllers/getProduct';
import { getProductsForCategory } from '../controllers/getProductsForCategory';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
const upload = multer({ storage });
const router = Router();

// Product Routes
router.post('/:categoryId', validateObjectId, isAdmin, upload.single('image'),createProduct); 
router.get('/:id', getProduct);
router.get('/category/:categoryId', validateObjectId, getProductsForCategory); 
router.get('/', getAllProducts); 
router.delete('/:categoryId/:productId', validateObjectId, isAdmin, deleteProductForCategory); 

export default router;
