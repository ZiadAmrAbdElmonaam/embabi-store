"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
    },
    image: {
        type: String,
        required: false,
    },
    colors: [
        {
            colorName: { type: String, required: true },
            quantity: { type: Number, required: true, min: 0 },
            _id: false // This prevents MongoDB from adding _id to each color subdocument
        }
    ],
    sale: {
        discountPercentage: {
            type: Number,
            required: false,
        },
        saleEndDate: {
            type: Date,
            required: false,
        },
    },
    thumbnails: {
        type: [String],
        required: false,
    },
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
