"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = void 0;
const category_1 = __importDefault(require("../../category/models/category"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const prodcut_1 = __importDefault(require("../models/prodcut"));
// Multer configuration for image uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
// Create Product Controller
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, sale, thumbnails } = req.body;
        const { categoryId } = req.params;
        // Handle color or colors field
        const colors = req.body.colors || req.body.color;
        if (!colors || !Array.isArray(colors)) {
            return res.status(400).json({ error: 'Colors must be an array and cannot be empty' });
        }
        // Validate categoryId
        if (!mongoose_1.default.isValidObjectId(categoryId)) {
            return res.status(400).json({ error: 'Invalid Category ID' });
        }
        // Check if category exists
        const category = yield category_1.default.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        // Parse colors
        const parsedColors = colors.map((color) => {
            if (!color.colorName || isNaN(Number(color.quantity)) || Number(color.quantity) < 0) {
                throw new Error('Invalid color or quantity');
            }
            return {
                colorName: color.colorName,
                quantity: Number(color.quantity),
            };
        });
        // Handle image upload (if provided)
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;
        // Parse sale details
        const parsedSale = sale
            ? {
                discountPercentage: Number(sale.discountPercentage),
                saleEndDate: sale.saleEndDate ? new Date(JSON.parse(sale.saleEndDate)) : undefined,
            }
            : undefined;
        // Parse thumbnails
        const parsedThumbnails = thumbnails
            ? thumbnails.map((thumbnail) => thumbnail.replace(/"/g, '').trim())
            : [];
        // Create the product
        const product = new prodcut_1.default({
            name,
            description,
            price: Number(price),
            quantity: 0,
            category: category._id,
            colors: parsedColors,
            sale: parsedSale,
            thumbnails: parsedThumbnails,
            image,
        });
        yield product.save();
        // Add the product's ObjectId to the category's products array
        category.products.push(product._id);
        yield category.save();
        res.status(201).json({ message: 'Product created successfully', product });
    }
    catch (error) {
        console.error('Error creating product:', error.message);
        res.status(500).json({ error: error.message || 'Error creating product' });
    }
});
exports.createProduct = createProduct;
