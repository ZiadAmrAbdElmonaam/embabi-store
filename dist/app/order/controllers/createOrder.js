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
exports.createOrder = void 0;
const order_1 = __importDefault(require("../models/order"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const orderValidation_1 = require("../validations/orderValidation");
const prodcut_1 = __importDefault(require("../../product/models/prodcut"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { error } = orderValidation_1.createOrderSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { items, totalPrice, address, email, name } = req.body;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, no token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        // Validate and update product inventory
        for (const item of items) {
            const product = yield prodcut_1.default.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    message: `Product with ID ${item.product} not found`
                });
            }
            // Validate color and quantity
            const productColor = product.colors.find(c => c.colorName === item.colors);
            if (!productColor) {
                return res.status(400).json({
                    message: `Color ${item.colors} not available for product ${product.name}`
                });
            }
            if (productColor.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for color ${item.colors} of product ${product.name}. Available: ${productColor.quantity}`,
                });
            }
            // Update inventory
            productColor.quantity -= item.quantity;
            yield product.save();
        }
        const newOrder = new order_1.default({
            user: decoded.userId,
            items,
            totalPrice,
            address,
            email,
            name,
        });
        const savedOrder = yield newOrder.save();
        return res.status(201).json({
            status: 'success',
            data: savedOrder,
        });
    }
    catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Error creating order' });
    }
});
exports.createOrder = createOrder;
