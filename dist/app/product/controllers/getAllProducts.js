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
exports.getAllProducts = void 0;
const prodcut_1 = __importDefault(require("../models/prodcut"));
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Populate both the _id and name of the category
        const products = yield prodcut_1.default.find().populate({
            path: 'category',
            select: '_id name' // Select both _id and name fields for the category
        });
        res.status(200).json(products);
    }
    catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ error: 'Error fetching all products' });
    }
});
exports.getAllProducts = getAllProducts;
