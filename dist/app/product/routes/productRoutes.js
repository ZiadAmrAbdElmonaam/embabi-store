"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateObjectId_1 = require("../validators/validateObjectId");
const authMiddleware_1 = require("../../user/helpers/authMiddleware");
const createProduct_1 = require("../controllers/createProduct");
const deleteProductForCategory_1 = require("../controllers/deleteProductForCategory");
const getAllProducts_1 = require("../controllers/getAllProducts");
const getProduct_1 = require("../controllers/getProduct");
const getProductsForCategory_1 = require("../controllers/getProductsForCategory");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const updateProduct_1 = require("../controllers/updateProduct");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
// Product Routes
router.post('/:categoryId', validateObjectId_1.validateObjectId, authMiddleware_1.isAdmin, upload.single('image'), createProduct_1.createProduct);
router.put('/:categoryId/:productId', validateObjectId_1.validateObjectId, authMiddleware_1.isAdmin, upload.single('image'), updateProduct_1.updateProduct);
router.get('/:id', getProduct_1.getProduct);
router.get('/category/:categoryId', validateObjectId_1.validateObjectId, getProductsForCategory_1.getProductsForCategory);
router.get('/', getAllProducts_1.getAllProducts);
router.delete('/:categoryId/:productId', validateObjectId_1.validateObjectId, authMiddleware_1.isAdmin, deleteProductForCategory_1.deleteProductForCategory);
exports.default = router;
