"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const verifyEmail_1 = require("../controllers/verifyEmail");
const router = (0, express_1.Router)();
// Auth routes
router.post('/signup', authController_1.signUp);
router.post('/signin', authController_1.signIn);
router.post('/signout', authController_1.signOut);
router.post('/verify-email', verifyEmail_1.verifyEmail);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password', authController_1.resetPassword);
exports.default = router;
