"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the Counter schema
const counterSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true,
    },
    seq: {
        type: Number,
        default: 0,
    },
});
// Create and export the Counter model
const Counter = mongoose_1.default.model('Counter', counterSchema);
exports.default = Counter;
