"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createOrderSchema = joi_1.default.object({
    items: joi_1.default.array()
        .items(joi_1.default.object({
        product: joi_1.default.string().required(),
        quantity: joi_1.default.number().min(1).required(),
        colors: joi_1.default.string().required(),
    }))
        .min(1)
        .required(),
    totalPrice: joi_1.default.number().min(0).required(),
    address: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    name: joi_1.default.string().required(),
});
exports.updateOrderStatusSchema = joi_1.default.object({
    status: joi_1.default.string()
        .valid('pending', 'ordered', 'prepared', 'shipped', 'cancelled', 'delivered')
        .required(),
});
