"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = exports.isAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    var _a;
    // Get token from the Authorization header
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        // Check if the role is 'admin'
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        // If admin, continue to the next middleware or route handler
        next();
    }
    catch (err) {
        return res.status(400).json({ error: 'Invalid token.' });
    }
};
exports.isAdmin = isAdmin;
// Middleware to check if user is authenticated
const isAuth = (req, res, next) => {
    var _a;
    // Get token from the Authorization header
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        // Verify the token
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        // If authenticated, continue to the next middleware or route handler
        next();
    }
    catch (err) {
        return res.status(400).json({ error: 'Invalid token.' });
    }
};
exports.isAuth = isAuth;
