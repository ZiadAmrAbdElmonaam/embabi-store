"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../user/helpers/authMiddleware");
const createCategory_1 = require("../controllers/createCategory");
const deleteCategory_1 = require("../controllers/deleteCategory");
const getAllCategories_1 = require("../controllers/getAllCategories");
const getCategory_1 = require("../controllers/getCategory");
const updateCategory_1 = require("../controllers/updateCategory");
const router = (0, express_1.Router)();
// Category Routes
router.post('/', authMiddleware_1.isAdmin, createCategory_1.createCategory);
router.get('/:id', getCategory_1.getCategory);
router.get('/', getAllCategories_1.getAllCategories);
router.put('/:id', authMiddleware_1.isAdmin, updateCategory_1.updateCategory);
router.delete('/:id', authMiddleware_1.isAdmin, deleteCategory_1.deleteCategory);
exports.default = router;
