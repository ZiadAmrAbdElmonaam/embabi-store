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
exports.getProductsForCategory = void 0;
const category_1 = __importDefault(require("../../category/models/category"));
const mongoose_1 = __importDefault(require("mongoose"));
const getProductsForCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        if (!mongoose_1.default.isValidObjectId(categoryId)) {
            return res.status(400).json({ error: 'Invalid Category ID' });
        }
        const category = yield category_1.default.findById(categoryId).populate('products');
        if (!category)
            return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(category.products);
    }
    catch (error) {
        console.error('Error fetching products for category:', error);
        res.status(500).json({ error: 'Error fetching products for category' });
    }
});
exports.getProductsForCategory = getProductsForCategory;
