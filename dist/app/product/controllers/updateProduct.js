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
exports.updateProduct = void 0;
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
// Update Product Controller
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, categoryId } = req.params; // Get productId and categoryId from the URL parameters
        const { name, description, price, colors, sale, thumbnails } = req.body;
        // Validate productId
        if (!mongoose_1.default.isValidObjectId(productId)) {
            return res.status(400).json({ error: 'Invalid Product ID' });
        }
        // Validate categoryId
        if (!mongoose_1.default.isValidObjectId(categoryId)) {
            return res.status(400).json({ error: 'Invalid Category ID' });
        }
        // Check if the product exists
        const product = yield prodcut_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        // Convert and validate the colors array
        let parsedColors;
        if (colors && Array.isArray(colors)) {
            parsedColors = colors.map((color) => {
                return {
                    colorName: color.colorName,
                    quantity: Number(color.quantity), // Convert quantity to a number
                };
            });
            for (const color of parsedColors) {
                if (!color.colorName || typeof color.quantity !== 'number' || color.quantity < 0) {
                    return res.status(400).json({ error: 'Invalid color or quantity' });
                }
            }
        }
        // Handle image update if a new file is uploaded
        const image = req.file ? `/uploads/${req.file.filename}` : product.image;
        // Update product details
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = Number(price) || product.price; // Convert price to a number
        product.colors = parsedColors || product.colors; // Use the parsed colors if available
        product.sale = sale || product.sale;
        product.thumbnails = thumbnails || product.thumbnails;
        product.image = image; // Update image only if a new one is provided
        // Check if category exists and update if needed
        if (categoryId && categoryId !== product.category.toString()) {
            const category = yield category_1.default.findById(categoryId);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            product.category = category._id;
        }
        // Save the updated product
        yield product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
    }
});
exports.updateProduct = updateProduct;
