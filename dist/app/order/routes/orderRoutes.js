"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../user/helpers/authMiddleware");
const createOrder_1 = require("../controllers/createOrder");
const getAllOrders_1 = require("../controllers/getAllOrders");
const getUserOrder_1 = require("../controllers/getUserOrder");
const updateOrdersStatus_1 = require("../controllers/updateOrdersStatus");
const router = (0, express_1.Router)();
// Routes for Orders
router.post('/', authMiddleware_1.isAuth, createOrder_1.createOrder);
router.get('/myorders', authMiddleware_1.isAuth, getUserOrder_1.getUserOrders);
router.get('/all', authMiddleware_1.isAdmin, getAllOrders_1.getAllOrders);
router.patch('/:id/status', authMiddleware_1.isAdmin, updateOrdersStatus_1.updateOrderStatus);
exports.default = router;
